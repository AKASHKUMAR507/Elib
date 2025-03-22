import { Request } from "express";
import { User } from "../user/userTypes";

export interface Book {
    _id: string;
    title: string;
    author: User;
    description?: string;
    genre: string;
    coverImage: string;
    file: string;
    createdAt: Date;
    updatedAt: Date;
}

export interface CustomRequest extends Request {
    userId: string;
}