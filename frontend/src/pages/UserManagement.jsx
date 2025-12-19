import React, { useEffect, useState } from 'react'
import ReactDOM from 'react-dom'
import axiosClient from '../config/axiosClient'
import { users as initialUsers } from '../data/user'

export default function UserManagement() {
  const [query, setQuery] = useState('')
  const [data, setData] = useState([])
  const [modalOpen, setModalOpen] = useState(false)
  const [form, setForm] = useState({ id:'', name:'', phone:'', registered: '' })
  const [newRowId, setNewRowId] = useState(null)
  const [editIndex, setEditIndex] = useState(-1)

  const [nameError, setNameError] = useState('')
  const [phoneError, setPhoneError] = useState('')

  /* ================= FETCH ================= */
  const fetchReaders = async () => {
    try {
      const res = await axiosClient.get('/readers')
      // expect res.data to be an array
      if (Array.isArray(res.data)) setData(res.data)
      else setData(res.data || [])
    } catch (err) {
      console.error(err)
      setData((prev) => prev.length ? prev : (initialUsers || []))
    }
  }

  useEffect(() => {
    fetchReaders()
  }, [])

  /* ================= SEARCH ================= */
  const handleSearch = (e) => setQuery(e.target.value)

  const filtered = data.filter(
    u => {
      const code = (u.reader_code || u.id || '').toString().toLowerCase()
      const name = (u.name || '').toString().toLowerCase()
      const phone = (u.phone || '').toString().toLowerCase()
      const q = query.toLowerCase()
      return code.includes(q) || name.includes(q) || phone.includes(q)
    }
  )

  /* ================= MODAL ================= */
  const openAdd = () => {
    setEditIndex(-1)
    setForm({
      id: `DG${String((data && data.length) ? data.length + 1 : 1).padStart(3, '0')}`,
      name: '',
      phone: '',
      registered: new Date().toISOString().split('T')[0]
    })
    setNameError('')
    setPhoneError('')
    setModalOpen(true)
  }

  const openEdit = (idx) => {
    const u = data[idx]
    setEditIndex(idx)
    setForm({
      id: u.reader_code || u.id || '',
      name: u.name || '',
      phone: u.phone || '',
      registered: u.createdAt?.split('T')[0] || u.registered || ''
    })
    setNameError('')
    setPhoneError('')
    setModalOpen(true)
  }

  /* ================= VALIDATE ================= */
  const validate = () => {
    let ok = true
    if (!form.name || form.name.trim().length < 8) {
      setNameError('Họ và tên phải ít nhất 8 ký tự')
      ok = false
    } else setNameError('')

    const digits = (form.phone || '').replace(/\D/g,'')
    if (!digits || digits.length < 10) {
      setPhoneError('Số điện thoại phải ít nhất 10 chữ số')
      ok = false
    } else setPhoneError('')
    return ok
  }

  /* ================= SAVE ================= */
  const save = async () => {
    if (!validate()) return

    try {
      if (editIndex === -1) {
        await axiosClient.post('/readers', {
          reader_code: form.id,
          name: form.name,
          phone: form.phone
        })
        setNewRowId(form.id)
        setTimeout(() => setNewRowId(null), 700)
      } else {
        const readerId = data[editIndex]._id || data[editIndex].id
        if (!readerId) throw new Error('Không tìm thấy id độc giả để cập nhật')
        await axiosClient.put(`/readers/${readerId}`, {
          name: form.name,
          phone: form.phone
        })
      }

      setModalOpen(false)
      fetchReaders()
    } catch (err) {
      console.error(err)
    }
  }

  /* ================= DELETE ================= */
  const remove = async (id) => {
    try {
      await axiosClient.delete(`/readers/${id}`)
      fetchReaders()
    } catch (err) {
      console.error(err)
    }
  }

  /* ================= UI  ================= */
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
            {filtered.map((u, idx) => (
              <tr key={u._id || u.reader_code || u.id || idx} className={`group ${u.reader_code === newRowId ? 'animate-add' : ''}`}>
                <td className="px-4 py-3 font-mono text-slate-400">{u.reader_code || u.id || '-'}</td>
                <td className="px-4 py-3 font-bold text-white">{u.name}</td>
                <td className="px-4 py-3 text-slate-300">{u.phone}</td>
                <td className="px-4 py-3 text-slate-300">{(u.createdAt || u.registered || '').split('T')[0]}</td>
                <td className="px-4 py-3 text-right">
                  <button onClick={() => openEdit(idx)} className="text-slate-400 hover:text-blue-400 transition-colors mr-2"><i className="fa-solid fa-pen-to-square"></i></button>
                  <button onClick={() => remove(u._id || u.id)} className="text-slate-400 hover:text-rose-400 transition-colors"><i className="fa-solid fa-trash"></i></button>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr><td colSpan="5" className="text-center text-slate-500 py-4">Không có độc giả</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {modalOpen && ReactDOM.createPortal(
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50">
          <div className="glass-panel p-6 rounded-2xl w-[520px]">
            <h3 className="font-bold text-white mb-4">{editIndex === -1 ? 'Thêm độc giả mới' : 'Chỉnh sửa độc giả'}</h3>
            <div className="space-y-3">
              <div>
                <label className="text-sm text-slate-300">Mã độc giả</label>
                <input className="glass-input mt-2 w-full rounded-lg px-3 py-2" value={form.id} disabled />
              </div>
              <div>
                <label className="text-sm text-slate-300">Họ và tên</label>
                <input className="glass-input mt-2 w-full rounded-lg px-3 py-2" value={form.name} onChange={e => setForm(f => ({...f, name: e.target.value}))} />
                {nameError && <div className="text-rose-400 text-sm mt-1">{nameError}</div>}
              </div>
              <div>
                <label className="text-sm text-slate-300">Số điện thoại</label>
                <input className="glass-input mt-2 w-full rounded-lg px-3 py-2" value={form.phone} onChange={e => setForm(f => ({...f, phone: e.target.value.replace(/\D/g,'')}))} />
                {phoneError && <div className="text-rose-400 text-sm mt-1">{phoneError}</div>}
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