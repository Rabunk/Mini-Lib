import React from 'react'
import { NavLink, useNavigate } from 'react-router-dom'

export default function Sidebar() {
  const navigate = useNavigate()
  const navClass = ({ isActive }) =>
    `nav-item group w-full flex items-center px-4 py-3 rounded-xl text-slate-400 hover:bg-white/5 transition-all ${isActive ? 'active' : ''}`

  const handleLogout = () => {
    navigate('/')
  }

  return (
    <aside className="w-72 p-4 flex flex-col z-10">
      <div className="glass-panel h-full rounded-2xl flex flex-col p-6">
        <div className="flex items-center gap-3 mb-10 px-2">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-lg">
            <i className="fa-solid fa-book-open text-white"></i>
          </div>
          <div>
            <h1 className="font-bold text-lg tracking-wide text-white">GlassLib</h1>
            <p className="text-xs text-slate-400">Admin Panel</p>
          </div>
        </div>

        <nav className="flex-1 space-y-2">
          <NavLink to="/dashboard" className={navClass}>
            <i className="fa-solid fa-chart-pie w-6 transition-colors"></i>
            <span className="font-medium ml-3">Tổng Quan</span>
          </NavLink>

          <NavLink to="/books" className={navClass}>
            <i className="fa-solid fa-book w-6 transition-colors"></i>
            <span className="font-medium ml-3">Kho Sách</span>
          </NavLink>

          <NavLink to="/members" className={navClass}>
            <i className="fa-solid fa-users w-6 transition-colors"></i>
            <span className="font-medium ml-3">Độc Giả</span>
          </NavLink>

          <NavLink to="/borrownreturn" className={navClass}>
            <i className="fa-solid fa-right-left w-6 transition-colors"></i>
            <span className="font-medium ml-3">Mượn / Trả</span>
          </NavLink>
        </nav>

        <div className="pt-6 border-t border-white/10 mt-auto">
          <button type="button" onClick={handleLogout} className="flex items-center gap-3 text-slate-400 hover:text-rose-400 transition-colors w-full px-2">
            <i className="fa-solid fa-arrow-right-from-bracket"></i>
            <span>Đăng xuất</span>
          </button>
        </div>
      </div>
    </aside>
  )
}