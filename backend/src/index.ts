import dotenv from "dotenv";

import cors from "cors";
import express from "express";
import { json } from "body-parser";
import cookieParser from "cookie-parser";
// import aiRoutes from "./routes/ai/routes";
import authRoutes from "./routes/auth/route";
import userRoutes from "./routes/user/route";
import teamsRoutes from "./routes/team/route";
import adminRoutes from "./routes/admin/route";
// import companyRoutes from "/routes/company/route"
import ticketRoutes from "./routes/tickets/route";
import webhookRoutes from "./routes/webhooks/route";
import resourcesRoutes from "./routes/resources/route";
import subscriptionRoutes from "./routes/subscription/route";

dotenv.config();

const app = express();

const allowedOrigins = [
  "http://localhost:3000", 
  process.env.FRONTEND_URL || "",
].filter(Boolean);

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);
app.use(json());
app.use(cookieParser());

// app.use("/api/ai", aiRoutes);
// app.use("/api/company", companyRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/teams", teamsRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/tickets", ticketRoutes);
app.use("/api/resources", resourcesRoutes);
app.use("/api/subscription", subscriptionRoutes);

app.use("/api/webhooks", express.raw({ type: "application/json" }), webhookRoutes);

app.get("/api/health", (res: any) => {
  res.json({ status: "ok" });
});

app.listen(process.env.PORT || 4000, () => {
  console.log(`Server running on port ${process.env.PORT || 4000}`);
});