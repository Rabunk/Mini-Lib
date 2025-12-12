import React, { useEffect, useState } from 'react'
import ReactDOM from 'react-dom'
import { users as initialUsers } from '../data/user'

export default function UserManagement() {
  const [query, setQuery] = useState('')
  const [data, setData] = useState(() => {
    const s = localStorage.getItem('gl_lib_users')
    return s ? JSON.parse(s) : (initialUsers || [])
  })
  const [modalOpen, setModalOpen] = useState(false)
  const [form, setForm] = useState({ id:'', name:'', phone:'', registered: '' })
  const [newRowId, setNewRowId] = useState(null)

  // sync
  useEffect(() => {
    localStorage.setItem('gl_lib_users', JSON.stringify(data))
  }, [data])

  const handleSearch = (e) => {
    const v = e.target.value.toLowerCase()
    setQuery(e.target.value)
  }

  const filtered = data.filter(
    u =>
      u.id.toLowerCase().includes(query.toLowerCase()) ||
      u.name.toLowerCase().includes(query.toLowerCase()) ||
      u.phone.toLowerCase().includes(query.toLowerCase())
  )

  const openAdd = () => {
    setForm({ id: `DG${String(data.length+1).padStart(3,'0')}`, name:'', phone:'', registered: new Date().toISOString().split('T')[0] })
    setModalOpen(true)
  }

  const save = () => {
    if (!form.id || !form.name) return
    setData(d => {
      const next = [form, ...d]
      return next
    })
    setNewRowId(form.id)
    setTimeout(() => setNewRowId(null), 700)
    setModalOpen(false)
  }

  const remove = (id) => {
    setData(d => d.filter(x => x.id !== id))
  }

  return (
    <div className="space-y-6 h-full flex flex-col animate-fade-in" id="view-users">
      <div className="glass-panel rounded-2xl p-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Quản lý độc giả</h1>
          <p className="text-sm text-slate-400">Danh sách độc giả và thông tin liên hệ</p>
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
            placeholder="Tìm mã, tên hoặc số điện thoại..."
            className="glass-input rounded-full pl-10 pr-4 py-2 w-72 text-sm"
          />
          <i className="fa-solid fa-magnifying-glass absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-xs"></i>
        </div>

        <button onClick={openAdd} className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-2 rounded-xl text-sm font-medium shadow-lg shadow-purple-500/30 transition-all flex items-center gap-2">
          <i className="fa-solid fa-user-plus"></i> Thêm độc giả
        </button>
      </div>

      <div className="glass-panel rounded-2xl p-6 flex-1 overflow-auto">
        <table className="w-full text-left glass-table border-separate border-spacing-y-2">
          <thead>
            <tr className="text-slate-400 text-xs uppercase tracking-wider">
              <th className="px-4 py-2 font-medium">Mã ĐG</th>
              <th className="px-4 py-2 font-medium">Họ và tên</th>
              <th className="px-4 py-2 font-medium">Số điện thoại</th>
              <th className="px-4 py-2 font-medium">Ngày đăng ký</th>
              <th className="px-4 py-2 font-medium text-right">Thao Tác</th>
            </tr>
          </thead>
          <tbody className="text-sm text-slate-200">
            {filtered.map(u => (
              <tr key={u.id} className={`group ${u.id === newRowId ? 'animate-add' : ''}`}>
                <td className="px-4 py-3 font-mono text-slate-400">{u.id}</td>
                <td className="px-4 py-3 font-bold text-white">{u.name}</td>
                <td className="px-4 py-3 text-slate-300">{u.phone}</td>
                <td className="px-4 py-3 text-slate-300">{u.registered}</td>
                <td className="px-4 py-3 text-right">
                  <button className="text-slate-400 hover:text-blue-400 transition-colors mr-2"><i className="fa-solid fa-pen-to-square"></i></button>
                  <button onClick={() => remove(u.id)} className="text-slate-400 hover:text-rose-400 transition-colors"><i className="fa-solid fa-trash"></i></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {modalOpen && ReactDOM.createPortal(
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50">
          <div className="glass-panel p-6 rounded-2xl w-[520px]">
            <h3 className="font-bold text-white mb-4">Thêm độc giả mới</h3>
            <div className="space-y-3">
              <div>
                <label className="text-sm text-slate-300">Mã độc giả</label>
                <input className="glass-input mt-2 w-full rounded-lg px-3 py-2" value={form.id} onChange={e => setForm(f => ({...f, id: e.target.value}))} />
              </div>
              <div>
                <label className="text-sm text-slate-300">Họ và tên</label>
                <input className="glass-input mt-2 w-full rounded-lg px-3 py-2" value={form.name} onChange={e => setForm(f => ({...f, name: e.target.value}))} />
              </div>
              <div>
                <label className="text-sm text-slate-300">Số điện thoại</label>
                <input className="glass-input mt-2 w-full rounded-lg px-3 py-2" value={form.phone} onChange={e => setForm(f => ({...f, phone: e.target.value}))} />
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