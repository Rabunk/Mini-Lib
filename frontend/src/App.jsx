import './App.css'
import AppRouter from './pages'
import Sidebar from './components/sidebar'
import axios from 'axios'
import { useEffect } from 'react'
import { requestInit } from './config/request'

function App() {
  return (
    useEffect(() => {
      const fetchData = async () => {
        const response = await requestInit();
        console.log(response);
      };
      fetchData();
    }, []),
    <div className="flex h-screen">
      <div className="glass-bg-animation">
        <div className="orb orb-1"></div>
        <div className="orb orb-2"></div>
        <div className="orb orb-3"></div>
      </div>

      {/* sidebar */}
      <Sidebar />
      {/* main content area */}
      <main className="flex-1 p-4 pl-0 h-screen flex flex-col relative z-10 overflow-hidden">
        

        <div id="content-area" className="flex-1 overflow-y-auto px-4 pb-4 custom-scrollbar">
          <AppRouter />
        </div>
      </main>
    </div>
  )
}

export default App
