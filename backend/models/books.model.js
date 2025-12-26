import mongoose from "mongoose";

const bookSchema = new mongoose.Schema(
    {
       code: {
        type: String,
        unique: true,
        required: true
       }, 
       isbn: {
        type: String,
        required: true,
        unique: true
       },
       title: {
        type: String,
        required: true
       },
       author: {
        type: String,
        required: true
       },
       category: {
        type: String,
        enum: ["Thiếu nhi", "Truyện tranh", "Lịch sử", "Khoa học", "Tiểu thuyết", "Văn học"],
        required: true
       },
       qty: {
        type: Number,
        required: true,
        min: 0
       },
      location: {
        type: String,
        default: ''
      },
       status: {
        type: String,
        enum: ["Sẵn có", "Hết sách"],
        required: true
       }
    },
    {
        timestamps: true, // tự động tạo các trường createdAt và updatedAt
        versionKey: false // bỏ qua việc tạo trường __v
    }
)

// virtual - accessor - get
// virtual - mutator - set

export const bookModel = mongoose.model('Book', bookSchema);