import { loanModel } from "../models/loan.model.js";
import { bookModel } from "../models/books.model.js";

export const getAllLoans = async (req, res) => {
  try {
    const today = new Date();

    await loanModel.updateMany(
      {
        status: "Đang mượn",
        return_date: { $lt: today }
      },
      { status: "Quá hạn" }
    );

    const loans = await loanModel
      .find()
      .populate("reader", "name")
      .populate("book", "title")
      .sort({ createdAt: -1 });

    res.json(loans);
  } catch (error) {
    res.status(500).json({ message: "Lỗi server" });
  }
};


export const borrowBook = async (req, res) => {
  try {
    const { readerId, bookId, dueDate } = req.body;

    const book = await bookModel.findById(bookId);
    if (!book || book.qty <= 0) {
      return res.status(400).json({ message: "Sách không có sẵn" });
    }

    book.qty -= 1;
    book.status = book.qty > 0 ? "Sẵn có" : "Hết sách";
    await book.save();

    const status =
      new Date(dueDate) < new Date(new Date().toDateString())
        ? "Quá hạn"
        : "Đang mượn";

    const loan = await loanModel.create({
      loan_code: `PM${Date.now()}`,
      reader: readerId,
      book: bookId,
      borrow_date: new Date(),
      return_date: new Date(dueDate),
      status
    });

    res.status(201).json(loan);
  } catch (error) {
    res.status(500).json({ message: "Lỗi server" });
  }
};


export const returnBook = async (req, res) => {
  try {
    const { id } = req.params;
    const { fineAmount, fineNote } = req.body;

    const loan = await loanModel.findById(id);
    if (!loan) {
      return res.status(404).json({ message: "Không tìm thấy phiếu mượn" });
    }

    if (loan.status === "Đã trả") {
      return res.status(400).json({ message: "Phiếu đã được trả" });
    }

    loan.status = "Đã trả";
    loan.returnedAt = new Date();
    loan.fine =
      fineAmount > 0
        ? { amount: Number(fineAmount), note: fineNote }
        : null;

    await loan.save();

    const book = await bookModel.findById(loan.book);
    if (book) {
      book.qty += 1;
      book.status = "Sẵn có";
      await book.save();
    }

    res.json(loan);
  } catch (error) {
    res.status(500).json({ message: "Lỗi server" });
  }
};
