import { NextFunction, Request, Response } from "express";
import createHttpError from "http-errors";
import jwt from "jsonwebtoken";
import { config } from "../config/config";

// Extend the Request interface to include userId
interface CustomRequest extends Request {
    userId?: string;
}

interface DecodedToken {
    sub: string;
}

const authenticate = (req: CustomRequest, res: Response, next: NextFunction) => {
    const token = req.header('Authorization');

    if (!token || !token.startsWith('Bearer ')) {
        return next(createHttpError(401, 'Bearer token required'));
    }

    const parseToken = token.split(' ')[1];

    try {
        const decoded = jwt.verify(parseToken, config.secret as string) as DecodedToken;
        req.userId = decoded.sub; // Access sub property
        next();
    } catch {
        return next(createHttpError(401, 'Invalid token'));
    }
};

export { authenticate };
