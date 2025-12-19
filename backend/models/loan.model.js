import mongoose from "mongoose";

const loanSchema = new mongoose.Schema(
  {
    loan_code: {
      type: String,
      unique: true,
      required: true
    },

    reader: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Reader",
      required: true
    },

    book: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Book",
      required: true
    },

    borrow_date: {
      type: Date,
      required: true
    },

    return_date: {
      type: Date,
      required: true
    },

    returnedAt: Date,

    status: {
      type: String,
      enum: ["Đang mượn", "Đã trả", "Quá hạn"],
      default: "Đang mượn"
    },

    fine: {
      amount: Number,
      note: String
    }
  },
  {
    timestamps: true,
    versionKey: false
  }
);

export const loanModel = mongoose.model("Loan", loanSchema);
