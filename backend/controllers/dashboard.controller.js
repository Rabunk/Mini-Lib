import { bookModel } from "../models/books.model.js";
import { readerModel } from "../models/readers.model.js";
import { loanModel } from "../models/loan.model.js";

export const getDashboardSummary = async (req, res) => {
  try {
    const now = new Date();

    const [
      totalTitles,
      totalMembers,
      totalCopiesAgg,
      activeLoans,
      overdueLoans,
      loans
    ] = await Promise.all([
      bookModel.countDocuments(),
      readerModel.countDocuments(),
      bookModel.aggregate([
        { $group: { _id: null, total: { $sum: "$qty" } } }
      ]),
      loanModel.countDocuments({ status: "Đang mượn" }),
      loanModel.countDocuments({
        status: { $in: ["Đang mượn", "Quá hạn"] },
        return_date: { $lt: now }
      }),
      loanModel.find().sort({ createdAt: -1 }).limit(10)
    ]);

    // last 6 months
    const start = new Date();
    start.setMonth(start.getMonth() - 5);
    start.setDate(1);

    const monthlyStats = await loanModel.aggregate([
      { $match: { borrow_date: { $gte: start } } },
      {
        $group: {
          _id: {
            year: { $year: "$borrow_date" },
            month: { $month: "$borrow_date" }
          },
          borrowCount: { $sum: 1 },
          returnCount: {
            $sum: {
              $cond: [{ $eq: ["$status", "Đã trả"] }, 1, 0]
            }
          }
        }
      },
      { $sort: { "_id.year": 1, "_id.month": 1 } }
    ]);

    res.status(200).json({
      totalTitles,
      totalCopies: totalCopiesAgg[0]?.total || 0,
      totalMembers,
      activeLoans,
      overdue: overdueLoans,
      monthlyStats,
      recentLoans: loans
    });
  } catch (error) {
    res.status(500).json({ message: "Lỗi server" });
  }
};
