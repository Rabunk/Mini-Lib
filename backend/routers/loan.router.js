import express from "express";
import {
  getAllLoans,
  borrowBook,
  returnBook
} from "../controllers/loan.controller.js";
import { authentication } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.get('/', getAllLoans);
router.post('/borrow', borrowBook);
router.post('/return/:id', returnBook);


export default router;
