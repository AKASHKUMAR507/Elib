import express from 'express';
import { createBook } from './bookController';
import multer from 'multer';
import path from 'node:path';

const bookRouter = express.Router();

const upload = multer({
    dest: path.resolve(__dirname, '../../public/data/upload'),
    limits: { fieldSize: 3e7 }, // 3e7 = 30mb
})

const fieldsData = [
    { name: 'coverImage', maxCount: 1 },
    { name: 'file', maxCount: 1 }
]

bookRouter.post('/', upload.fields[fieldsData], createBook)


export default bookRouter;