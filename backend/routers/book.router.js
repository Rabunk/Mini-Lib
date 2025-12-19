import express from "express";
import {
  getAllBooks,
  getBookById,
  addNewBook,
  updateBook,
  deleteBook
} from "../controllers/book.controller.js";
import { authentication , isAdmin } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.get('/',  getAllBooks);
router.get('/:id' , getBookById);
router.post('/' , addNewBook);
router.put('/:id' , updateBook);
router.delete('/:id' , deleteBook);

export default router;
