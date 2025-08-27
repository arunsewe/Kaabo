import { Request, Response } from "express";
import argon2 from "argon2";
import User from "../models/User";
import { issueAccessToken } from "../utils/jwt";

export async function loginUser(req: Request, res: Response) {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ where: { email } });
    if (!user) return res.status(401).json({ error: "Invalid credentials" });

    const ok = await argon2.verify(user.passwordHash, password);
    if (!ok) return res.status(401).json({ error: "Invalid credentials" });

    const token = issueAccessToken({ sub: user.id, role: user.role });
    return res.json({ accessToken: token, tokenType: "Bearer", expiresIn: "15m" });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Internal server error" });
  }
}
