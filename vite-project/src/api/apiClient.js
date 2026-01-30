// API Configuration
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Generic fetch function with error handling
const apiCall = async (endpoint, method = 'GET', body = null) => {
  try {
    const options = {
      method,
      headers: {
        'Content-Type': 'application/json',
      },
    };

    if (body) {
      options.body = JSON.stringify(body);
    }

    const response = await fetch(`${API_BASE_URL}${endpoint}`, options);

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || `HTTP Error: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
};

// Team API Functions
export const teamAPI = {
  // Create a new team
  createTeam: async (teamName, squidScore) => {
    return apiCall('/admin', 'POST', { teamName, squidScore });
  },

  // Get all teams
  getAllTeams: async () => {
    return apiCall('/admin');
  },

  // Get team by ID
  getTeamById: async (id) => {
    return apiCall(`/admin/${id}`);
  },

  // Get team by name
  getTeamByName: async (teamName) => {
    return apiCall(`/admin/name/${teamName}`);
  },

  // Update team by ID
  updateTeam: async (id, teamName, squidScore) => {
    return apiCall(`/admin/${id}`, 'PUT', { teamName, squidScore });
  },

  // Delete team by ID
  deleteTeam: async (id) => {
    return apiCall(`/admin/${id}`, 'DELETE');
  },

  // Update score by team name
  updateScoreByTeamName: async (teamName, score) => {
    return apiCall(`/admin/update-score/${encodeURIComponent(teamName)}`, 'PATCH', { score });
  },

  // Initialize all teams with zero scores
  initializeAllTeams: async () => {
    return apiCall('/admin/initialize', 'POST');
  },

  // Reset all scores to zero
  resetAllScores: async () => {
    return apiCall('/admin/reset-all', 'PATCH');
  },
};

// Health check
export const checkHealth = async () => {
  try {
    const response = await fetch(`${API_BASE_URL.replace('/api', '')}/api/health`);
    return response.ok;
  } catch (error) {
    console.error('Health check failed:', error);
    return false;
  }
};

export default { teamAPI, checkHealth };
