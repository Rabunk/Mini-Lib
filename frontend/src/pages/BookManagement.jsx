import React, { useState } from 'react'
import ReactDOM from 'react-dom'
import { library as initialLibrary } from '../data/library'

export default function BookManagement(){
  const [books, setBooks] = useState(() => {
    const s = localStorage.getItem('gl_lib_books')
    return s ? JSON.parse(s) : (initialLibrary || [])
  })
  const [query, setQuery] = useState('')
  const [modalOpen, setModalOpen] = useState(false)
  const [editIndex, setEditIndex] = useState(-1)
  const [form, setForm] = useState({ title:'', author:'', category:'', qty:0, status:'Sẵn có' })
  const [newRowId, setNewRowId] = useState(null)

  React.useEffect(() => {
    localStorage.setItem('gl_lib_books', JSON.stringify(books))
  }, [books])

  const handleSearch = (e) => setQuery(e.target.value || '')

  const filtered = books.filter(b =>
    b.title.toLowerCase().includes(query.toLowerCase()) ||
    b.author.toLowerCase().includes(query.toLowerCase())
  )

  const openAdd = () => {
    setEditIndex(-1)
    setForm({ title:'', author:'', category:'', qty:0, status:'Sẵn có' })
    setModalOpen(true)
  }

  const openEdit = (idx) => {
    setEditIndex(idx)
    const b = books[idx]
    setForm({ title: b.title, author: b.author, category: b.category, qty: b.qty, status: b.status })
    setModalOpen(true)
  }

  const save = () => {
    if (!form.title) return
    const copy = [...books]
    if (editIndex === -1) {
      const newItem = { id: `B${Date.now()}`, ...form }
      copy.unshift(newItem)
      setBooks(copy)
      setNewRowId(newItem.id)
      setTimeout(() => setNewRowId(null), 700)
    } else {
      copy[editIndex] = { ...copy[editIndex], ...form }
      setBooks(copy)
    }
    setModalOpen(false)
  }

  const remove = (idx) => {
    const copy = books.filter((_,i) => i !== idx)
    setBooks(copy)
  }

  return (
    <div className="space-y-6 h-full flex flex-col animate-fade-in" id="view-books">
      <div className="glass-panel rounded-2xl p-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Kho Sách</h1>
          <p className="text-sm text-slate-400">Quản lý danh mục và tồn kho</p>
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
          <input value={query} onChange={handleSearch} placeholder="Tìm tên sách, tác giả..." className="glass-input rounded-xl pl-10 pr-4 py-2 w-72 text-sm" />
          <i className="fa-solid fa-magnifying-glass absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-xs"></i>
        </div>
        <button onClick={openAdd} className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-2 rounded-xl text-sm font-medium shadow-lg shadow-purple-500/30 transition-all flex items-center gap-2">
          <i className="fa-solid fa-plus"></i> Thêm sách mới
        </button>
      </div>

      <div className="glass-panel rounded-2xl p-6 flex-1 overflow-auto">
        <table className="w-full text-left glass-table border-separate border-spacing-y-2">
          <thead>
            <tr className="text-slate-400 text-xs uppercase tracking-wider">
              <th className="px-4 py-2 font-medium">ID</th>
              <th className="px-4 py-2 font-medium">Tên Sách</th>
              <th className="px-4 py-2 font-medium">Tác Giả</th>
              <th className="px-4 py-2 font-medium">Danh Mục</th>
              <th className="px-4 py-2 font-medium text-center">Tồn Kho</th>
              <th className="px-4 py-2 font-medium">Trạng Thái</th>
              <th className="px-4 py-2 font-medium text-right">Thao Tác</th>
            </tr>
          </thead>
          <tbody className="text-sm text-slate-200">
            {filtered.map((book, i) => {
              const statusClass = book.status === 'Sẵn có' ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30' : 'bg-rose-500/20 text-rose-300 border-rose-500/30'
              const isNew = book.id === newRowId
              return (
                <tr key={book.id || i} className={`group ${isNew ? 'animate-add' : ''}`}>
                  <td className="px-4 py-3 font-mono text-slate-400">#{book.id}</td>
                  <td className="px-4 py-3 font-bold text-white">{book.title}</td>
                  <td className="px-4 py-3 text-slate-300">{book.author}</td>
                  <td className="px-4 py-3"><span className="bg-white/10 px-2 py-1 rounded text-xs border border-white/10">{book.category}</span></td>
                  <td className="px-4 py-3 text-center">{book.qty}</td>
                  <td className="px-4 py-3"><span className={`text-xs px-2 py-1 rounded-full border ${statusClass}`}>{book.status}</span></td>
                  <td className="px-4 py-3 text-right">
                    <button onClick={() => openEdit(books.indexOf(book))} className="text-slate-400 hover:text-blue-400 transition-colors mr-2"><i className="fa-solid fa-pen-to-square"></i></button>
                    <button onClick={() => remove(books.indexOf(book))} className="text-slate-400 hover:text-rose-400 transition-colors"><i className="fa-solid fa-trash"></i></button>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      {modalOpen && ReactDOM.createPortal(
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50">
          <div className="glass-panel p-6 rounded-2xl w-[520px]">
            <h3 className="font-bold text-white mb-4">{editIndex === -1 ? 'Thêm sách mới' : 'Chỉnh sửa sách'}</h3>
            <div className="space-y-3">
              <div>
                <label className="text-sm text-slate-300">Tên sách</label>
                <input className="glass-input mt-2 w-full rounded-lg px-3 py-2" value={form.title} onChange={e => setForm(f => ({...f, title: e.target.value}))} />
              </div>
              <div>
                <label className="text-sm text-slate-300">Tác giả</label>
                <input className="glass-input mt-2 w-full rounded-lg px-3 py-2" value={form.author} onChange={e => setForm(f => ({...f, author: e.target.value}))} />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-sm text-slate-300">Danh mục</label>
                  <input className="glass-input mt-2 w-full rounded-lg px-3 py-2" value={form.category} onChange={e => setForm(f => ({...f, category: e.target.value}))} />
                </div>
                <div>
                  <label className="text-sm text-slate-300">Số lượng</label>
                  <input type="number" className="glass-input mt-2 w-full rounded-lg px-3 py-2" value={form.qty} onChange={e => setForm(f => ({...f, qty: Number(e.target.value)}))} />
                </div>
              </div>

              <div className="flex justify-end gap-3">
                <button onClick={() => setModalOpen(false)} className="px-4 py-2 rounded-lg bg-white/5 text-slate-300">Hủy</button>
                <button onClick={save} className="px-4 py-2 rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 text-white">Lưu</button>
              </div>
            </div>
          </div>
        </div>,
        document.body
      )}
    </div>
  )
}
