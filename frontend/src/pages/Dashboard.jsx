import React from 'react'
import { Line } from 'react-chartjs-2'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js'

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend)

function getLastNMonths(n = 6) {
  const labels = []
  const now = new Date()
  for (let i = n - 1; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1)
    labels.push(d.toLocaleString('default', { month: 'short', year: 'numeric' }))
  }
  return labels
}

function monthKeyFromDateString(s) {
  if (!s) return null
  const d = new Date(s)
  if (isNaN(d)) return null
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`
}

export default function Dashboard() {
  const books = React.useMemo(() => {
    const s = localStorage.getItem('gl_lib_books')
    return s ? JSON.parse(s) : []
  }, [])

  const users = React.useMemo(() => {
    const s = localStorage.getItem('gl_lib_users')
    return s ? JSON.parse(s) : []
  }, [])

  const loans = React.useMemo(() => {
    const s = localStorage.getItem('gl_lib_loans')
    return s ? JSON.parse(s) : []
  }, [])

  const totalTitles = books.length
  const totalCopies = books.reduce((acc, b) => acc + (Number(b.qty) || 0), 0)
  const totalMembers = users.length
  const activeLoans = loans.filter(l => l.status === 'Đang mượn').length
  const today = new Date()
  const overdue = loans.filter(l => {
    // count loans that are currently borrowed or marked overdue
    if (!(l.status === 'Đang mượn' || l.status === 'Quá hạn')) return false
    if (!l.dueDate) return false
    const dd = new Date(l.dueDate)
    return !isNaN(dd) && dd < today
  }).length

  // chart months
  const months = getLastNMonths(6)
  const monthKeys = months.map(lbl => {
    const parts = lbl.split(' ')
    const d = new Date(lbl)
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`
  })

  const borrowCounts = monthKeys.map(() => 0)
  const returnCounts = monthKeys.map(() => 0)

  loans.forEach(l => {
    const borrowKey = monthKeyFromDateString(l.date)
    const returnedKey = monthKeyFromDateString(l.returnedAt || l.returnDate || l.returnedDate)
    const bIndex = monthKeys.indexOf(borrowKey)
    if (bIndex >= 0) borrowCounts[bIndex]++
    const rIndex = monthKeys.indexOf(returnedKey)
    if (rIndex >= 0) returnCounts[rIndex]++
    // if loan.status === 'Đã trả' but no returnedAt, count returned in same month as date
    if (l.status === 'Đã trả' && !returnedKey && bIndex >= 0) returnCounts[bIndex]++
  })

  const chartData = {
    labels: months,
    datasets: [
      {
        label: 'Mượn',
        data: borrowCounts,
        borderColor: '#3b82f6',
        backgroundColor: 'rgba(59,130,246,0.12)',
        tension: 0.3,
        fill: true,
        pointRadius: 4
      },
      {
        label: 'Trả',
        data: returnCounts,
        borderColor: '#ef4444',
        backgroundColor: 'rgba(239,68,68,0.12)',
        tension: 0.3,
        fill: true,
        pointRadius: 4
      }
    ]
  }

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: { position: 'top', labels: { color: '#cbd5e1' } },
      title: { display: false }
    },
    scales: {
      x: { ticks: { color: '#94a3b8' }, grid: { display: false } },
      y: { ticks: { color: '#94a3b8' }, grid: { color: 'rgba(255,255,255,0.04)' }, beginAtZero: true }
    }
  }

  return (
    <>
      {/* Header / Tổng Quan Hệ Thống */}
      <div className="glass-panel mb-6 rounded-2xl p-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Tổng Quan Hệ Thống</h1>
          <p className="text-sm text-slate-400">Chào mừng trở lại, Administrator</p>
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

      {/* Existing dashboard content */}
      <div className="space-y-6 animate-fade-in">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="glass-panel p-6 rounded-2xl relative overflow-hidden group hover:scale-[1.02] transition-transform">
            <p className="text-slate-400 text-sm font-medium">Tổng đầu sách (bản)</p>
            <div className="flex items-end justify-between mt-2">
              <h3 className="text-3xl font-bold text-white">{totalCopies.toLocaleString()}</h3>
              <span className="text-xs font-bold px-2 py-1 rounded bg-emerald-500/20 text-emerald-300">{totalTitles} tựa</span>
            </div>
          </div>
          <div className="glass-panel p-6 rounded-2xl relative overflow-hidden group hover:scale-[1.02] transition-transform">
            <p className="text-slate-400 text-sm font-medium">Đang cho mượn</p>
            <div className="flex items-end justify-between mt-2">
              <h3 className="text-3xl font-bold text-white">{activeLoans}</h3>
              <span className="text-xs font-bold px-2 py-1 rounded bg-blue-500/20 text-blue-300">Hoạt động</span>
            </div>
          </div>
          <div className="glass-panel p-6 rounded-2xl relative overflow-hidden group hover:scale-[1.02] transition-transform">
            <p className="text-slate-400 text-sm font-medium">Độc giả</p>
            <div className="flex items-end justify-between mt-2">
              <h3 className="text-3xl font-bold text-white">{totalMembers}</h3>
              <span className="text-xs font-bold px-2 py-1 rounded bg-emerald-500/20 text-emerald-300">Đăng ký</span>
            </div>
          </div>
          <div className="glass-panel p-6 rounded-2xl relative overflow-hidden group hover:scale-[1.02] transition-transform">
            <p className="text-slate-400 text-sm font-medium">Quá hạn</p>
            <div className="flex items-end justify-between mt-2">
              <h3 className="text-3xl font-bold text-white">{overdue}</h3>
              <span className="text-xs font-bold px-2 py-1 rounded bg-rose-500/20 text-rose-300">Cần xử lý</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="glass-panel lg:col-span-2 rounded-2xl p-6">
            <h3 className="font-bold text-white mb-4">Biểu đồ mượn / trả (6 tháng)</h3>
            <Line data={chartData} options={chartOptions} />
          </div>

          <div className="glass-panel rounded-2xl p-6">
            <h3 className="font-bold text-white mb-4">Hoạt động gần đây</h3>
            <div className="space-y-4">
              {loans.slice(0, 6).map((l, i) => (
                <div key={l.id + i} className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-300 text-xs font-bold">{(l.member || 'U').slice(0,1)}</div>
                  <div>
                    <p className="text-sm text-slate-200">{l.member} <span className="text-slate-500">{l.status === 'Đang mượn' ? 'mượn' : 'trả'}</span> <b className="text-slate-200">{l.book}</b></p>
                    <p className="text-xs text-slate-500">{l.date}{l.returnedAt ? ` • trả ${l.returnedAt}` : ''}</p>
                  </div>
                </div>
              ))}
              {loans.length === 0 && <p className="text-sm text-slate-500">Không có giao dịch</p>}
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
