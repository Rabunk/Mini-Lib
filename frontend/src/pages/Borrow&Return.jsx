import React, { useEffect, useState } from 'react'
import ReactDOM from 'react-dom'
import { loanService } from '../config/loan.service.js'
import { bookService } from '../config/book.service.js'
import { readerService } from '../config/reader.service.js'

export default function BorrowAndReturn() {
  /* ================= STATE ================= */
  const [loanModal, setLoanModal] = useState(false)
  const [returnModal, setReturnModal] = useState(false)

  const [selectedReaderId, setSelectedReaderId] = useState('')
  const [selectedBookId, setSelectedBookId] = useState('')
  const [loanDueDate, setLoanDueDate] = useState('')

  const [selectedLoanId, setSelectedLoanId] = useState(null)
  const [returnFine, setReturnFine] = useState(0)
  const [returnNote, setReturnNote] = useState('')

  const [query, setQuery] = useState('')

  const [books, setBooks] = useState([])
  const [readers, setReaders] = useState([])
  const [loans, setLoans] = useState([])

  /* ================= LOAD DATA ================= */
  useEffect(() => {
    const loadAll = async () => {
      try {
        const [bk, rd, ln] = await Promise.all([
          bookService.getAll(),
          readerService.getAll(),
          loanService.getAll()
        ])

        setBooks(bk.data || [])
        setReaders(rd.data || [])
        setLoans(ln.data || [])
      } catch (err) {
        console.error('Load data failed', err)
      }
    }
    loadAll()
  }, [])

  /* ================= HELPERS ================= */
  const formatDate = (d) => {
    if (!d) return '-'
    const dt = new Date(d)
    return isNaN(dt) ? '-' : dt.toISOString().split('T')[0]
  }

  /* ================= SEARCH ================= */
  const q = query.toLowerCase()
  const filteredLoans = loans.filter(l => {
    const code = (l.loan_code || '').toLowerCase()
    const readerName = (l.reader?.name || '').toLowerCase()
    const bookTitle = (l.book?.title || '').toLowerCase()
    return code.includes(q) || readerName.includes(q) || bookTitle.includes(q)
  })

  /* ================= CREATE LOAN ================= */
  const openLoanModal = () => {
    setSelectedReaderId(readers[0]?._id || '')
    setSelectedBookId(books[0]?._id || '')
    const due = new Date()
    due.setDate(due.getDate() + 14)
    setLoanDueDate(due.toISOString().split('T')[0])
    setLoanModal(true)
  }

  const createLoan = async () => {
    if (!selectedReaderId || !selectedBookId || !loanDueDate) return

    try {
      const res = await loanService.borrow({
        readerId: selectedReaderId,
        bookId: selectedBookId,
        dueDate: loanDueDate
      })

      // reload after create (đảm bảo populate đúng)
      const ln = await loanService.getAll()
      const bk = await bookService.getAll()

      setLoans(ln.data || [])
      setBooks(bk.data || [])

      setLoanModal(false)
    } catch (err) {
      console.error('Borrow failed', err)
      alert('Tạo phiếu mượn thất bại')
    }
  }

  /* ================= RETURN BOOK ================= */
  const openReturnModal = (loanId) => {
    setSelectedLoanId(loanId)
    setReturnFine(0)
    setReturnNote('')
    setReturnModal(true)
  }

  const processReturn = async () => {
    try {
      await loanService.returnBook(selectedLoanId, {
        fineAmount: Number(returnFine) || 0,
        fineNote: returnNote
      })

      const ln = await loanService.getAll()
      const bk = await bookService.getAll()

      setLoans(ln.data || [])
      setBooks(bk.data || [])

      setReturnModal(false)
    } catch (err) {
      console.error('Return failed', err)
      alert('Trả sách thất bại')
    }
  }

  /* ================= RENDER ================= */
  return (
    <div className="space-y-6 h-full flex flex-col animate-fade-in">

      {/* HEADER */}
      <div className="glass-panel rounded-2xl p-6 flex justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Quản lý Mượn / Trả</h1>
          <p className="text-sm text-slate-400">Theo dõi phiếu mượn sách</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-right">
            <div className="text-sm text-slate-300">Thủ Thư A</div>
            <div className="text-xs text-slate-500">Quản lý kho</div>
          </div>

          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center text-white font-bold">
            TT
          </div>
        </div>
      </div>

      {/* SEARCH */}
      <div className="glass-panel p-4 rounded-2xl flex items-center justify-between">
        <input
          value={query}
          onChange={e => setQuery(e.target.value)}
          placeholder="Tìm mã phiếu, độc giả, sách..."
          className="glass-input w-72 rounded-xl px-4 py-2"
        />
        <button
          onClick={openLoanModal}
          className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-2 rounded-xl"
        >
          + Tạo phiếu mượn
        </button>
      </div>

      {/* TABLE */}
      <div className="glass-panel p-6 rounded-2xl flex-1 overflow-auto">
        <table className="w-full glass-table border-separate border-spacing-y-2">
          <thead>
            <tr className="text-xs text-slate-400 uppercase">
              <th className="px-4 py-2">Mã phiếu</th>
              <th className="px-4 py-2">Độc giả</th>
              <th className="px-4 py-2">Sách</th>
              <th className="px-4 py-2">Hạn trả</th>
              <th className="px-4 py-2">Trạng thái</th>
              <th className="px-4 py-2 text-right">Hành động</th>
            </tr>
          </thead>
          <tbody className="text-sm text-slate-200">
            {filteredLoans.map(l => (
              <tr key={l._id} className="group">
                <td className="px-4 py-3 font-mono text-slate-400">{l.loan_code}</td>
                <td className="px-4 py-3 font-bold text-white">{l.reader?.name}</td>
                <td className="px-4 py-3">{l.book?.title}</td>
                <td className="px-4 py-3">{formatDate(l.return_date)}</td>
                <td className="px-4 py-3">
                  <span className={`px-2 py-1 text-xs rounded-full border
                    ${l.status === 'Quá hạn'
                      ? 'bg-rose-500/20 text-rose-300 border-rose-500/30'
                      : l.status === 'Đang mượn'
                        ? 'bg-amber-500/20 text-amber-300 border-amber-500/30'
                        : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                    }`}>
                    {l.status}
                  </span>
                </td>
                <td className="px-4 py-3 text-right">
                  {(l.status === 'Đang mượn' || l.status === 'Quá hạn') ? (
                    <button
                      onClick={() => openReturnModal(l._id)}
                      className="px-3 py-1.5 rounded-lg bg-white/5 text-blue-400"
                    >
                      Trả sách
                    </button>
                  ) : (
                    <span className="text-slate-500">Hoàn tất</span>
                  )}
                </td>
              </tr>
            ))}
            {filteredLoans.length === 0 && (
              <tr>
                <td colSpan="6" className="text-center text-slate-500 py-6">
                  Không có dữ liệu
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* LOAN MODAL */}
      {loanModal && ReactDOM.createPortal(
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50">
          <div className="glass-panel p-6 w-[520px] rounded-2xl">
            <h3 className="font-bold text-white mb-4">Tạo phiếu mượn</h3>

            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-sm text-slate-300">Độc giả</label>
                  <select
                    value={selectedReaderId}
                    onChange={e => setSelectedReaderId(e.target.value)}
                    className="glass-input mt-2 w-full rounded-lg px-3 py-2"
                  >
                    <option value="">-- Chọn độc giả --</option>
                    {readers.map(r => (
                      <option key={r._id || r.id} value={r._id || r.id}>
                        {r.name}{r.phone ? ` • ${r.phone}` : ''}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-sm text-slate-300">Sách</label>
                  <select
                    value={selectedBookId}
                    onChange={e => setSelectedBookId(e.target.value)}
                    className="glass-input mt-2 w-full rounded-lg px-3 py-2"
                  >
                    <option value="">-- Chọn sách --</option>
                    {books.map(b => (
                      <option key={b._id || b.id} value={b._id || b.id}>
                        {b.title} — {Number(b.qty) || 0} có
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="text-sm text-slate-300">Hạn trả</label>
                <input
                  type="date"
                  value={loanDueDate}
                  onChange={e => setLoanDueDate(e.target.value)}
                  className="glass-input mt-2 w-full rounded-lg px-3 py-2"
                />
              </div>
              <div className="flex justify-end gap-3">
                <button onClick={() => setLoanModal(false)} className="px-4 py-2 rounded-lg bg-white/5 text-slate-300">Hủy</button>
                <button onClick={createLoan} className="px-4 py-2 rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 text-white">Tạo</button>
              </div>
            </div>
          </div>
        </div>,
        document.body
      )}

      {/* RETURN MODAL */}
      {returnModal && ReactDOM.createPortal(
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50">
          <div className="glass-panel p-6 w-[520px] rounded-2xl">
            <h3 className="font-bold text-white mb-4">Trả sách</h3>

            <div className="space-y-3">
              <div className="bg-white/5 p-3 rounded">
                <div className="text-sm text-slate-300">Phiếu: <span className="font-mono text-slate-400">{selectedLoanId}</span></div>
                {(() => {
                  const loan = loans.find(x => (x._id || x.id) === selectedLoanId)
                  if (!loan) return null
                  return (
                    <div className="mt-2 space-y-1">
                      <div className="text-sm text-slate-300">Độc giả: <span className="font-bold text-white">{loan.reader?.name || loan.member}</span></div>
                      <div className="text-sm text-slate-300">Sách: <span className="text-slate-200">{loan.book?.title || loan.book}{loan.fine?.amount ? ` (${Number(loan.fine.amount).toLocaleString('vi-VN')} vnđ)` : ''}</span></div>
                      <div className="text-sm text-slate-300">Hạn trả: <span className="text-slate-200">{formatDate(loan.dueDate || loan.return_date)}</span></div>
                      <div className="text-sm text-slate-300">Trạng thái: <span className="font-mono text-xs">{loan.status}</span></div>
                    </div>
                  )
                })()}
              </div>

              <div>
                <label className="text-sm text-slate-300">Phí phạt (VNĐ)</label>
                <div className="flex items-center gap-2 mt-2">
                  <input
                    type="number"
                    min="0"
                    value={returnFine}
                    onChange={e => setReturnFine(e.target.value)}
                    className="glass-input w-full rounded-lg px-3 py-2"
                  />
                </div>
              </div>

              <div>
                <label className="text-sm text-slate-300">Ghi chú</label>
                <input
                  value={returnNote}
                  onChange={e => setReturnNote(e.target.value)}
                  className="glass-input mt-2 w-full rounded-lg px-3 py-2"
                />
              </div>

              <div className="flex justify-end gap-3">
                <button onClick={() => setReturnModal(false)} className="px-4 py-2 rounded-lg bg-white/5 text-slate-300">Hủy</button>
                <button onClick={() => processReturn()} className="px-4 py-2 rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 text-white">Xác nhận</button>
              </div>
            </div>
          </div>
        </div>,
        document.body
      )}
    </div>
  )
}
