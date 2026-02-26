import mongoose from "mongoose";
import { randomUUID } from "crypto";

const messageSchema = new mongoose.Schema({
  id: {
    type: String,
    default: () => randomUUID(),
  },
  role: {
    type: String,
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
});

const sessionSchema = new mongoose.Schema({
  id: {
    type: String,
    default: () => randomUUID(),
  },
  title: {
    type: String,
    default: "New Chat",
  },
  messages: [messageSchema],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  sessions: [sessionSchema],
});

const userModel = mongoose.models.user || mongoose.model("user", userSchema);

export default userModel;
