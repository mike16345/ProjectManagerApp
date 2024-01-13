import mongoose, { Schema, Document } from "mongoose";

interface IPassword extends Document {
  id: mongoose.Schema.Types.ObjectId;
  password: string;
}

const passwordSchema: Schema<IPassword> = new Schema({
  id: mongoose.Schema.Types.ObjectId,
  password: String,
});

export const passwordModel = mongoose.model("passwords", passwordSchema);
