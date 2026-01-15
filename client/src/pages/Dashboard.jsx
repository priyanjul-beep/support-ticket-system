import { useEffect, useState } from "react";
import { getMyTickets, createTicket } from "../api/ticketApi";
import { useAuth } from "../context/AuthContext";
import socket from "../socket";
import toast from "react-hot-toast";

const Dashboard = () => {
  const { user } = useAuth();

  const [tickets, setTickets] = useState([]);
  const [showForm, setShowForm] = useState(false);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);

  // Fetch tickets
  const fetchTickets = async () => {
    const res = await getMyTickets();
    setTickets(res.data);
  };

  // Initial fetch
  useEffect(() => {
    fetchTickets();
  }, []);

  // JOIN USER ROOM (ONCE)
  useEffect(() => {
    if (user?.id) {
      socket.emit("joinRoom", user.id);
    }
  }, [user]);

  // REAL-TIME UPDATE + TOAST
  useEffect(() => {
    socket.on("ticketUpdated", (updatedTicket) => {
      // Toast notification
      toast.success(
        `Your ticket "${updatedTicket.title}" updated to ${updatedTicket.status}`
      );

      //  Update ticket in UI without reload
      setTickets((prevTickets) =>
        prevTickets.map((t) =>
          t._id === updatedTicket.ticketId
            ? {
                ...t,
                status: updatedTicket.status,
                reply: updatedTicket.reply
              }
            : t
        )
      );
    });

    return () => socket.off("ticketUpdated");
  }, []);

  // Submit new ticket
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title || !description) {
      toast.error("Title & description required");
      return;
    }

    setLoading(true);
    await createTicket({ title, description });

    toast.success("Ticket created successfully");

    setTitle("");
    setDescription("");
    setShowForm(false);

    await fetchTickets();
    setLoading(false);
  };

  const handleCancel = () => {
    setTitle("");
    setDescription("");
    setShowForm(false);
  };

  return (
    <div className="min-h-screen bg-gray-100 px-6 py-8">
      <div className="max-w-6xl mx-auto">

        {/* HEADER */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">
            My Support Tickets
          </h2>

          {!showForm && (
            <button
              onClick={() => setShowForm(true)}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
            >
              + New Ticket
            </button>
          )}
        </div>

        {/* TICKET FORM */}
        {showForm && (
          <div className="bg-white p-6 rounded-xl shadow mb-8">
            <h3 className="text-lg font-semibold mb-4">
              Raise New Ticket
            </h3>

            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                type="text"
                placeholder="Ticket title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full border px-3 py-2 rounded-lg"
              />

              <textarea
                rows="4"
                placeholder="Describe your issue"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full border px-3 py-2 rounded-lg"
              />

              <div className="flex gap-3">
                <button
                  type="submit"
                  disabled={loading}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-60"
                >
                  {loading ? "Submitting..." : "Submit"}
                </button>

                <button
                  type="button"
                  onClick={handleCancel}
                  className="bg-gray-200 px-4 py-2 rounded-lg hover:bg-gray-300"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* TICKET LIST */}
        {!showForm && (
          <>
            {tickets.length === 0 ? (
              <div className="bg-white p-6 rounded-lg shadow text-gray-500">
                No tickets raised yet.
              </div>
            ) : (
              <div className="grid gap-4">
                {tickets.map((t) => (
                  <div
                    key={t._id}
                    className="bg-white p-5 rounded-lg shadow border"
                  >
                    <div className="flex justify-between">
                      <h4 className="font-semibold text-lg">
                        {t.title}
                      </h4>

                      <span className="text-sm px-3 py-1 rounded-full bg-gray-100">
                        {t.status}
                      </span>
                    </div>

                    <p className="text-gray-600 mt-2">
                      {t.description}
                    </p>

                    <div className="mt-4">
                      <p className="text-sm font-semibold text-gray-700">
                        Admin Reply:
                      </p>
                      <p className="text-sm text-gray-500">
                        {t.reply ? t.reply : "—"}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}

      </div>
    </div>
  );
};

export default Dashboard;
