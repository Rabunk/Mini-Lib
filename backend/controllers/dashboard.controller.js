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
      recentLoans
    ] = await Promise.all([
      bookModel.countDocuments(),
      readerModel.countDocuments(),
      bookModel.aggregate([
        { $group: { _id: null, total: { $sum: "$qty" } } }
      ]),
      loanModel.countDocuments({ status: "Đang mượn" }),
      loanModel.countDocuments({ status: "Quá hạn" }),
      loanModel
        .find()
        .populate("reader", "name")
        .populate("book", "title")
        .sort({ createdAt: -1 })
        .limit(10)
    ]);

    /* ===== Monthly stats ===== */
    const start = new Date();
    start.setMonth(start.getMonth() - 5);
    start.setDate(1);

    const borrowStats = await loanModel.aggregate([
      { $match: { borrow_date: { $gte: start } } },
      {
        $group: {
          _id: {
            year: { $year: "$borrow_date" },
            month: { $month: "$borrow_date" }
          },
          count: { $sum: 1 }
        }
      }
    ]);

    const returnStats = await loanModel.aggregate([
      {
        $match: {
          returnedAt: { $ne: null, $gte: start }
        }
      },
      {
        $group: {
          _id: {
            year: { $year: "$returnedAt" },
            month: { $month: "$returnedAt" }
          },
          count: { $sum: 1 }
        }
      }
    ]);

    res.status(200).json({
      totalTitles,
      totalCopies: totalCopiesAgg[0]?.total || 0,
      totalMembers,
      activeLoans,
      overdue: overdueLoans,
      monthly: {
        borrow: borrowStats,
        return: returnStats
      },
      recentLoans
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Lỗi server" });
  }
};
