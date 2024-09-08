import { Schema, Document, model } from "mongoose";

interface IPassword extends Document {
  id: Schema.Types.ObjectId;
  password: string;
}

const passwordSchema: Schema<IPassword> = new Schema({
  id: Schema.Types.ObjectId,
  password: String,
});

export const Password = model("passwords", passwordSchema);
