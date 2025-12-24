import React, { useEffect, useState } from 'react'
import ReactDOM from 'react-dom'
import { library as initialBooks } from '../data/library'
import { users as initialUsers } from '../data/user'
import { loanService } from '../config/loan.service.js'
import { bookService } from '../config/book.service.js'
import { readerService } from '../config/reader.service.js'

export default function BorrowAndReturn() {
  // ===== Loan modal state =====
  const [loanModal, setLoanModal] = useState(false)
  const [selectedReaderId, setSelectedReaderId] = useState('')
  const [selectedBookId, setSelectedBookId] = useState('')
  const [loanDueDate, setLoanDueDate] = useState('')

  // ===== Return modal state =====
  const [returnModal, setReturnModal] = useState(false)
  const [selectedLoanId, setSelectedLoanId] = useState(null)
  const [returnFine, setReturnFine] = useState(0)
  const [returnNote, setReturnNote] = useState('')

  const [query, setQuery] = useState('')

  const [books, setBooks] = useState(() => {
    const s = localStorage.getItem('gl_lib_books')
    return s ? JSON.parse(s) : (initialBooks || [])
  })

  const [users, setUsers] = useState(() => {
    const s = localStorage.getItem('gl_lib_users')
    return s ? JSON.parse(s) : (initialUsers || [])
  })

  const [loans, setLoans] = useState(() => {
    const s = localStorage.getItem('gl_lib_loans')
    return s ? JSON.parse(s) : []
  })

  /* ========== Load remote data ========== */
  useEffect(() => {
    const load = async () => {
      try {
        const [bkRes, rdRes, lnRes] = await Promise.allSettled([
          bookService.getAll(),
          readerService.getAll(),
          loanService.getAll()
        ])

        if (bkRes.status === 'fulfilled' && bkRes.value?.data) {
          setBooks(Array.isArray(bkRes.value.data) ? bkRes.value.data : (bkRes.value.data?.data || []))
        }

        if (rdRes.status === 'fulfilled' && rdRes.value?.data) {
          setUsers(Array.isArray(rdRes.value.data) ? rdRes.value.data : (rdRes.value.data?.data || []))
        }

        if (lnRes.status === 'fulfilled' && lnRes.value?.data) {
          setLoans(Array.isArray(lnRes.value.data) ? lnRes.value.data : (lnRes.value.data?.data || []))
        }
      } catch (err) {
        console.error('Load error', err)
      }
    }
    load()
  }, [])

  // persist local cache
  useEffect(() => {
    localStorage.setItem('gl_lib_loans', JSON.stringify(loans))
  }, [loans])

  useEffect(() => {
    localStorage.setItem('gl_lib_books', JSON.stringify(books))
  }, [books])

  const handleSearch = (e) => setQuery(e.target.value || '')

  const q = query.toLowerCase()
  const filtered = loans.filter(t => {
    const code = (t.loan_code || t.id || '').toString().toLowerCase()
    const readerName = (t.reader?.name || t.member || '').toString().toLowerCase()
    const bookTitle = (t.book?.title || t.book || '').toString().toLowerCase()
    return code.includes(q) || readerName.includes(q) || bookTitle.includes(q)
  })

  const openLoanModal = () => {
    setSelectedReaderId(users[0]?._id || users[0]?.id || '')
    setSelectedBookId(books[0]?._id || books[0]?.id || '')
    const due = new Date()
    due.setDate(due.getDate() + 14)
    setLoanDueDate(due.toISOString().split('T')[0])
    setLoanModal(true)
  }

  const createLoan = async () => {
    if (!selectedReaderId || !selectedBookId || !loanDueDate) return

    const chosenBook = books.find(b => b._id === selectedBookId || b.id === selectedBookId)
    if (!chosenBook || (Number(chosenBook.qty) || 0) <= 0) {
      alert('Sách không có sẵn để mượn')
      return
    }

    try {
      const payload = {
        readerId: selectedReaderId,
        bookId: selectedBookId,
        dueDate: loanDueDate
      }

      const res = await loanService.borrow(payload)

      // decrement local book qty (optimistic)
      setBooks(prev => prev.map(b => ((b._id === selectedBookId || b.id === selectedBookId) ? { ...b, qty: (Number(b.qty) || 0) - 1 } : b)))

      // API returns created loan (populated). Use it; otherwise reload loans.
      if (res?.data) {
        setLoans(l => [res.data, ...l])
      } else {
        const all = await loanService.getAll()
        setLoans(Array.isArray(all.data) ? all.data : (all.data?.data || loans))
      }

      setLoanModal(false)
    } catch (err) {
      console.error('Borrow failed:', err)
      alert('Tạo phiếu mượn thất bại')
    }
  }

  const openReturnModal = (loanId) => {
    setSelectedLoanId(loanId)
    setReturnFine(0)
    setReturnNote('')
    setReturnModal(true)
  }

  const processReturn = async (loanId) => {
    try {
      const payload = { fineAmount: Number(returnFine) || 0, fineNote: returnNote || '' }
      const res = await loanService.returnBook(loanId, payload)

      if (res?.data) {
        // replace updated loan
        setLoans(prev => prev.map(l => ((l._id === res.data._id || l.id === res.data.id) ? res.data : l)))
        // increment returned book qty in local books if present
        const returnedLoan = res.data
        const bookId = returnedLoan.book?._id || returnedLoan.book
        if (bookId) {
          setBooks(prev => prev.map(b => ((b._id === bookId || b.id === bookId) ? { ...b, qty: (Number(b.qty) || 0) + 1 } : b)))
        }
      } else {
        const all = await loanService.getAll()
        setLoans(Array.isArray(all.data) ? all.data : (all.data?.data || loans))
      }

      setReturnModal(false)
    } catch (err) {
      console.error('Return failed:', err)
      alert('Xử lý trả sách thất bại')
    }
  }

  const formatDate = (d) => {
    if (!d) return '-'
    try {
      const dt = new Date(d)
      return isNaN(dt) ? d.toString().split('T')[0] : dt.toISOString().split('T')[0]
    } catch { return '-' }
  }

  return (
    <div className="space-y-6 h-full flex flex-col animate-fade-in" id="view-borrow">
      <div className="glass-panel rounded-2xl p-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Quản lý Mượn / Trả</h1>
          <p className="text-sm text-slate-400">Theo dõi phiếu mượn và trả sách</p>
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

      <div className="glass-panel p-4 rounded-2xl flex justify-between items-center">
        <div className="relative">
          <input
            type="text"
            value={query}
            onChange={handleSearch}
            placeholder="Tìm mã, độc giả hoặc sách..."
            className="glass-input rounded-full pl-10 pr-4 py-2 w-72 text-sm"
          />
          <i className="fa-solid fa-magnifying-glass absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-xs"></i>
        </div>

        <button onClick={openLoanModal} className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-2 rounded-xl text-sm font-medium shadow-lg shadow-purple-500/30 transition-all">
          + Tạo phiếu mượn
        </button>
      </div>

      <div className="glass-panel rounded-2xl p-6 flex-1 overflow-auto">
        <table className="w-full text-left glass-table border-separate border-spacing-y-2">
          <thead>
            <tr className="text-slate-400 text-xs uppercase tracking-wider">
              <th className="px-4 py-2 font-medium">Mã phiếu</th>
              <th className="px-4 py-2 font-medium">Độc giả</th>
              <th className="px-4 py-2 font-medium">Sách</th>
              <th className="px-4 py-2 font-medium">Hạn trả</th>
              <th className="px-4 py-2 font-medium">Trạng thái</th>
              <th className="px-4 py-2 font-medium text-right">Hành động</th>
            </tr>
          </thead>
          <tbody className="text-sm text-slate-200">
            {filtered.map(t => (
              <tr key={t._id || t.loan_code || t.id} className="group">
                <td className="px-4 py-3 font-mono text-slate-400">{t.loan_code || t.id}</td>
                <td className="px-4 py-3 font-bold text-white">{t.reader?.name || t.member}</td>
                <td className="px-4 py-3 text-slate-300">{t.book?.title || t.book}{t.fine?.amount ? ` (${Number(t.fine.amount).toLocaleString('vi-VN')} vnđ)` : ''}</td>
                <td className="px-4 py-3 text-slate-300">{formatDate(t.return_date || t.returnedAt || t.dueDate)}</td>
                <td className="px-4 py-3">
                  <span className={`text-xs px-2 py-1 rounded-full border ${
                    t.status === 'Quá hạn' ? 'bg-rose-500/20 text-rose-300 border-rose-500/30' :
                    t.status === 'Đang mượn' ? 'bg-amber-500/20 text-amber-300 border-amber-500/30' :
                    'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                  }`}>{t.status}</span>
                </td>
                <td className="px-4 py-3 text-right">
                  {(t.status === 'Đang mượn' || t.status === 'Quá hạn') ? (
                    <button onClick={() => openReturnModal(t._id || t.id)} className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm bg-white/5 text-blue-400 hover:bg-white/8">
                      <i className="fa-solid fa-rotate-left"></i> Trả sách
                    </button>
                  ) : (
                    <span className="text-slate-500 text-sm">Hoàn tất</span>
                  )}
                </td>
              </tr>
            ))}
            {filtered.length === 0 && <tr><td colSpan="6" className="text-center text-slate-500 py-6">Không có giao dịch</td></tr>}
          </tbody>
        </table>
      </div>

      {/* LOAN MODAL */}
      {loanModal && ReactDOM.createPortal(
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50">
          <div className="glass-panel p-6 w-[520px] rounded-2xl">
            <h3 className="font-bold text-white mb-4">Tạo phiếu mượn</h3>

            <div className="space-y-3">
              <div>
                <label className="text-sm text-slate-300">Chọn độc giả</label>
                <select value={selectedReaderId} onChange={e => setSelectedReaderId(e.target.value)} className="glass-input mt-2 w-full rounded-lg px-3 py-2">
                  {users.map(u => <option key={u._id || u.id} value={u._id || u.id}>{u.name}</option>)}
                </select>
              </div>

              <div>
                <label className="text-sm text-slate-300">Chọn sách</label>
                <select value={selectedBookId} onChange={e => setSelectedBookId(e.target.value)} className="glass-input mt-2 w-full rounded-lg px-3 py-2">
                  {books.map(b => <option key={b._id || b.id} value={b._id || b.id}>{b.title} ({b.qty})</option>)}
                </select>
              </div>

              <div>
                <label className="text-sm text-slate-300">Hạn trả</label>
                <input type="date" value={loanDueDate} onChange={e => setLoanDueDate(e.target.value)} className="glass-input mt-2 w-full rounded-lg px-3 py-2" />
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
              <div>
                <label className="text-sm text-slate-300">Phí phạt (VNĐ)</label>
                <input type="number" min="0" value={returnFine} onChange={e => setReturnFine(e.target.value)} className="glass-input mt-2 w-full rounded-lg px-3 py-2" />
              </div>

              <div>
                <label className="text-sm text-slate-300">Ghi chú</label>
                <input value={returnNote} onChange={e => setReturnNote(e.target.value)} className="glass-input mt-2 w-full rounded-lg px-3 py-2" />
              </div>

              <div className="flex justify-end gap-3">
                <button onClick={() => setReturnModal(false)} className="px-4 py-2 rounded-lg bg-white/5 text-slate-300">Hủy</button>
                <button onClick={() => processReturn(selectedLoanId)} className="px-4 py-2 rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 text-white">Xác nhận</button>
              </div>
            </div>
          </div>
        </div>,
        document.body
      )}
    </div>
  )
}
