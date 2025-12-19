import express from 'express';
import { handleLogin, handleResgiter } from '../controllers/auth.controller.js';

const router = express.Router();

router.post('/login', handleLogin)
router.post('/register', handleResgiter)

export default router