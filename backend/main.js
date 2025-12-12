import { connectDB } from "./config/database.config.js";
import express from 'express';
import 'dotenv/config';
import AuthRouter from './routers/auth.router.js'
import RestaurantRouter from './routers/restaurant.router.js'
import OrderRouter from './routers/order.router.js'
import { authentication } from "./middlewares/auth.middleware.js";
import cors from 'cors';

const APP_PORT = process.env.APP_PORT;
const APP_HOST = process.env.APP_HOST;
const app = express();
app.use(cors());

await connectDB();

app.use(express.json()); 
app.use(express.urlencoded({ extended: true }));

app.use('/api/auth', AuthRouter);
app.use('/api/restaurants', RestaurantRouter);
app.use('/api/orders', authentication, OrderRouter);

app.listen(APP_PORT, APP_HOST, () => {
    console.log(`Server running at http://${APP_HOST}:${APP_PORT}`);
});
app.use(cors());