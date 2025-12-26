import { bookModel } from "../models/books.model.js";

export const getAllBooks = async (req, res) => {
    try {
        const books = await bookModel.find();
        res.status(200).json(books);
    } catch (error) {
        res.status(500).json({ message: "Lỗi server" });
    }
};

export const getBookById = async (req, res) => {
    try {
        const { id } = req.params;
        const book = await bookModel.findById(id);
        if (!book) {
            return res.status(404).json({ message: "Không tìm thấy sách" });
        }
        res.status(200).json(book);
    } catch (error) {
        res.status(500).json({ message: "Lỗi server" });
    }
};

export const addNewBook = async (req, res) => {
  try {
    const { code, isbn, title, author, category, qty, location } = req.body;
    const existingBook = await bookModel.findOne({ code });
    if (existingBook) {
      return res.status(400).json({ message: "Mã sách đã tồn tại" });
    }

    // ensure status is set according to qty (required by schema)
    const status = Number(qty) > 0 ? "Sẵn có" : "Hết sách";

    const newBook = new bookModel({ code, isbn, title, author, category, qty, location, status });
    await newBook.save();
    res.status(201).json(newBook);
  } catch (error) {
    res.status(500).json({ message: "Lỗi server", error: error.message });
  }
};

export const updateBook = async (req, res) => {
  try {
    const { id } = req.params;
    const { code, isbn, title, author, category, qty, location } = req.body;

    const book = await bookModel.findById(id);
    if (!book) {
      return res.status(404).json({ message: "Không tìm thấy sách" });
    }

    book.code = code ?? book.code;
    book.isbn = isbn ?? book.isbn;
    book.title = title ?? book.title;
    book.author = author ?? book.author;
    book.category = category ?? book.category;
    book.qty = qty ?? book.qty;
    book.location = location ?? book.location;
    book.status = book.qty > 0 ? "Sẵn có" : "Hết sách";

    await book.save();
    res.status(200).json(book);
  } catch (error) {
    res.status(500).json({ message: "Lỗi server" });
  }
};


export const deleteBook = async (req, res) => {
    try {
        const {id} = req.params;
        const book = await bookModel.findById(id);
        if(!book) {
            return res.status(404).json({ message: "Không tìm thấy sách" });
        }
        await bookModel.findByIdAndDelete(id);
        res.status(200).json({ message: "Xóa sách thành công" });
    } catch (error) {
        res.status(500).json({ message: "Lỗi server" });
    }
};
