import React from 'react'
import { Routes, Route, Link, useLocation } from 'react-router-dom'
import Home from './pages/Home'
import Admin from './pages/Admin'
import { Trophy, Shield } from 'lucide-react'
import './App.css'

function App() {
  const location = useLocation()

  return (
    <div className="app">
      <header className="header">
        <div className="header-container">
          <div className="logo">
            <div className="logo-icon">
              <div className="circle">
                <div className="triangle"></div>
              </div>
            </div>
            <div className="logo-text">
              <h1>INNOVATEKARE 2</h1>
              <p className="subtitle">Squid Game Hackathon</p>
            </div>
          </div>
          
          <nav className="nav">
            <Link 
              to="/" 
              className={`nav-link ${location.pathname === '/' ? 'active' : ''}`}
            >
              <Trophy size={20} />
              <span>Leaderboard</span>
            </Link>
            <Link 
              to="/admin" 
              className={`nav-link ${location.pathname === '/admin' ? 'active' : ''}`}
            >
              <Shield size={20} />
              <span>Admin Panel</span>
            </Link>
          </nav>
        </div>
      </header>

      <main className="main-content">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/admin" element={<Admin />} />
        </Routes>
      </main>

      <footer className="footer">
        <p>© 2024 InnovateKare 2 • Squid Game Hackathon Edition</p>
        <p className="warning">Demo Mode Active • Admin Password: "innovate2024"</p>
      </footer>
    </div>
  )
}

export default App