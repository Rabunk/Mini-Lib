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
router.post('/' , isAdmin, addNewBook);
router.put('/:id' , isAdmin, updateBook);
router.delete('/:id' , isAdmin, deleteBook);

export default router;
