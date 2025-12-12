import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
    {
       deliveryAddress :{
        type: String,
        required: true
       },
       status:{
        type: String,
        enum: ["pending", "in_progress", "shipping", "delivered", "canceled"],
        default: "pending"
       },
       customer :{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
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

export const orderModel = mongoose.model('Order', orderSchema);