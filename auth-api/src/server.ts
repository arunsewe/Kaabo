import express from "express";
import helmet from "helmet";
import cors from "cors";
import dotenv from "dotenv";
import sequelize from "./config/database";
import authRoutes from "./routes/authRoutes";
import userRoutes from "./routes/userRoutes";

dotenv.config();
const app = express();

app.use(express.json());
app.use(helmet());
app.use(cors());

app.use("/login", authRoutes);
app.use("/users", userRoutes);

sequelize.sync().then(() => {
  console.log("Database synced");
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
});
