import express from "express";
import { body } from "express-validator";
import {
  getTasks,
  getTask,
  createTask,
  updateTask,
  deleteTask,
  updateTaskStatus,
  updateTaskPriority,
} from "../controllers/taskController.js";
import { authenticate } from "../middleware/auth.js";

const router = express.Router();

// Validation rules
const taskValidation = [
  body("title").notEmpty().withMessage("Title is required"),
  body("description").notEmpty().withMessage("Description is required"),
  body("dueDate").isISO8601().withMessage("Valid due date is required"),
  body("priority")
    .isIn(["low", "medium", "high"])
    .withMessage("Invalid priority"),
];

// Apply authentication to all routes
router.use(authenticate);

router.get("/", getTasks);
router.get("/:id", getTask);
router.post("/", taskValidation, createTask);
router.put("/:id", taskValidation, updateTask);
router.delete("/:id", deleteTask);
router.patch(
  "/:id/status",
  body("status").isIn(["pending", "completed"]).withMessage("Invalid status"),
  updateTaskStatus
);
router.patch(
  "/:id/priority",
  body("priority")
    .isIn(["low", "medium", "high"])
    .withMessage("Invalid priority"),
  updateTaskPriority
);

export default router;
