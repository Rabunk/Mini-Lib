import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
    {
       name:{
        type: String,
        required: true
       },
       phone:{
        type: String,
        required: true,
        unique: true
       },
       password :{
        type: String,
        required: true,
       },
       role :{
        type: String,
        enum:  ["customer", "admin"],
        default: 'customer'
       },
    },
    {
        timestamps: true, // tự động tạo các trường createdAt và updatedAt
        versionKey: false // bỏ qua việc tạo trường __v
    }
)

// virtual - accessor - get
// virtual - mutator - set

export const userModel = mongoose.model('User', userSchema);