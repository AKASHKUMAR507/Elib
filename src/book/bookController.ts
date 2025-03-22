import { NextFunction, Request, Response } from "express";
import createHttpError from "http-errors";
import cloudinary from "../config/cloudinary";
import path from "node:path";
import { BookModel } from "./bookModel";
import fs from 'node:fs'
import { Book } from "./bookTypes";

const createBook = async (req: Request, res: Response, next: NextFunction) => {
    const { title, author, description, genre } = req.body;

    if(!title || !genre) {
        return next(createHttpError(404, 'All fields are required'))
    }
    const files = req.files as { [filename: string]: Express.Multer.File[] };

    const coverImageMineType = files.coverImage[0].mimetype.split('/').at(-1);
    const fileName = files.coverImage[0].filename;
    const filePath = path.resolve(__dirname, '../../public/data/upload', fileName);

    let uploadResult;
    try {
        uploadResult = await cloudinary.uploader.upload(filePath, {
            filename_override: fileName,
            folder: 'book-covers',
            format: coverImageMineType,
        });

    } catch (error) {
        return next(createHttpError(500, 'Error uploading image' + error))
    }

    const bookMineType = files.file[0].mimetype.split('/').at(-1);
    const bookFileName = files.file[0].filename;
    const bookFilePath = path.resolve(__dirname, '../../public/data/upload', bookFileName);

    let bookUploadFileResult;
    try {
        bookUploadFileResult = await cloudinary.uploader.upload(bookFilePath, {
            resource_type: 'raw',
            filename_override: bookFileName,
            folder: 'books-pdf',
            format: bookMineType,
        });

    } catch (error) {
        return next(createHttpError(500, 'Error uploading book file' + error))
    }

    let newBook: Book;
    try {
        newBook = await BookModel.create({
            title,
            genre,
            author: '67dcdfb18b641629877ced3e',
            description,
            coverImage: uploadResult.secure_url,
            file: bookUploadFileResult.secure_url,
        })
    } catch (error) {
        return next(createHttpError(500, 'Error creating book' + error))
    };

    // @ts-ignore
    console.log('userId', req.userId);
    // delete temp file
    try {
        await fs.promises.unlink(filePath);
        await fs.promises.unlink(bookFilePath);
    } catch (error) {
        return next(createHttpError(500, 'Error deleting temp file' + error))
    };

    res.status(201).json({ id: newBook._id });
}

export { createBook }
