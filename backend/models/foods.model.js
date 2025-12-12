import mongoose from "mongoose";

const foodSchema = new mongoose.Schema(
    {
       name:{
        type: String,
        required: true
       },
       rating :{
        type: Number,
        min:0,
        max: 5,
        required: true,
       },
       price :{
        type: Number,
        required: true,
       },
       restaurant :{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Restaurant',
        required: true,
       },
    },
    {
        timestamps: true, // tự động tạo các trường createdAt và updatedAt
        versionKey: false // bỏ qua việc tạo trường __v
    }
)

// virtual - accessor - get
// virtual - mutator - set

export const foodModel = mongoose.model('Food', foodSchema);