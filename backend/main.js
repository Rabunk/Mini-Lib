import { connectDB } from "./config/database.config.js";
import express from 'express';
import 'dotenv/config';
import AuthRouter from './routers/auth.router.js';
import BookRouter from './routers/book.router.js';
import LoanRouter from './routers/loan.router.js';
import DashboardRouter from './routers/dashboard.router.js';
import ReaderRouter from './routers/reader.router.js';
import { authentication } from "./middlewares/auth.middleware.js";
import cors from 'cors';

const APP_PORT = process.env.APP_PORT;
const APP_HOST = process.env.APP_HOST;
const app = express();
app.use(cors({ origin: ['https://mini-lib-eta.vercel.app','http://localhost:5173','https://mini-lib-rabunks-projects.vercel.app'], credentials: true }));

await connectDB();

app.use(express.json()); 
app.use(express.urlencoded({ extended: true }));

app.use('/api/auth', AuthRouter);
app.use('/api/books', BookRouter);
app.use('/api/loans', LoanRouter);
app.use('/api/dashboard', DashboardRouter);
app.use('/api/readers', ReaderRouter);
app.use('/api/test', (req, res) => {
    res.json({message: 'API is working'});
});
app.use('/', (req, res) => {
    res.send('Welcome to Mini Library API');
});

app.listen(APP_PORT, APP_HOST, () => {
    console.log(`Server running at http://${APP_HOST}:${APP_PORT}`);
});
app.use(cors());