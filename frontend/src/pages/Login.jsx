import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import ReactDOM from 'react-dom'
import successImg from '../assets/success.png'

export default function Login() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [successModal, setSuccessModal] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    const aside = document.querySelector('aside')
    const prevDisplay = aside ? aside.style.display : null
    if (aside) aside.style.display = 'none'
    document.body.classList.add('login-page-center')

    return () => {
      if (aside) aside.style.display = prevDisplay || ''
      document.body.classList.remove('login-page-center')
    }
  }, [])

  const handleSubmit = (e) => {
    e.preventDefault()
    const correctUser = 'admin'
    const correctPass = 'admin'
    if (username === correctUser && password === correctPass) {
      setError('')
      setSuccessModal(true)
      return
    }
    setError('Tên đăng nhập hoặc mật khẩu không đúng')
  }

  const confirmSuccess = () => {
    setSuccessModal(false)
    navigate('/dashboard')
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <form onSubmit={handleSubmit} className="glass-panel p-8 rounded-2xl space-y-4">
          <h2 className="text-2xl font-bold text-white text-center">Đăng nhập hệ thống</h2>
          <p className="text-sm text-slate-400 text-center">Nhập thông tin để truy cập Dashboard</p>

          <div>
            <label className="text-sm text-slate-300">Tên đăng nhập</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="glass-input mt-2 w-full rounded-lg px-3 py-2"
              placeholder="admin"
              autoComplete="username"
              required
            />
          </div>

          <div>
            <label className="text-sm text-slate-300">Mật khẩu</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="glass-input mt-2 w-full rounded-lg px-3 py-2"
              placeholder="••••••••"
              autoComplete="current-password"
              required
            />
          </div>

          {error && <div className="text-rose-400 text-sm">{error}</div>}

          <button type="submit" className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-2 rounded-lg font-medium">
            Đăng nhập
          </button>

          <div className="text-xs text-slate-500 text-center">
            Mặc định: user <b>admin</b> / pass <b>admin</b>
          </div>
        </form>
      </div>

      {successModal &&
        ReactDOM.createPortal(
          <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50">
            <div className="glass-panel h-[400px] p-6 rounded-2xl w-[420px] text-center">
              <h3 className="font-bold text-white text-lg mb-2">Đăng nhập thành công</h3>
              <img src={successImg} alt="Success" className="mx-auto mb-4 w-56 h-56 rounded-full object-cover mt-4" />
              <div className="flex justify-center gap-3">
                <button onClick={() => setSuccessModal(false)} className="px-4 py-2 rounded-lg bg-white/5 text-slate-300">Huỷ</button>
                <button onClick={confirmSuccess} className="px-4 py-2 rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 text-white">Xác nhận</button>
              </div>
            </div>
          </div>,
          document.body
        )}
    </div>
  )
}