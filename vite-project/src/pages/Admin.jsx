import React, { useState, useEffect, useRef } from 'react'
import { Shield, Save, Award, Search, X, Filter, Download, Upload, BarChart, Zap, TrendingUp, Bell, Clock, Eye, EyeOff } from 'lucide-react'
import teamsData from '../data/teams.json'
import './Admin.css'

const Admin = () => {
  const [teams, setTeams] = useState([])
  const [adminKey, setAdminKey] = useState('')
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [savedMessage, setSavedMessage] = useState("")
  const [searchQuery, setSearchQuery] = useState("")
  const [filterOption, setFilterOption] = useState("all")
  const [bulkScore, setBulkScore] = useState("")
  const [showHistory, setShowHistory] = useState(false)
  const [scoreHistory, setScoreHistory] = useState([])
  const [autoSave, setAutoSave] = useState(false)
  const [scoreVisibility, setScoreVisibility] = useState(true)
  const [quickPresets, setQuickPresets] = useState([50, 100, 200, 500])
  const fileInputRef = useRef(null)

  const colors = [
    "#FF0000", "#00FF88", "#0066FF", "#FFD700", 
    "#FF00FF", "#00FFFF", "#FF8800", "#8800FF"
  ]

  useEffect(() => {
    const authStatus = localStorage.getItem('adminAuthenticated')
    if (authStatus === 'true') {
      setIsAuthenticated(true)
    }
    
    const savedTeams = localStorage.getItem('hackathonTeams')
    const savedHistory = localStorage.getItem('scoreHistory')
    
    if (savedTeams) {
      setTeams(JSON.parse(savedTeams))
    } else {
      const initializedTeams = teamsData.map((team, index) => ({
        id: index + 1,
        name: team,
        score: "",
        color: colors[index % colors.length],
        members: 5,
        lastUpdated: new Date().toISOString()
      }))
      setTeams(initializedTeams)
    }
    
    if (savedHistory) {
      setScoreHistory(JSON.parse(savedHistory))
    }
    
    // Load auto-save preference
    const autoSavePref = localStorage.getItem('autoSave')
    if (autoSavePref) {
      setAutoSave(autoSavePref === 'true')
    }
  }, [])

  const handleLogin = (e) => {
    e.preventDefault()
    if (adminKey === 'innovate2024' || adminKey === 'admin') {
      setIsAuthenticated(true)
      localStorage.setItem('adminAuthenticated', 'true')
      setAdminKey('')
      showNotification("Admin login successful!")
    } else {
      showNotification("Invalid admin key!", "error")
    }
  }

  const showNotification = (message, type = "success") => {
    const notification = document.createElement('div')
    notification.className = `notification ${type}`
    notification.textContent = message
    document.body.appendChild(notification)
    
    setTimeout(() => {
      notification.classList.add('show')
    }, 10)
    
    setTimeout(() => {
      notification.classList.remove('show')
      setTimeout(() => {
        document.body.removeChild(notification)
      }, 300)
    }, 3000)
  }

  const handleLogout = () => {
    setIsAuthenticated(false)
    localStorage.removeItem('adminAuthenticated')
    showNotification("Logged out successfully")
  }

  const updateTeamScore = (teamId, newScore) => {
    const trimmedScore = newScore.trim()
    const score = trimmedScore === "" ? "" : trimmedScore
    
    const oldScore = teams.find(t => t.id === teamId)?.score || ""
    
    setTeams(prevTeams => 
      prevTeams.map(team => 
        team.id === teamId 
          ? { 
              ...team, 
              score,
              lastUpdated: new Date().toISOString()
            } 
          : team
      )
    )

    // Add to history
    if (oldScore !== score) {
      const newHistory = {
        teamId,
        oldScore,
        newScore: score,
        timestamp: new Date().toISOString(),
        teamName: teams.find(t => t.id === teamId)?.name
      }
      setScoreHistory(prev => [newHistory, ...prev.slice(0, 49)]) // Keep last 50 entries
    }
    
    if (autoSave) {
      saveChanges(true)
    }
  }

  const addScoreHistory = (teamId, oldScore, newScore) => {
    const historyEntry = {
      id: Date.now(),
      teamId,
      teamName: teams.find(t => t.id === teamId)?.name,
      oldScore,
      newScore,
      timestamp: new Date().toISOString(),
      type: oldScore === "" ? "set" : "update"
    }
    setScoreHistory(prev => [historyEntry, ...prev.slice(0, 9)]) // Keep last 10
    localStorage.setItem('scoreHistory', JSON.stringify([historyEntry, ...scoreHistory.slice(0, 9)]))
  }

  const addNewTeam = () => {
    const newTeamName = prompt("Enter new team name:")
    if (newTeamName && newTeamName.trim()) {
      const newId = teams.length > 0 ? Math.max(...teams.map(t => t.id)) + 1 : 1
      const newTeam = {
        id: newId,
        name: newTeamName.trim(),
        score: "",
        color: colors[teams.length % colors.length],
        members: 5,
        lastUpdated: new Date().toISOString()
      }
      setTeams([...teams, newTeam])
      showNotification(`Team "${newTeamName.trim()}" added!`)
    }
  }

  const removeTeam = (teamId) => {
    const teamName = teams.find(t => t.id === teamId)?.name
    if (window.confirm(`Remove team "${teamName}"?`)) {
      setTeams(teams.filter(team => team.id !== teamId))
      showNotification(`Team "${teamName}" removed!`)
    }
  }

  const saveChanges = (silent = false) => {
    localStorage.setItem('hackathonTeams', JSON.stringify(teams))
    localStorage.setItem('scoreHistory', JSON.stringify(scoreHistory))
    localStorage.setItem('autoSave', autoSave.toString())
    
    window.dispatchEvent(new Event('storage'))
    
    if (!silent) {
      setSavedMessage("All changes saved successfully!")
      showNotification("Scores saved and published!")
      setTimeout(() => setSavedMessage(""), 2000)
    }
  }

  const resetAllScores = () => {
    if (window.confirm("Clear all scores? This will set all team scores to empty.")) {
      setTeams(prevTeams => 
        prevTeams.map(team => ({ 
          ...team, 
          score: "",
          lastUpdated: new Date().toISOString()
        }))
      )
      showNotification("All scores cleared!")
    }
  }

  const applyBulkScore = () => {
    if (!bulkScore || isNaN(bulkScore)) {
      showNotification("Please enter a valid number for bulk score", "error")
      return
    }
    
    if (window.confirm(`Apply score ${bulkScore} to all teams?`)) {
      setTeams(prevTeams => 
        prevTeams.map(team => ({ 
          ...team, 
          score: bulkScore,
          lastUpdated: new Date().toISOString()
        }))
      )
      showNotification(`Score ${bulkScore} applied to all teams!`)
      setBulkScore("")
    }
  }

  const exportData = () => {
    const data = {
      teams,
      exportDate: new Date().toISOString(),
      totalTeams: teams.length,
      teamsWithScores: teams.filter(t => t.score !== "").length,
      totalPoints: teams.reduce((sum, team) => sum + (parseInt(team.score) || 0), 0)
    }
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `hackathon-scores-${new Date().toISOString().split('T')[0]}.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
    
    showNotification("Data exported successfully!")
  }

  const importData = (event) => {
    const file = event.target.files[0]
    if (!file) return
    
    const reader = new FileReader()
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target.result)
        if (data.teams && Array.isArray(data.teams)) {
          if (window.confirm("Import teams data? This will replace current data.")) {
            setTeams(data.teams)
            showNotification("Data imported successfully!")
          }
        } else {
          showNotification("Invalid data format", "error")
        }
      } catch (error) {
        showNotification("Error reading file", "error")
      }
    }
    reader.readAsText(file)
    
    // Reset file input
    event.target.value = ''
  }

  const filteredTeams = teams.filter(team => {
    if (!team.name.toLowerCase().includes(searchQuery.toLowerCase())) return false
    
    switch (filterOption) {
      case "scored":
        return team.score !== ""
      case "unscored":
        return team.score === ""
      case "top10":
        const sorted = [...teams].sort((a, b) => (parseInt(b.score) || 0) - (parseInt(a.score) || 0))
        return sorted.slice(0, 10).some(t => t.id === team.id)
      default:
        return true
    }
  })

  const sortedTeams = [...filteredTeams].sort((a, b) => {
    const scoreA = a.score === "" ? -1 : parseInt(a.score) || 0
    const scoreB = b.score === "" ? -1 : parseInt(b.score) || 0
    
    if (scoreA === -1 && scoreB === -1) {
      return a.name.localeCompare(b.name)
    } else if (scoreA === -1) {
      return 1
    } else if (scoreB === -1) {
      return -1
    } else {
      return scoreB - scoreA
    }
  })

  const totalPoints = teams.reduce((sum, team) => {
    const score = team.score === "" ? 0 : parseInt(team.score) || 0
    return sum + score
  }, 0)
  
  const maxScore = Math.max(...teams.map(team => {
    const score = team.score === "" ? 0 : parseInt(team.score) || 0
    return score
  }))

  const teamsWithScores = teams.filter(team => team.score !== "").length
  const averageScore = teamsWithScores > 0 ? Math.round(totalPoints / teamsWithScores) : 0

  if (!isAuthenticated) {
    return (
      <div className="admin-auth-page">
        <div className="auth-container">
          <div className="auth-header">
            <div className="auth-icon">
              <Shield size={48} />
            </div>
            <h2>Admin Login</h2>
            <p>Enter password to access advanced controls</p>
          </div>
          
          <form onSubmit={handleLogin} className="auth-form">
            <input
              type="password"
              value={adminKey}
              onChange={(e) => setAdminKey(e.target.value)}
              placeholder="Enter admin password"
              required
              className="auth-input"
            />
            <button type="submit" className="auth-button">
              <Shield size={20} />
              Login as Admin
            </button>
          </form>
          
          <div className="auth-hints">
            <div className="hint">
              <Award size={16} />
              <span>Password: <strong>innovate2024</strong></span>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="admin-page">
      <div className="admin-header">
        <div className="admin-title">
          <Shield size={28} />
          <h2>Advanced Score Manager</h2>
          <div className="admin-badge">
            <Zap size={16} />
            <span>ADMIN</span>
          </div>
        </div>
        
        <div className="admin-actions">
          <button onClick={() => saveChanges()} className="save-button">
            <Save size={20} />
            Save & Publish
          </button>
          <button onClick={exportData} className="export-button">
            <Download size={20} />
            Export
          </button>
          <button onClick={() => fileInputRef.current?.click()} className="import-button">
            <Upload size={20} />
            Import
          </button>
          <button onClick={() => setShowHistory(!showHistory)} className="history-button">
            <Clock size={20} />
            History
          </button>
          <button onClick={handleLogout} className="logout-button">
            Logout
          </button>
        </div>
        <input
          type="file"
          ref={fileInputRef}
          onChange={importData}
          accept=".json"
          style={{ display: 'none' }}
        />
      </div>

      {savedMessage && (
        <div className="saved-message">
          <Save size={20} />
          {savedMessage}
        </div>
      )}

      {/* Quick Stats Bar */}
      <div className="quick-stats-bar">
        <div className="stat-item">
          <BarChart size={18} />
          <div className="stat-info">
            <div className="stat-value">{teams.length}</div>
            <div className="stat-label">Teams</div>
          </div>
        </div>
        <div className="stat-item">
          <TrendingUp size={18} />
          <div className="stat-info">
            <div className="stat-value">{teamsWithScores}</div>
            <div className="stat-label">Scored</div>
          </div>
        </div>
        <div className="stat-item">
          <BarChart size={18} />
          <div className="stat-info">
            <div className="stat-value">{totalPoints}</div>
            <div className="stat-label">Points</div>
          </div>
        </div>
        <div className="stat-item">
          <TrendingUp size={18} />
          <div className="stat-info">
            <div className="stat-value">{averageScore}</div>
            <div className="stat-label">Average</div>
          </div>
        </div>
        <div className="stat-item">
          <Zap size={18} />
          <div className="stat-info">
            <div className="stat-value">{maxScore}</div>
            <div className="stat-label">Highest</div>
          </div>
        </div>
      </div>

      {/* Control Panel */}
      <div className="control-panel">
        <div className="control-group">
          <div className="control-header">
            <Search size={20} />
            <h4>Search & Filter</h4>
          </div>
          <div className="search-container">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search teams..."
              className="search-input"
            />
            {searchQuery && (
              <button 
                className="clear-search"
                onClick={() => setSearchQuery("")}
              >
                <X size={18} />
              </button>
            )}
          </div>
          <div className="filter-options">
            <button 
              className={`filter-btn ${filterOption === 'all' ? 'active' : ''}`}
              onClick={() => setFilterOption('all')}
            >
              All Teams
            </button>
            <button 
              className={`filter-btn ${filterOption === 'scored' ? 'active' : ''}`}
              onClick={() => setFilterOption('scored')}
            >
              Scored
            </button>
            <button 
              className={`filter-btn ${filterOption === 'unscored' ? 'active' : ''}`}
              onClick={() => setFilterOption('unscored')}
            >
              Unscored
            </button>
            <button 
              className={`filter-btn ${filterOption === 'top10' ? 'active' : ''}`}
              onClick={() => setFilterOption('top10')}
            >
              Top 10
            </button>
          </div>
        </div>

        <div className="control-group">
          <div className="control-header">
            <Zap size={20} />
            <h4>Quick Actions</h4>
          </div>
          <div className="bulk-action">
            <input
              type="number"
              value={bulkScore}
              onChange={(e) => setBulkScore(e.target.value)}
              placeholder="Score for all teams"
              className="bulk-input"
            />
            <button onClick={applyBulkScore} className="bulk-apply">
              Apply to All
            </button>
          </div>
          <div className="action-buttons">
            <button onClick={resetAllScores} className="action-btn reset">
              <X size={16} />
              Clear All Scores
            </button>
            <button onClick={addNewTeam} className="action-btn add">
              +
              Add New Team
            </button>
            <button 
              onClick={() => setScoreVisibility(!scoreVisibility)} 
              className="action-btn visibility"
            >
              {scoreVisibility ? <EyeOff size={16} /> : <Eye size={16} />}
              {scoreVisibility ? 'Hide Scores' : 'Show Scores'}
            </button>
          </div>
        </div>

        <div className="control-group">
          <div className="control-header">
            <Bell size={20} />
            <h4>Settings</h4>
          </div>
          <div className="settings-options">
            <label className="setting-toggle">
              <input
                type="checkbox"
                checked={autoSave}
                onChange={(e) => {
                  setAutoSave(e.target.checked)
                  showNotification(e.target.checked ? "Auto-save enabled" : "Auto-save disabled")
                }}
              />
              <span className="toggle-slider"></span>
              <span className="toggle-label">Auto-save changes</span>
            </label>
            <label className="setting-toggle">
              <input
                type="checkbox"
                checked={scoreVisibility}
                onChange={(e) => setScoreVisibility(e.target.checked)}
              />
              <span className="toggle-slider"></span>
              <span className="toggle-label">Show scores to public</span>
            </label>
          </div>
        </div>
      </div>

      {/* Score History Panel */}
      {showHistory && (
        <div className="history-panel">
          <div className="history-header">
            <h3>Score Change History</h3>
            <button onClick={() => setScoreHistory([])} className="clear-history">
              Clear History
            </button>
          </div>
          <div className="history-list">
            {scoreHistory.length === 0 ? (
              <div className="no-history">
                <Clock size={48} />
                <p>No score changes recorded yet</p>
              </div>
            ) : (
              scoreHistory.map((entry, index) => (
                <div key={index} className="history-item">
                  <div className="history-time">
                    {new Date(entry.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </div>
                  <div className="history-details">
                    <div className="history-team">{entry.teamName || `Team ${entry.teamId}`}</div>
                    <div className="history-change">
                      {entry.oldScore === "" ? "Set to " : `${entry.oldScore} → `}
                      <strong>{entry.newScore || "Empty"}</strong>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* Score Input Table */}
      <div className="admin-panel">
        <div className="panel-header">
          <h3>Team Score Management</h3>
          <p>Showing {sortedTeams.length} of {teams.length} teams</p>
        </div>

        <div className="teams-score-table">
          <div className="table-header">
            <div className="header-team">TEAM</div>
            <div className="header-score">SCORE</div>
            <div className="header-members">MEMBERS</div>
            <div className="header-actions">ACTIONS</div>
          </div>

          {sortedTeams.length === 0 ? (
            <div className="no-results">
              <Search size={48} />
              <p>No teams found matching your criteria</p>
            </div>
          ) : (
            <div className="table-body">
              {sortedTeams.map(team => (
                <div key={team.id} className="team-score-row">
                  <div className="team-info">
                    <div className="team-initial" style={{ backgroundColor: team.color }}>
                      {team.name.charAt(0)}
                    </div>
                    <div className="team-details">
                      <div className="team-name">{team.name}</div>
                      <div className="team-updated">
                        Last updated: {new Date(team.lastUpdated).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </div>
                    </div>
                  </div>
                  
                  <div className="score-input-container">
                    <input
                      type="text"
                      value={team.score}
                      onChange={(e) => updateTeamScore(team.id, e.target.value)}
                      className="score-input"
                      placeholder="Enter points"
                      inputMode="numeric"
                      pattern="[0-9]*"
                    />
                    <span className="points-label">points</span>
                  </div>

                  <div className="team-members-display">
                    <div className="members-count">5</div>
                    <div className="members-label">members</div>
                  </div>

                  <div className="team-actions">
                    <button 
                      className="action-btn quick-add"
                      onClick={() => updateTeamScore(team.id, ((parseInt(team.score) || 0) + 1).toString())}
                    >
                      +1
                    </button>
                    <button 
                      className="action-btn quick-subtract"
                      onClick={() => updateTeamScore(team.id, Math.max(0, (parseInt(team.score) || 0) - 1).toString())}
                    >
                      -1
                    </button>
                    <button 
                      className="action-btn delete"
                      onClick={() => removeTeam(team.id)}
                      title="Remove team"
                    >
                      ×
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="panel-footer">
          <div className="footer-stats">
            <div className="footer-stat">
              <span>Teams Displayed:</span>
              <strong>{sortedTeams.length}</strong>
            </div>
            <div className="footer-stat">
              <span>Total Points:</span>
              <strong>{totalPoints}</strong>
            </div>
            <div className="footer-stat">
              <span>Average Score:</span>
              <strong>{averageScore}</strong>
            </div>
          </div>
          <div className="footer-actions">
            <button onClick={saveChanges} className="save-btn">
              <Save size={18} />
              Save All Changes
            </button>
            <button onClick={exportData} className="export-btn">
              <Download size={18} />
              Export Data
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Admin