import { NextFunction, Request, Response } from "express";
import createHttpError from "http-errors";
import { UserModel } from "./userModel";
import bcrypt from 'bcrypt'
import { sign } from "jsonwebtoken";
import { config } from "../config/config";
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

    try {
        const user = await UserModel.findOne({ email })
        if (user) {
            const error = createHttpError(400, 'User already exists with this email');
            return next(error)
        }
    } catch (error) {
        return next(createHttpError(500, 'Error while gating user' + error))
    }

    const hashPassword = await bcrypt.hash(password, 10);

    try {
        const newUser = await UserModel.create({ name, email, password: hashPassword });
        const token = sign({ sub: newUser._id }, config.secret as string, { expiresIn: '7d' });

        res.json({ accessToken: token });

    } catch (error) {
        return next(createHttpError(500, 'Error while creating user'))
    }
}

export { createUser }