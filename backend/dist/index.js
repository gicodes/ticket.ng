"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
const cors_1 = __importDefault(require("cors"));
const express_1 = __importDefault(require("express"));
const body_parser_1 = require("body-parser");
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const route_1 = __importDefault(require("./routes/auth/route"));
const route_2 = __importDefault(require("./routes/team/route"));
const route_3 = __importDefault(require("./routes/admin/route"));
const route_4 = __importDefault(require("./routes/tickets/route"));
const route_5 = __importDefault(require("./routes/webhooks/route"));
dotenv_1.default.config();
const app = (0, express_1.default)();
const allowedOrigins = [
    "http://localhost:3000", process.env.FRONTEND_URL || "",
].filter(Boolean);
app.use((0, cors_1.default)({
    origin: (origin, callback) => {
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        }
        else {
            callback(new Error("Not allowed by CORS"));
        }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
}));
app.use((0, body_parser_1.json)());
app.use((0, cookie_parser_1.default)());
app.use("/api/auth", route_1.default);
app.use("/api/teams", route_2.default);
app.use("/api/admin", route_3.default);
app.use("/api/tickets", route_4.default);
app.use("/api/webhooks", route_5.default);
app.get("/api/health", (res) => {
    res.json({ status: "ok" });
});
app.listen(process.env.PORT || 4000, () => {
    console.log(`Server running on port ${process.env.PORT || 4000}`);
});
