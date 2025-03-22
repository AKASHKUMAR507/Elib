import { NextFunction, Request, Response } from "express";
import createHttpError from "http-errors";
import cloudinary from "../config/cloudinary";
import path from "node:path";

const createBook = async (req: Request, res: Response, next: NextFunction) => {
    const files = req.files as { [filename: string]: Express.Multer.File[] };

    const coverImageMineType = files.coverImage[0].mimetype.split('/').at(-1);
    const fileName = files.coverImage[0].filename;
    const filePath = path.resolve(__dirname, '../../public/data/upload', fileName);
    
    try {
        const uploadResult = await cloudinary.uploader.upload(filePath, {
            filename_override: fileName,
            folder: 'book-covers',
            format: coverImageMineType,
        })

        if (!uploadResult) {
            return next(createHttpError(400, 'Failed to upload cover image'))
        }
    } catch (error) {
        return next(createHttpError(500, 'Error uploading image' + error))
    }

    const bookMineType = files.file[0].mimetype.split('/').at(-1);
    const bookFileName = files.file[0].filename;
    const bookFilePath = path.resolve(__dirname, '../../public/data/upload', bookFileName);

    try {
        await cloudinary.uploader.upload(bookFilePath, {
            resource_type: 'raw',
            filename_override: bookFileName,
            folder: 'books-pdf',
            format: bookMineType,
        });

    } catch (error) {
        return next(createHttpError(500, 'Error uploading book file' + error))
    }

    res.json({ message: 'ok' });
}

export { createBook }
