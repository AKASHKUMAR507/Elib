import mongoose from "mongoose";
import { Book } from "./bookTypes";

const bookSchema = new mongoose.Schema<Book>({
    title: { type: String, required: true },
    author: { type: mongoose.Schema.Types.ObjectId, required: true },
    genre: { type: String, required: true },
    coverImage: { type: String, required: true },
    description: { type: String },
    file: { type: String, required: true },
}, { timestamps: true })

const BookModel = mongoose.model<Book>('Book', bookSchema);
export { BookModel }