import React, { useState, useEffect } from 'react'
import { Trophy, Users } from 'lucide-react'
import teamsData from '../data/teams.json'
import squidGuard from '../assets/sq1.png'
import './Home.css'

const Home = () => {
  const [teams, setTeams] = useState([])
  const [gameStatus] = useState("InnovateKare 2 Hackathon")

  const colors = [
    "#FF0000", "#00FF88", "#0066FF", "#FFD700", 
    "#FF00FF", "#00FFFF", "#FF8800", "#8800FF"
  ]

  useEffect(() => {
    const savedTeams = localStorage.getItem('hackathonTeams')
    
    if (savedTeams) {
      setTeams(JSON.parse(savedTeams))
    } else {
      const initializedTeams = teamsData.map((team, index) => ({
        id: index + 1,
        name: team,
        score: "",
        color: colors[index % colors.length],
        members: 5
      }))
      setTeams(initializedTeams)
      localStorage.setItem('hackathonTeams', JSON.stringify(initializedTeams))
    }

    const handleStorageChange = () => {
      const updatedTeams = localStorage.getItem('hackathonTeams')
      if (updatedTeams) {
        setTeams(JSON.parse(updatedTeams))
      }
    }
    
    window.addEventListener('storage', handleStorageChange)
    return () => window.removeEventListener('storage', handleStorageChange)
  }, [])

  const sortedTeams = [...teams].sort((a, b) => {
    const scoreA = a.score === "" ? -1 : parseInt(a.score) || 0
    const scoreB = b.score === "" ? -1 : parseInt(b.score) || 0
    return scoreB - scoreA
  })

  const getMedal = (position) => {
    if (position === 0) return { emoji: "🥇", color: "#FFD700", name: "Gold" }
    if (position === 1) return { emoji: "🥈", color: "#C0C0C0", name: "Silver" }
    if (position === 2) return { emoji: "🥉", color: "#CD7F32", name: "Bronze" }
    return { emoji: null, color: null, name: null }
  }

  const totalPoints = teams.reduce((sum, team) => {
    const score = team.score === "" ? 0 : parseInt(team.score) || 0
    return sum + score
  }, 0)
  
  const maxScore = Math.max(...teams.map(team => {
    const score = team.score === "" ? 0 : parseInt(team.score) || 0
    return score
  }))

  const teamsWithScores = teams.filter(team => team.score !== "").length

  // Get top 3 teams that actually have scores
  const topTeams = sortedTeams.filter(team => team.score !== "").slice(0, 3)

  return (
    <div className="home-page">
      <img src={squidGuard} alt="Squid Guard Left" className="corner-squid corner-left" />
      <img src={squidGuard} alt="Squid Guard Right" className="corner-squid corner-right" />
      
      <div className="game-status">
        <div className="status-indicator"></div>
        <div className="status-content">
          <h3>{gameStatus}</h3>
          <p>Live Score Board • Type scores in Admin Panel</p>
        </div>
        <div className="status-timer">
          <div className="timer">LIVE</div>
          <div className="timer-label">Scores Updating</div>
        </div>
      </div>

      <div className="stats-overview">
        <div className="stat-card">
          <div className="stat-icon">
            <Trophy size={24} />
          </div>
          <div className="stat-content">
            <div className="stat-value">{teams.length}</div>
            <div className="stat-label">Teams</div>
          </div>
        </div>
        
        <div className="stat-card">
          <div className="stat-icon">
            <Trophy size={24} />
          </div>
          <div className="stat-content">
            <div className="stat-value">{teamsWithScores}</div>
            <div className="stat-label">Scored</div>
          </div>
        </div>
        
        <div className="stat-card">
          <div className="stat-icon">
            <Users size={24} />
          </div>
          <div className="stat-content">
            <div className="stat-value">{teams.length * 5}</div>
            <div className="stat-label">Players</div>
          </div>
        </div>
        
        <div className="stat-card">
          <div className="stat-icon">
            <Trophy size={24} />
          </div>
          <div className="stat-content">
            <div className="stat-value">{totalPoints}</div>
            <div className="stat-label">Total Points</div>
          </div>
        </div>
      </div>

      <div className="leaderboard-section">
        <div className="section-header">
          <div className="section-title">
            <Trophy className="section-icon" size={28} />
            <h2>SCORE BOARD</h2>
          </div>
          <div className="live-badge">
            <div className="pulse"></div>
            LIVE
          </div>
        </div>

        <div className="leaderboard-container">
          {/* Top 3 Teams with Medals - SIMPLIFIED */}
          {topTeams.length > 0 && (
            <div className="podium-section">
              <div className="podium-header">
                <h3>🏆 TOP 3 TEAMS 🏆</h3>
              </div>
              <div className="podium">
                {topTeams.map((team, index) => {
                  const medal = getMedal(index)
                  return (
                    <div key={team.id} className={`podium-place place-${index + 1}`}>
                      <div className="medal-display">{medal.emoji}</div>
                      <div 
                        className="podium-team" 
                        style={{ 
                          borderColor: medal.color
                        }}
                      >
                        <div className="team-initial" style={{ backgroundColor: team.color }}>
                          {team.name.charAt(0)}
                        </div>
                        <div className="podium-team-name">{team.name}</div>
                        <div className="team-score">{team.score}</div>
                        <div className="team-members">
                          <Users size={14} />
                          <span>5 members</span>
                        </div>
                        <div className="medal-badge" style={{ color: medal.color }}>
                          {medal.emoji}
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          )}

          {/* All Teams List */}
          <div className="leaderboard-list">
            {sortedTeams.map((team, index) => {
              const medal = index < 3 && team.score !== "" ? getMedal(index) : null
              return (
                <div 
                  key={team.id} 
                  className="leaderboard-row"
                  style={{ borderLeftColor: team.color }}
                >
                  <div className="row-rank">
                    <span className="rank-number">#{index + 1}</span>
                    {medal && <span className="row-medal">{medal.emoji}</span>}
                  </div>
                  <div className="row-team">
                    <div className="team-initial" style={{ backgroundColor: team.color }}>
                      {team.name.charAt(0)}
                    </div>
                    <div className="team-info">
                      <div className="team-name">{team.name}</div>
                      <div className="team-meta">
                        <Users size={14} />
                        <span>5 members</span>
                      </div>
                    </div>
                  </div>
                  <div className="row-score-display">
                    <div className="score-value">{team.score || ""}</div>
                    <div className="score-label">{team.score ? "points" : ""}</div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        <div className="leaderboard-legend">
          <div className="legend-item">
            <div className="legend-icon">🥇</div>
            <span>1st Place (Gold)</span>
          </div>
          <div className="legend-item">
            <div className="legend-icon">🥈</div>
            <span>2nd Place (Silver)</span>
          </div>
          <div className="legend-item">
            <div className="legend-icon">🥉</div>
            <span>3rd Place (Bronze)</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Home