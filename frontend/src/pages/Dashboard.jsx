import React from 'react';

export default function Dashboard(){
  return (
    <>
      {/* Header / Tổng Quan Hệ Thống */}
      <div className="glass-panel mb-6 rounded-2xl p-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Tổng Quan Hệ Thống</h1>
          <p className="text-sm text-slate-400">Chào mừng trở lại, Administrator</p>
        </div>

        <div className="flex items-center gap-4">
          <div className="relative">
          </div>

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
            <div className="absolute top-0 right-0 w-24 h-24 bg-blue-500/20 rounded-bl-full -mr-4 -mt-4 blur-xl"></div>
            <p className="text-slate-400 text-sm font-medium">Tổng đầu sách</p>
            <div className="flex items-end justify-between mt-2">
              <h3 className="text-3xl font-bold text-white">1,248</h3>
              <span className="text-xs font-bold px-2 py-1 rounded bg-emerald-500/20 text-emerald-300">+12%</span>
            </div>
          </div>
          <div className="glass-panel p-6 rounded-2xl relative overflow-hidden group hover:scale-[1.02] transition-transform">
            <div className="absolute top-0 right-0 w-24 h-24 bg-purple-500/20 rounded-bl-full -mr-4 -mt-4 blur-xl"></div>
            <p className="text-slate-400 text-sm font-medium">Đang cho mượn</p>
            <div className="flex items-end justify-between mt-2">
              <h3 className="text-3xl font-bold text-white">142</h3>
              <span className="text-xs font-bold px-2 py-1 rounded bg-blue-500/20 text-blue-300">Active</span>
            </div>
          </div>
          <div className="glass-panel p-6 rounded-2xl relative overflow-hidden group hover:scale-[1.02] transition-transform">
            <div className="absolute top-0 right-0 w-24 h-24 bg-pink-500/20 rounded-bl-full -mr-4 -mt-4 blur-xl"></div>
            <p className="text-slate-400 text-sm font-medium">Độc giả</p>
            <div className="flex items-end justify-between mt-2">
              <h3 className="text-3xl font-bold text-white">856</h3>
              <span className="text-xs font-bold px-2 py-1 rounded bg-emerald-500/20 text-emerald-300">+5 mới</span>
            </div>
          </div>
          <div className="glass-panel p-6 rounded-2xl relative overflow-hidden group hover:scale-[1.02] transition-transform">
            <div className="absolute top-0 right-0 w-24 h-24 bg-rose-500/20 rounded-bl-full -mr-4 -mt-4 blur-xl"></div>
            <p className="text-slate-400 text-sm font-medium">Quá hạn</p>
            <div className="flex items-end justify-between mt-2">
              <h3 className="text-3xl font-bold text-white">12</h3>
              <span className="text-xs font-bold px-2 py-1 rounded bg-rose-500/20 text-rose-300">Cần xử lý</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="glass-panel lg:col-span-2 rounded-2xl p-6 h-80 flex flex-col justify-center items-center text-slate-500">
            <i className="fa-solid fa-chart-line text-4xl mb-2 opacity-50"></i>
            <p>Biểu đồ thống kê mượn trả (Placeholder)</p>
          </div>
          <div className="glass-panel rounded-2xl p-6">
            <h3 className="font-bold text-white mb-4">Hoạt động gần đây</h3>
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-300 text-xs font-bold">A</div>
                <div>
                  <p className="text-sm text-slate-200">Nguyễn Văn A <span className="text-slate-500">mượn</span> Python</p>
                  <p className="text-xs text-slate-500">2 phút trước</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-300 text-xs font-bold">B</div>
                <div>
                  <p className="text-sm text-slate-200">Trần Thị B <span className="text-slate-500">trả</span> Clean Code</p>
                  <p className="text-xs text-slate-500">15 phút trước</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
