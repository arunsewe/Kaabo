import { Router } from "express";
import { createUser, deleteUser } from "../controllers/userController";
import { authMiddleware } from "../middleware/auth";

const router = Router();

router.post("/", createUser);
router.delete("/:id", authMiddleware, deleteUser);

export default router;
