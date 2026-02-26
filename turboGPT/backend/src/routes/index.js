// import express from "express";
// import userRoute from "./user-routes.js";
// import chatRoutes from "./chat-routes.js";
// import notesRoutes from "./notes-routes.js";

// const appRouter = express.Router();

// appRouter.use("/user", userRoute);
// appRouter.use("/chat", chatRoutes); //approuter i t is
// router.use("/notes", notesRoutes);

// export default appRouter;


import { Router } from "express";
import userRoutes from "./user-routes.js";
import chatRoutes from "./chat-routes.js";
import notesRoutes from "./notes-routes.js";

const router = Router(); // ✅ THIS WAS MISSING

router.use("/user", userRoutes);
router.use("/chat", chatRoutes);
router.use("/notes", notesRoutes);

export default router;
