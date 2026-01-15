import { useEffect, useState } from "react";
import { getAllTickets, updateTicket } from "../api/ticketApi";

const AdminDashboard = () => {
  const [tickets, setTickets] = useState([]);
  const [selectedTicket, setSelectedTicket] = useState(null);

  const [status, setStatus] = useState("In Progress");
  const [reply, setReply] = useState("");
  const [loading, setLoading] = useState(false);

  const fetchTickets = async () => {
    const res = await getAllTickets();
    setTickets(res.data);
  };

  useEffect(() => {
    fetchTickets();
  }, []);

  const handleActionClick = (ticket) => {
    setSelectedTicket(ticket);
    setStatus(ticket.status || "In Progress");
    setReply(ticket.reply || "");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);
    await updateTicket(selectedTicket._id, {
      status,
      reply
    });

    setSelectedTicket(null);
    setReply("");
    setStatus("In Progress");
    await fetchTickets();
    setLoading(false);
  };

  const handleCancel = () => {
    setSelectedTicket(null);
    setReply("");
    setStatus("In Progress");
  };

  return (
    <div className="min-h-screen bg-gray-100 px-6 py-8">
      <div className="max-w-6xl mx-auto">

        {/* HEADER */}
        <h2 className="text-2xl font-bold text-gray-800 mb-6">
          Admin – Support Tickets
        </h2>

        {/* ACTION FORM */}
        {selectedTicket && (
          <div className="bg-white p-6 rounded-xl shadow mb-8">
            <h3 className="text-lg font-semibold mb-4">
              Reply & Update Ticket
            </h3>

            <p className="text-sm text-gray-600 mb-3">
              <span className="font-medium">User:</span>{" "}
              {selectedTicket.user?.name} (
              {selectedTicket.user?.email})
            </p>

            <p className="text-sm text-gray-600 mb-4">
              <span className="font-medium">Issue:</span>{" "}
              {selectedTicket.title}
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* STATUS */}
              <div>
                <label className="block text-sm font-medium mb-1">
                  Status
                </label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  className="w-full border px-3 py-2 rounded-lg"
                >
                  <option value="Open">Open</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Resolved">Resolved</option>
                </select>
              </div>

              {/* REPLY */}
              <div>
                <label className="block text-sm font-medium mb-1">
                  Reply
                </label>
                <textarea
                  rows="4"
                  value={reply}
                  onChange={(e) => setReply(e.target.value)}
                  placeholder="Write your reply here..."
                  className="w-full border px-3 py-2 rounded-lg"
                />
              </div>

              {/* BUTTONS */}
              <div className="flex gap-3">
                <button
                  type="submit"
                  disabled={loading}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-60"
                >
                  {loading ? "Updating..." : "Submit"}
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
        {!selectedTicket && (
          <div className="grid gap-4">
            {tickets.map((t) => (
              <div
                key={t._id}
                className="bg-white p-5 rounded-lg shadow border"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-semibold text-lg">
                      {t.title}
                    </h4>
                    <p className="text-sm text-gray-500">
                      {t.user?.name} ({t.user?.email})
                    </p>
                  </div>

                  <span className="text-sm px-3 py-1 rounded-full bg-gray-100">
                    {t.status}
                  </span>
                </div>

                <p className="text-gray-600 mt-2">
                  {t.description}
                </p>

                <div className="mt-4">
                  <p className="text-sm font-semibold text-gray-700">
                    Reply:
                  </p>
                  <p className="text-sm text-gray-500">
                    {t.reply || "—"}
                  </p>
                </div>

                <button
                  onClick={() => handleActionClick(t)}
                  className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                >
                  Take Action
                </button>
              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
};

export default AdminDashboard;
