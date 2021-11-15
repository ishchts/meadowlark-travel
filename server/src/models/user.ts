import { Schema, model } from "mongoose";

const userSchema = new Schema({
  authId: String,
  name: String,
  email: String,
  role: String,
  created: Date,
});

export const User = model('User', userSchema);
