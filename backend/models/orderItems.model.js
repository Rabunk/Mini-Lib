import mongoose from "mongoose";

const orderItemSchema = new mongoose.Schema(
    {
        quantity: {
            type: Number,
            required: true,
            min: 0
        },
        priceAtOrderTime: {
            type: Number,
            required: true,
            min: 0
        },
        order: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Order',
            required: true,
        },
        food: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Food',
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

// collection trung gian của Food và Order
export const orderItemModel = mongoose.model('OrderItem', orderItemSchema);