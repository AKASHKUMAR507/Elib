/* eslint-disable @typescript-eslint/no-unused-vars */
import express, { ErrorRequestHandler, NextFunction, Request, Response } from 'express';
import createHttpError, { HttpError } from 'http-errors';
import { config } from './config/config';
import globalErrorHandler from './middleware/globalErrorHandler';

const app = express();
app.use(express.json());

//Routes
app.get('/', (req: Request, res: Response, next: NextFunction) => {
    res.status(200).json({message: 'Hello World'});
})


app.use(globalErrorHandler)
export default app;