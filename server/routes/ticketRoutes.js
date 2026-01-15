import express from "express";
import {
  createTicket,
  getMyTickets,
  getAllTickets,
  updateTicket
} from "../controllers/ticketController.js";
import { protect, adminOnly } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", protect, createTicket);
router.get("/my", protect, getMyTickets);
router.get("/", protect, adminOnly, getAllTickets);
router.put("/:id", protect, adminOnly, updateTicket);

export default router;
