import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

export default function Login() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
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
      navigate('/dashboard')
      return
    }
    setError('Tên đăng nhập hoặc mật khẩu không đúng')
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
    </div>
  )
}