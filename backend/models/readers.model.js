import mongoose from "mongoose";

const readerSchema = new mongoose.Schema(
    {
       reader_code:{
        type: String,
        unique: true,
        required: true
       },
       name:{
        type: String,
        required: true,
       },
       phone :{
        type: String,
        required: true,
       }
    },
    {
        timestamps: true, // tự động tạo các trường createdAt và updatedAt
        versionKey: false // bỏ qua việc tạo trường __v
    }
)

// virtual - accessor - get
// virtual - mutator - set

export const readerModel = mongoose.model('Reader', readerSchema);