import 'dotenv/config'
import mongoose from 'mongoose'

const DB_HOST = process.env.DB_HOST
const DB_PORT = process.env.DB_PORT
const DB_NAME = process.env.DB_NAME

const URI = `mongodb://${DB_HOST}:${DB_PORT}/${DB_NAME}`

export const connectDB = async () => {
    try {
        console.log(`Bắt đầu kết nối với DB qua URI: ${URI}`);
        await mongoose.connect(URI);
        console.log(`Kết nối với DB thành công !`);
    } catch (error) {
        console.log(`Lỗi kết nối Database: ${error}`);
        process.exit();
    }

}