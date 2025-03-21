import { NextFunction, Request, Response } from "express";
import createHttpError from "http-errors";
import { UserModel } from "./userModel";
import bcrypt from 'bcrypt'
import { sign } from "jsonwebtoken";
import { config } from "../config/config";
import { LoginUserTypes, User } from "./userTypes";
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

        res.status(201).json({ accessToken: token });

    } catch (error) {
        return next(createHttpError(500, 'Error while creating user'))
    }
}

const loginUser = async (req: Request, res: Response, next: NextFunction) => {
    const { email, password } = req.body;

    if (!email || !password) {
        const error = createHttpError(400, 'All field are required');
        return next(error);
    }

    try {
        const user = await UserModel.findOne({ email });

        if (!user) {
            const error = createHttpError(400, 'User not found');
            return next(error);
        }

        const isValidPassword = await bcrypt.compare(password, user.password);
        if (!isValidPassword) {
            const error = createHttpError(400, 'Invalid password');
            return next(error);
        }

        const token = sign({ sub: user._id }, config.secret as string, { expiresIn: '7d' });

        const filterUser = {
            _id: user._id,
            name: user.name,
            email: user.email
        }

        res.json({ accessToken: token, user: filterUser })
    } catch (error) {
        return next(createHttpError(404, 'User not found'));
    }
}

export { createUser, loginUser }