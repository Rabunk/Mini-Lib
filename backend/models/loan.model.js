import mongoose from "mongoose";

const loanSchema = new mongoose.Schema(
    {
        loan_code: {
            type: String, unique: true, required: true
        },
        reader: {
            id: {
                type: mongoose.Schema.Types.ObjectId, ref: 'Reader', required: true
            },
            name: { type: String, required: true}
        },
        book: {
            id: {
                type: mongoose.Schema.Types.ObjectId, ref: 'Book', required: true
            },
            title: { type: String, required: true}
        },
        borrow_date: {
            type: Date, required: true
        },
        return_date: {
            type: Date, required: true
        },
        returned_at: {
            type: Date
        },
        status: {
            type: String,
            enum: ["Đang mượn", "Đã trả", "Quá hạn"],
            default: "Đang mượn",
            required: true
        },
        fine: {
            amount: Number,
            note: String
        }

    },

    {
        timestamps: true, // tự động tạo các trường createdAt và updatedAt
        versionKey: false // bỏ qua việc tạo trường __v
    }
)

// virtual - accessor - get
// virtual - mutator - set

// collection trung gian của Food và Order
export const loanModel = mongoose.model('Loan', loanSchema);