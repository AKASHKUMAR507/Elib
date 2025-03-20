import { NextFunction, Request, Response } from "express";
import createHttpError from "http-errors";
import { UserModel } from "./userModel";
import bcrypt from 'bcrypt'
/**
 * 1. Validation
 * 2. Process
 * 3. Response
 * 4. Hash password
 * 5. create new user in DB
 * 6. Generate JWT token
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

    const hashPassword = await bcrypt.hash(password, 10);

    const newUser = await UserModel.create({ name, email, password: hashPassword });

    res.json({ id: newUser._id });
}

export { createUser }