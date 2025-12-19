import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
    {
       username:{
        type: String,
        required: true
       },
       password :{
        type: String,
        required: true,
       },
       role :{
        type: String,
        enum:  ["admin", "customer"],
        default: 'admin'
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