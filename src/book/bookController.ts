import { NextFunction, Request, Response } from "express";
import createHttpError from "http-errors";
import cloudinary from "../config/cloudinary";
import path from "node:path";
import { BookModel } from "./bookModel";
import fs from 'node:fs'
import { Book } from "./bookTypes";
import { CustomRequest } from "../middleware/authenticate";

const createBook = async (req: Request, res: Response, next: NextFunction) => {
    const { title, description, genre } = req.body;

    if (!title || !genre) {
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

    const _req = req as CustomRequest;

    let newBook: Book;
    try {
        newBook = await BookModel.create({
            title,
            genre,
            author: _req.userId,
            description,
            coverImage: uploadResult.secure_url,
            file: bookUploadFileResult.secure_url,
        })
    } catch (error) {
        return next(createHttpError(500, 'Error creating book' + error))
    };

    // delete temp file
    try {
        await fs.promises.unlink(filePath);
        await fs.promises.unlink(bookFilePath);
    } catch (error) {
        return next(createHttpError(500, 'Error deleting temp file' + error))
    };

    res.status(201).json({ id: newBook._id });
}

const updateBook = async (req: Request, res: Response, next: NextFunction) => {
    const { title, description, genre } = req.body;
    const { bookId } = req.params;

    const book = await BookModel.findOne({ _id: bookId });
    if (!book) {
        return next(createHttpError(404, 'Book not found'))
    };

    const _req = req as CustomRequest;
    if (book.author.toString() !== _req.userId) {
        return next(createHttpError(403, 'You are not the author of this book'))
    }

    const files = req.files as { [filename: string]: Express.Multer.File[] };
    let completeCoverImage = "";

    if (files.coverImage) {
        const coverMineType = files.coverImage[0].mimetype.split('/').at(-1);
        const fileName = files.coverImage[0].filename;
        const filePath = path.resolve(__dirname, '../../public/data/upload', fileName);

        completeCoverImage = fileName;

        const uploadResult = await cloudinary.uploader.upload(filePath, {
            filename_override: completeCoverImage,
            folder: 'book-covers',
            format: coverMineType,
        });

        completeCoverImage = uploadResult.secure_url;

        await fs.promises.unlink(filePath);
    };

    let completeBook = "";
    if (files.file) {
        const bookMineType = files.file[0].mimetype.split('/').at(-1);
        const bookFileName = files.file[0].filename;
        const bookFilePath = path.resolve(__dirname, '../../public/data/upload', bookFileName);

        completeBook = bookFileName;
        const bookUpdateResult = await cloudinary.uploader.upload(bookFilePath, {
            filename_override: bookFileName,
            folder: 'books-pdf',
            format: bookMineType,
        });

        completeBook = bookUpdateResult.secure_url;

        await fs.promises.unlink(bookFilePath);
    };

    const updateBook = await BookModel.findOneAndUpdate({ _id: bookId }, {
        title,
        description,
        genre,
        coverImage: completeCoverImage ? completeCoverImage : book.coverImage,
        file: completeBook ? completeBook : book.file,
    }, { new: true }).select("-__v");

    res.status(200).json({ message: 'Book updated successfully', data: updateBook });
};

const bookList = async (req: Request, res: Response, next: NextFunction) => {
    try {
        // add pagination
        const books = await BookModel.find();

        if (!books) {
            res.status(200).json({ message: `You don't have book`, data: [] })
        }

        res.status(200).json({ message: 'Book get successfully', data: books });
    } catch (error) {
        return next(createHttpError(500, 'Something went wrong' + error));
    }
};

const singleBook = async (req: Request, res: Response, next: NextFunction) => {
    const { bookId } = req.params;

    try {
        const book = await BookModel.findOne({ _id: bookId }).select("-__v");

        if (!book) {
            return next(createHttpError(404, 'book not found'));
        }

        res.status(200).json({ message: 'Book get successfully', data: book })
    } catch (error) {
        return next(createHttpError(500, 'Error while gating book'));
    }
};

const userBooks = async (req: Request, res: Response, next: NextFunction) => {
    const _req = req as CustomRequest;

    try {
        const book = await BookModel.find({ author: _req.userId }).select("-__v");

        if (!book) {
            return next(createHttpError(404, 'book not found'));
        }

        res.status(200).json({ message: 'Book get successfully', data: book })
    } catch (error) {
        console.log(error)
        return next(createHttpError(500, 'Error while gating book'));
    }
};

const deleteBook = async (req: Request, res: Response, next: NextFunction) => {
    const { bookId } = req.params;

    const book = await BookModel.findOne({ _id: bookId }).select("-__v");
    if (!book) {
        return next(createHttpError(404, 'Book not found'));
    }

    const _req = req as CustomRequest;
    if (book.author.toString() !== _req.userId) {
        return next(createHttpError(403, 'You can not delete book'));
    };


    const coverImageSplit = book.coverImage.split('/');
    const coverImagePublicId = coverImageSplit.at(-2) + '/' + coverImageSplit.at(-1)?.split('.').at(-2);
    // const coverImagePublicId = book.coverImage.split('/').splice(-2).join('/')?.split('.')?.at(-2);
    const bookPublicId = book.file.split('/').splice(-2).join('/');

    try {
        await cloudinary.uploader.destroy(coverImagePublicId);
        await cloudinary.uploader.destroy(bookPublicId, { resource_type: 'raw' });
    } catch (error) {
        return next(createHttpError(500, 'Error while deleting file from cloudinary'));
    }

    try {
        await BookModel.deleteOne({ _id: bookId });
    } catch (error) {
        return next(createHttpError(500, 'Error while deleting the book from database'));
    }

    res.status(200).json({ message: 'Book delete successfully' });
}
export { createBook, updateBook, bookList, singleBook, userBooks, deleteBook };
