import './App.css'
import AppRouter from './pages'
import Sidebar from './components/sidebar'
import axios from 'axios'
import { useEffect } from 'react'
import { requestInit } from './config/axiosClient'
import { useLocation } from 'react-router-dom'

function App() {
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await requestInit()
        console.log(response)
      } catch (err) {
        console.error(err)
      }
    }
    fetchData()
  }, [])

  const location = useLocation();
  const hideSiderBar = location.pathname === "/";

  return (
    <div className="flex h-screen relative">
      <div className="glass-bg-animation">
        <div className="orb orb-1"></div>
        <div className="orb orb-2"></div>
        <div className="orb orb-3"></div>
      </div>

      {!hideSiderBar && <Sidebar />}

      <main className="flex-1 p-4 pl-0 h-screen flex flex-col relative z-10 overflow-hidden">
        <div id="content-area" className="flex-1 overflow-y-auto px-4 pb-4 custom-scrollbar">
          <AppRouter />
        </div>
      </main>
    </div>
  )
}

export default App
