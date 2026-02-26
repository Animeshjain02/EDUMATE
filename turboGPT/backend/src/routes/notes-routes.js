import express from "express";
import multer from "multer";
import { uploadNotes } from "../controllers/notes-controller.js";

const router = express.Router();

const upload = multer({ dest: "uploads/" });

router.post("/upload", upload.single("pdf"), uploadNotes);

export default router;
