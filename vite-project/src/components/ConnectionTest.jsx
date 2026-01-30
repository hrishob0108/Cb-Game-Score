import React, { useState, useEffect } from 'react'
import { CheckCircle, AlertCircle, Loader } from 'lucide-react'
import { checkHealth, teamAPI } from '../api/apiClient'

const ConnectionTest = () => {
  const [status, setStatus] = useState('checking')
  const [message, setMessage] = useState('Checking connection...')
  const [teams, setTeams] = useState([])
  const [error, setError] = useState('')

  useEffect(() => {
    const testConnection = async () => {
      try {
        // Check health
        const isHealthy = await checkHealth()
        if (!isHealthy) {
          setStatus('error')
          setMessage('Backend server is not responding')
          return
        }

        // Try to fetch teams
        const response = await teamAPI.getAllTeams()
        setTeams(response.data || [])
        setStatus('success')
        setMessage(`Connected! Found ${(response.data || []).length} teams in database`)
      } catch (err) {
        setStatus('error')
        setError(err.message)
        setMessage(`Connection failed: ${err.message}`)
      }
    }

    testConnection()
  }, [])

  return (
    <div style={{
      padding: '20px',
      margin: '20px 0',
      borderRadius: '8px',
      backgroundColor: status === 'success' ? '#d4edda' : status === 'error' ? '#f8d7da' : '#e2e3e5',
      border: `1px solid ${status === 'success' ? '#28a745' : status === 'error' ? '#dc3545' : '#6c757d'}`
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        {status === 'checking' && <Loader size={20} style={{ animation: 'spin 1s linear infinite' }} />}
        {status === 'success' && <CheckCircle size={20} color="#28a745" />}
        {status === 'error' && <AlertCircle size={20} color="#dc3545" />}
        <span style={{ color: status === 'success' ? '#155724' : status === 'error' ? '#721c24' : '#383d41' }}>
          {message}
        </span>
      </div>
      {teams.length > 0 && (
        <div style={{ marginTop: '10px', fontSize: '12px' }}>
          <strong>Teams in Database:</strong>
          <ul style={{ marginTop: '5px' }}>
            {teams.slice(0, 5).map((team, idx) => (
              <li key={idx}>{team.teamName}: {team.squidScore} points</li>
            ))}
            {teams.length > 5 && <li>...and {teams.length - 5} more</li>}
          </ul>
        </div>
      )}
      {error && <div style={{ marginTop: '10px', fontSize: '12px', color: '#721c24' }}>Error: {error}</div>}
    </div>
  )
}

export default ConnectionTest
