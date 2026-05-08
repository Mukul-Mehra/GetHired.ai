import express from "express";
import cors from "cors"
const app = express();
import authRouter from "./routes/auth.routes.js"
import cookieParser from "cookie-parser";

const allowedOrigins = (process.env.CORS_ORIGINS || "http://localhost:5173")
    .split(",")
    .map((origin) => origin.trim())
    .filter(Boolean);

app.use(express.json({ limit: "1mb" }));
app.use(cookieParser());
app.use(cors({
    origin: allowedOrigins,
    credentials: true
}))

app.get("/api/health", (req, res) => {
    res.status(200).json({ ok: true });
});

app.use("/api/auth", authRouter)



export default app;



