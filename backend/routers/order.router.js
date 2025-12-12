import express from 'express';
import {  isAdmin } from '../middlewares/auth.middleware.js';
import { getCustomerOrders,getDetailOrders, createOrder } from '../controllers/orders.controller.js';

const router = express.Router();

router.get('/me', getCustomerOrders);
router.get('/:id', getDetailOrders);
router.post('/', createOrder);

export default router