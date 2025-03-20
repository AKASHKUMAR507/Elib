import { NextFunction, Request, Response } from "express";
import createHttpError from "http-errors";
import { UserModel } from "./userModel";
/**
 * 1. Validation
 * 2. Process
 * 3. Response
 */
const createUser = async (req: Request, res: Response, next: NextFunction) => {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
        const error = createHttpError(400, 'All field are required');
        return next(error)
    }

    const user = await UserModel.findOne({ email })
    if (user) {
        const error = createHttpError(400, 'User already exists with this email');
        return next(error)
    }

    

    res.json({ message: 'user created', name, email, password });
}

export { createUser }