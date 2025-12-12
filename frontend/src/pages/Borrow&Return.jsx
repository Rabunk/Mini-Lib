import React, { useEffect, useState } from 'react'
import ReactDOM from 'react-dom'
import { library as initialBooks } from '../data/library'
import { users as initialUsers } from '../data/user'

export default function BorrowAndReturn() {
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
    return s ? JSON.parse(s) : [
      { id: 'PM001', member: 'Nguyễn Văn A', book: 'Nhà Giả Kim', date: '2023-10-25', status: 'Đang mượn' },
      { id: 'PM002', member: 'Trần Thị B', book: 'Tuổi Trẻ Đáng Giá Bao Nhiêu', date: '2023-10-20', status: 'Đã trả' }
    ]
  })

  const [loanModal, setLoanModal] = useState(false)
  const [returnModal, setReturnModal] = useState(false)
  const [selectedLoanId, setSelectedLoanId] = useState(null)
  const [selectedReaderId, setSelectedReaderId] = useState('')
  const [selectedBookId, setSelectedBookId] = useState('')

  useEffect(() => {
    localStorage.setItem('gl_lib_loans', JSON.stringify(loans))
  }, [loans])

  const handleSearch = (e) => setQuery(e.target.value || '')

  const filtered = loans.filter(t =>
    t.id.toLowerCase().includes(query.toLowerCase()) ||
    t.member.toLowerCase().includes(query.toLowerCase()) ||
    t.book.toLowerCase().includes(query.toLowerCase())
  )

  const openLoanModal = () => {
    setSelectedReaderId(users[0]?.id || '')
    setSelectedBookId(books[0]?.id || '')
    setLoanModal(true)
  }

  const createLoan = () => {
    if (!selectedReaderId || !selectedBookId) return
    const newLoan = {
      id: `PM${String(loans.length + 1).padStart(3,'0')}`,
      member: users.find(u => u.id === selectedReaderId)?.name || selectedReaderId,
      book: books.find(b => b.id === selectedBookId)?.title || selectedBookId,
      date: new Date().toISOString().split('T')[0],
      status: 'Đang mượn'
    }
    setLoans(l => [newLoan, ...l])
    setLoanModal(false)
  }

  const openReturnModal = (loanId) => {
    setSelectedLoanId(loanId)
    setReturnModal(true)
  }

  const processReturn = (loanId) => {
    setLoans(l => l.map(x => x.id === loanId ? { ...x, status: 'Đã trả' } : x))
    setReturnModal(false)
  }

  return (
    <div className="space-y-6 h-full flex flex-col animate-fade-in" id="view-borrow">
      <div className="glass-panel rounded-2xl p-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Quản lý Mượn / Trả</h1>
          <p className="text-sm text-slate-400">Theo dõi phiếu mượn và trạng thái trả sách</p>
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
            placeholder="Tìm mã phiếu, độc giả hoặc sách..."
            className="glass-input rounded-xl pl-10 pr-4 py-2 w-72 text-sm"
          />
          <i className="fa-solid fa-magnifying-glass absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-xs"></i>
        </div>

        <button onClick={openLoanModal} className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-2 rounded-xl text-sm font-medium shadow-lg shadow-purple-500/30 transition-all flex items-center gap-2">
          <i className="fa-solid fa-plus"></i> Tạo phiếu mượn
        </button>
      </div>

      <div className="glass-panel rounded-2xl p-6 flex-1 overflow-auto">
        <table className="w-full text-left glass-table border-separate border-spacing-y-2">
          <thead>
            <tr className="text-slate-400 text-xs uppercase tracking-wider">
              <th className="px-4 py-2 font-medium">Mã phiếu</th>
              <th className="px-4 py-2 font-medium">Độc giả</th>
              <th className="px-4 py-2 font-medium">Sách</th>
              <th className="px-4 py-2 font-medium">Ngày mượn</th>
              <th className="px-4 py-2 font-medium">Trạng thái</th>
              <th className="px-4 py-2 font-medium text-right">Hành động</th>
            </tr>
          </thead>
          <tbody className="text-sm text-slate-200">
            {filtered.map(t => (
              <tr key={t.id} className="group">
                <td className="px-4 py-3 font-mono text-slate-400 align-middle">{t.id}</td>
                <td className="px-4 py-3 font-bold text-white align-middle">{t.member}</td>
                <td className="px-4 py-3 text-slate-300 align-middle">{t.book}</td>
                <td className="px-4 py-3 text-slate-300 align-middle">{t.date}</td>
                <td className="px-4 py-3 align-middle">
                  {t.status === 'Đang mượn' ? (
                    <span className="text-xs px-2 py-1 rounded-full border bg-amber-500/20 text-amber-300 border-amber-500/30">{t.status}</span>
                  ) : (
                    <span className="text-xs px-2 py-1 rounded-full border bg-emerald-500/20 text-emerald-300 border-emerald-500/30">{t.status}</span>
                  )}
                </td>
                <td className="px-4 py-3 align-middle text-right">
                  {t.status === 'Đang mượn' ? (
                    <button onClick={() => openReturnModal(t.id)} className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm bg-white/5 text-blue-400 hover:bg-white/8">
                      <i className="fa-solid fa-rotate-left"></i> Trả sách
                    </button>
                  ) : (
                    <span className="text-slate-500 text-sm">Hoàn tất</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Loan modal (portal so overlay covers entire viewport & sidebar) */}
      {loanModal && ReactDOM.createPortal(
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50">
          <div className="glass-panel p-6 rounded-2xl w-[520px]">
            <h3 className="font-bold text-white mb-4">Tạo phiếu mượn</h3>
            <div className="space-y-3">
              <div>
                <label className="text-sm text-slate-300">Chọn độc giả</label>
                <select value={selectedReaderId} onChange={e => setSelectedReaderId(e.target.value)} className="glass-input mt-2 w-full rounded-lg px-3 py-2">
                  {users.map(u => <option key={u.id} value={u.id}>{u.name} ({u.id})</option>)}
                </select>
              </div>
              <div>
                <label className="text-sm text-slate-300">Chọn sách</label>
                <select value={selectedBookId} onChange={e => setSelectedBookId(e.target.value)} className="glass-input mt-2 w-full rounded-lg px-3 py-2">
                  {books.map(b => <option key={b.id} value={b.id}>{b.title}</option>)}
                </select>
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

      {/* Return modal (portal) */}
      {returnModal && ReactDOM.createPortal(
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50">
          <div className="glass-panel p-6 rounded-2xl w-[520px]">
            <h3 className="font-bold text-white mb-4">Xác nhận trả sách</h3>
            <p className="text-slate-300 mb-4">Bạn có chắc muốn đánh dấu phiếu <b>{selectedLoanId}</b> là đã trả?</p>
            <div className="flex justify-end gap-3">
              <button onClick={() => setReturnModal(false)} className="px-4 py-2 rounded-lg bg-white/5 text-slate-300">Hủy</button>
              <button onClick={() => processReturn(selectedLoanId)} className="px-4 py-2 rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 text-white">Xác nhận</button>
            </div>
          </div>
        </div>,
        document.body
      )}
    </div>
  )
}