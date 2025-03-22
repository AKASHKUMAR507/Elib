import { NextFunction, Request, Response } from "express";
import createHttpError from "http-errors";

const createBook = async (req: Request, res: Response, next: NextFunction) => {
    const {} = req.body;
    try {
        let h: string;
    } catch (error) {
        return next(createHttpError(500, ` ${error}`))
    }
    res.json({ message: 'ok' });
}

export { createBook }