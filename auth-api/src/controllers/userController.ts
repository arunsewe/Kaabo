import { Request, Response } from "express";
import argon2 from "argon2";
import User from "../models/User";
import { isValidEmail, isStrongPassword } from "../utils/validators";

export async function createUser(req: Request, res: Response) {
  try {
    const { email, password } = req.body;
    if (!isValidEmail(email)) return res.status(400).json({ error: "Invalid email" });
    if (!isStrongPassword(password)) return res.status(400).json({ error: "Weak password" });

    const existing = await User.findOne({ where: { email } });
    if (existing) return res.status(409).json({ error: "Email already registered"});

    const passwordHash = await argon2.hash(password, { type: argon2.argon2id });
    const user = await User.create({ email, passwordHash });

    return res.status(201).json({ id: user.id, email: user.email, role: user.role });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal server error" });
  }
}

export async function deleteUser(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const user = await User.findByPk(id);
    if (!user) return res.status(404).json({ error: "User not found" });

    await user.destroy();
    return res.json({ deleted: id });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Internal server error" });
  }
}
