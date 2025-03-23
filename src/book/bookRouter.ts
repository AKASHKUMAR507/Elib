import express from 'express';
import { bookList, createBook, deleteBook, singleBook, updateBook, userBooks } from './bookController';
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

bookRouter.post('/', authenticate, upload.fields(fieldsData), createBook);
bookRouter.patch('/:bookId', authenticate, upload.fields(fieldsData), updateBook);
bookRouter.get('/', bookList);
bookRouter.get('/:bookId', singleBook);
bookRouter.get('/user/books', authenticate, userBooks);
bookRouter.delete('/user/:bookId', authenticate, deleteBook);

export default bookRouter;