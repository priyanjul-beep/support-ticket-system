import mongoose from "mongoose";

const ticketSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    title: {
      type: String,
      required: true
    },
    description: {
      type: String,
      required: true
    },
    status: {
      type: String,
      enum: ["Open", "In Progress", "Resolved"],
      default: "Open"
    },
    reply: { type: String, default: "" }
  },
  { timestamps: true }
);

export default mongoose.model("Ticket", ticketSchema);
