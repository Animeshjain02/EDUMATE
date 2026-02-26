// import express from "express";
// import morgan from "morgan";
// import appRouter from "./src/routes/index.js";
// import cookieParser from "cookie-parser";
// import cors from "cors";
// const app = express();
// import path from "path";
// import { fileURLToPath } from "url";

// const secret = process.env.COOKIE_SECRET;
// const frontendBaseURL = process.env.FRONTEND_BASEURL;

// //middlewares
// app.use(express.json());
// app.use(morgan("dev"));
// app.use(cookieParser(secret));
// app.use(
//   cors({
//     origin: frontendBaseURL,
//     credentials: true,
//   })
// );

// // Create __dirname equivalent
// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);

// // view engine setup
// app.use(express.static(path.join(__dirname, "public")));
// app.set("view engine", "ejs");

// //endpoints
// app.use("/api/v1/", appRouter);

// export default app;


import express from "express";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";



import appRouter from "./src/routes/index.js";

const app = express();

/* ===================== PATH SETUP ===================== */
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/* ===================== MIDDLEWARES ===================== */
app.use(express.json());
app.use(morgan("dev"));

// cookie parser (secret optional)
app.use(cookieParser(process.env.COOKIE_SECRET || "secret"));

// ✅ CORS (IMPORTANT)
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
    credentials: true,
  })
);

/* ===================== STATIC & VIEW ===================== */
app.use(express.static(path.join(__dirname, "public")));
app.set("view engine", "ejs");

/* ===================== ROUTES ===================== */
app.use("/api/v1", appRouter);

/* ===================== HEALTH CHECK ===================== */
app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Backend is running 🚀",
  });
});

export default app;


