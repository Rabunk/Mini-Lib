import React, { useEffect, useMemo, useState } from 'react'
import { Line } from 'react-chartjs-2'
import axiosClient from '../config/axiosClient'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend
} from 'chart.js'

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend
)

function getLastNMonths(n = 6) {
  const labels = []
  const now = new Date()
  for (let i = n - 1; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1)
    labels.push({
      label: d.toLocaleString('default', { month: 'short', year: 'numeric' }),
      key: `${d.getFullYear()}-${d.getMonth() + 1}`
    })
  }
  return labels
}

export default function Dashboard() {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    axiosClient
      .get('/dashboard/summary')
      .then(res => {
        setData(res?.data ? res.data : {})
      })
      .catch(err => {
        console.error(err)
        setData({})
      })
      .finally(() => setLoading(false))
  }, [])

  const months = useMemo(() => getLastNMonths(6), [])

  const chartData = useMemo(() => {
    if (!data) return null

    const borrowStats = Array.isArray(data?.monthly?.borrow) ? data.monthly.borrow : []
    const returnStats = Array.isArray(data?.monthly?.return) ? data.monthly.return : []

    const borrowCounts = months.map(() => 0)
    const returnCounts = months.map(() => 0)

    borrowStats.forEach(b => {
      const key = `${b._id?.year}-${b._id?.month}`
      const idx = months.findIndex(m => m.key === key)
      if (idx >= 0) borrowCounts[idx] = b.count
    })

    returnStats.forEach(r => {
      const key = `${r._id?.year}-${r._id?.month}`
      const idx = months.findIndex(m => m.key === key)
      if (idx >= 0) returnCounts[idx] = r.count
    })

    return {
      labels: months.map(m => m.label),
      datasets: [
        {
          label: 'Mượn',
          data: borrowCounts,
          borderColor: '#3b82f6',
          backgroundColor: 'rgba(59,130,246,0.15)',
          tension: 0.3,
          fill: true,
          pointRadius: 4
        },
        {
          label: 'Trả',
          data: returnCounts,
          borderColor: '#ef4444',
          backgroundColor: 'rgba(239,68,68,0.15)',
          tension: 0.3,
          fill: true,
          pointRadius: 4
        }
      ]
    }
  }, [data, months])

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: { labels: { color: '#cbd5e1' } }
    },
    scales: {
      x: { ticks: { color: '#94a3b8' }, grid: { display: false } },
      y: {
        ticks: { color: '#94a3b8' },
        grid: { color: 'rgba(255,255,255,0.04)' },
        beginAtZero: true
      }
    }
  }

  if (loading) return <p className="text-slate-400">Đang tải dashboard...</p>
  if (!data) return <p className="text-red-400">Không thể tải dữ liệu</p>

  const totalCopies = data.totalCopies ?? (Array.isArray(data.totalCopiesAgg) ? data.totalCopiesAgg[0]?.total : undefined)
  const totalTitles = data.totalTitles ?? data.totalTitles
  const activeLoans = data.activeLoans ?? 0
  const totalMembers = data.totalMembers ?? 0
  const overdue = data.overdue ?? 0
  const recentLoans = Array.isArray(data.recentLoans) ? data.recentLoans : (data.recent || [])

  return (
    <>
      <div className="glass-panel mb-6 rounded-2xl p-6 flex justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Tổng Quan Hệ Thống</h1>
          <p className="text-sm text-slate-400">Dashboard thư viện</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <Card title="Tổng đầu sách (bản)" value={totalCopies} note={`${totalTitles} tựa`} />
        <Card title="Đang cho mượn" value={activeLoans} />
        <Card title="Độc giả" value={totalMembers} />
        <Card title="Quá hạn" value={overdue} danger />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="glass-panel lg:col-span-2 p-6 rounded-2xl">
          <h3 className="font-bold text-white mb-4">Biểu đồ mượn / trả (6 tháng)</h3>
          {chartData ? <Line data={chartData} options={chartOptions} /> : <p className="text-slate-400">Không có dữ liệu biểu đồ</p>}
        </div>

        <div className="glass-panel p-6 rounded-2xl">
          <h3 className="font-bold text-white mb-4">Hoạt động gần đây</h3>

          <div className="space-y-4">
            {recentLoans.length > 0 ? recentLoans.map(l => (
              <div key={l._id} className="flex gap-3">
                <div className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center text-xs font-bold text-blue-300">
                  {l.reader?.name?.[0] || 'U'}
                </div>

                <div>
                  <p className="text-sm text-slate-200">
                    {l.reader?.name}{' '}
                    <span className="text-slate-500">
                      {l.status === 'Đã trả' ? 'trả' : 'mượn'}
                    </span>{' '}
                    <b>{l.book?.title}</b>
                  </p>
                  <p className="text-xs text-slate-500">
                    {l.borrow_date ? new Date(l.borrow_date).toLocaleDateString() : ''}
                  </p>
                </div>
              </div>
            )) : <p className="text-slate-500 text-sm">Chưa có giao dịch</p>}
          </div>
        </div>
      </div>
    </>
  )
}

function Card({ title, value, note, danger }) {
  return (
    <div className="glass-panel p-6 rounded-2xl">
      <p className="text-slate-400 text-sm">{title}</p>
      <div className="flex justify-between items-end mt-2">
        <h3 className={`text-3xl font-bold ${danger ? 'text-rose-400' : 'text-white'}`}>
          {value ?? 0}
        </h3>
        {note && (
          <span className="text-xs px-2 py-1 rounded bg-emerald-500/20 text-emerald-300">
            {note}
          </span>
        )}
      </div>
    </div>
  )
}
