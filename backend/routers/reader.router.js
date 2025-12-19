import express from "express";
import {
  getAllReaders,
  getReaderById,
  addNewReader,
  updateReader,
  deleteReader
} from "../controllers/reader.controller.js";
import { authentication } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.get('/',  getAllReaders);
router.get('/:id',  getReaderById);
router.post('/',  addNewReader);
router.put('/:id',  updateReader);
router.delete('/:id',  deleteReader);

export default router;
