import express from 'express';
import { createBook } from './bookController';
import multer from 'multer';
import path from 'node:path';
import { authenticate } from '../middleware/authenticate';

const bookRouter = express.Router();

const upload = multer({
    dest: path.resolve(__dirname, '../../public/data/upload'),
    limits: { fieldSize: 10 * 1024 * 1024 }, // 3e7 = 30mb 
})

const fieldsData = [
    { name: 'coverImage', maxCount: 1 },
    { name: 'file', maxCount: 1 }
]

bookRouter.post('/', authenticate, upload.fields(fieldsData), createBook)


export default bookRouter;