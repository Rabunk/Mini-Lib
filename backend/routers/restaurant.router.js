import express from 'express';
import { authentication, isAdmin } from '../middlewares/auth.middleware.js';
import { getFoodById, addRestaurant } from '../controllers/restaurant.controller.js';

const router = express.Router();

router.get('/:id/foods', getFoodById)
router.post('/',authentication, isAdmin, addRestaurant)

// router.get('/admin/list', isAdmin ,(req, res)=>{
//     res.json({message:'xin chào admin'})
// })

export default router