import { connectDB } from "./config/database.config.js";
import { readerModel } from "./models/readers.model.js";
import { userModel } from "./models/users.model.js";
import { bookModel } from "./models/books.model.js";
import { loanModel } from "./models/loan.model.js";
import bcrypt from "bcryptjs";

console.log("🌱 Bắt đầu seed data...");

await connectDB();

await Promise.all([
  userModel.deleteMany({}),
  readerModel.deleteMany({}),
  bookModel.deleteMany({}),
  loanModel.deleteMany({})
]);

/* ===================== USERS ===================== */
const passwordHash = await bcrypt.hash("admin123", 10);

const adminUser = await userModel.create({
  username: "admin",
  password: passwordHash,
  role: "admin"
});

/* ===================== READERS ===================== */
const readerNames = [
  "Nguyễn Minh Tú",
  "Phạm Văn Tùng",
  "Cao Minh Trang",
  "Nguyễn Văn Tài",
  "Đinh Đức Lộc"
];

const readers = [];
for (let i = 0; i < readerNames.length; i++) {
  const reader = await readerModel.create({
    reader_code: `DG00${i + 1}`,
    name: readerNames[i],
    phone: `090512345${i}`
  });
  readers.push(reader);
}

/* ===================== BOOKS ===================== */
const booksData = [
  { title: "Lập trình JavaScript", author: "Nguyễn Văn A", category: "Thiếu nhi", qty: 10 },
  { title: "Tìm hiểu Python", author: "Trần Thị B", category: "Khoa học", qty: 5 },
  { title: "Học về C++", author: "Lê Văn C", category: "Khoa học", qty: 7 },
  { title: "Lịch sử thế giới", author: "Phạm Thị D", category: "Lịch sử", qty: 3 },
  { title: "Văn học Việt Nam", author: "Hoàng Văn E", category: "Văn học", qty: 8 }
];

const books = [];
for (let i = 0; i < booksData.length; i++) {
  const b = booksData[i];
  const book = await bookModel.create({
    code: `B00${i + 1}`,
    isbn: `97831614841${i}`,
    title: b.title,
    author: b.author,
    category: b.category,
    qty: b.qty,
    status: b.qty > 0 ? "Sẵn có" : "Hết sách"
  });
  books.push(book);
}

/* ===================== LOANS ===================== */
await loanModel.create([
  {
    loan_code: "PM001",
    reader: {
      id: readers[0]._id,
      name: readers[0].name
    },
    book: {
      id: books[0]._id,
      title: books[0].title
    },
    borrow_date: new Date("2023-10-25"),
    return_date: new Date("2023-11-08"),
    status: "Đã trả",
    returned_at: new Date("2023-11-05")
  },
  {
    loan_code: "PM002",
    reader: {
      id: readers[1]._id,
      name: readers[1].name
    },
    book: {
      id: books[1]._id,
      title: books[1].title
    },
    borrow_date: new Date("2023-11-01"),
    return_date: new Date("2023-11-15"),
    status: "Đang mượn"
  }
]);

console.log("✅ Seed data thành công!");
process.exit();
