import React from 'react'
import { Routes, Route, Link, useLocation } from 'react-router-dom'
import Home from './pages/Home'
import Admin from './pages/Admin'
import './App.css'
import cbLogo from '../assets/CB-KARE.jpeg'
import eventLogo from '../assets/EventLogo.jpeg'

function App() {
  const location = useLocation()

  return (
    <div className="app">
      <header className="navbar">
        <div className="navbar-container">
          <div className="navbar-left">
            <img src={cbLogo} alt="CB-KARE Logo" className="navbar-logo" />
            <div className="navbar-brand">
              <span className="brand-innovate">INNOVATE</span>
              <span className="brand-kare">KARE-2.0</span>
            </div>
          </div>
          
          <nav className="navbar-nav">
            <Link 
              to="/" 
              className={`nav-item ${location.pathname === '/' ? 'active' : ''}`}
            >
              Leaderboard
            </Link>
            <Link 
              to="/admin" 
              className={`nav-item ${location.pathname === '/admin' ? 'active' : ''}`}
            >
              Admin
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