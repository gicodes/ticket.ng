import dotenv from "dotenv";

import cors from "cors";
import express from "express";
import { json } from "body-parser";
import cookieParser from "cookie-parser";

import authRoutes from "./routes/auth/route";
import ticketRoutes from "./routes/tickets/route";
import webhookRoutes from "./routes/webhooks/route";

dotenv.config();

const app = express();

app.use(cors());
app.use(json());
app.use(cookieParser());

app.use("/api/auth", authRoutes);
app.use("/api/tickets", ticketRoutes);
app.use("/api/webhooks", webhookRoutes);

app.get("/api/health", (res: any) => {
  res.json({ status: "ok" });
});

app.listen(process.env.PORT || 4000, () => {
  console.log(`Server running on port ${process.env.PORT || 4000}`);
});