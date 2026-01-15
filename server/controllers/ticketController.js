import Ticket from "../model/Ticket.js";
import { io } from "../index.js";

export const updateTicket = async (req, res) => {
  const { status, reply } = req.body;

  const ticket = await Ticket.findById(req.params.id);
  if (!ticket) return res.status(404).json({ message: "Not found" });

  ticket.status = status;
  ticket.reply = reply;
  await ticket.save();

  //  REAL-TIME EVENT
  io.to(ticket.user.toString()).emit("ticketUpdated", {
    ticketId: ticket._id,
    title: ticket.title,
    status,
    reply
  });

  res.json(ticket);
};


export const createTicket = async (req, res) => {
  const { title, description } = req.body;

  const ticket = await Ticket.create({
    user: req.user._id,
    title,
    description
  });

  res.status(201).json(ticket);
};

export const getMyTickets = async (req, res) => {
  const tickets = await Ticket.find({ user: req.user._id });
  res.json(tickets);
};

export const getAllTickets = async (req, res) => {
  const tickets = await Ticket.find().populate("user", "name email");
  res.json(tickets);
};

// export const updateTicket = async (req, res) => {
//   const { status, reply } = req.body;

//   const ticket = await Ticket.findById(req.params.id);
//   if (!ticket) return res.status(404).json({ message: "Ticket not found" });

//   ticket.status = status || ticket.status;
//   ticket.reply = reply || ticket.reply;
//   await ticket.save();

//   res.json(ticket);
// };
