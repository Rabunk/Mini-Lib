import mongoose from "mongoose";

const restaurantSchema = new mongoose.Schema(
    {
       name:{
        type: String,
        required: true
       },
       address:{
        type: String,
        required: true,
       },
       rating :{
        type: Number,
        min:0,
        max: 5,
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

export const restaurantModel = mongoose.model('Restaurant', restaurantSchema);