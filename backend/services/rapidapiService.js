const axios = require("axios");

const RAPIDAPI_KEY = process.env.RAPIDAPI_KEY;
const RAPIDAPI_HOST = process.env.RAPIDAPI_HOST;

const options = {
  method: 'GET',
  headers: {
    'x-rapidapi-key': RAPIDAPI_KEY,
    'x-rapidapi-host': RAPIDAPI_HOST
  }
};

const rapidapiService = {
  // Get all fixtures
  getFixtures: async () => {
    try {
      console.log(`Fetching fixtures from: https://${RAPIDAPI_HOST}/matches/v1/recent`);
      const response = await axios.get(`https://${RAPIDAPI_HOST}/matches/v1/recent`, options);
      console.log("Fixtures fetched successfully");
      return response.data;
    } catch (error) {
      console.error("Error fetching fixtures:", error.response?.data || error.message);
      throw error;
    }
  },

  // Get live scores
  getLiveScores: async () => {
    try {
      console.log(`Fetching live scores from: https://${RAPIDAPI_HOST}/matches/v1/live`);
      const response = await axios.get(`https://${RAPIDAPI_HOST}/matches/v1/live`, options);
      console.log("Live scores fetched successfully");
      return response.data;
    } catch (error) {
      console.error("Error fetching live scores:", error.response?.data || error.message);
      throw error;
    }
  },

  // Get series list
  getSeries: async () => {
    try {
      const response = await axios.get(`https://${RAPIDAPI_HOST}/series/v1/list`, options);
      return response.data;
    } catch (error) {
      console.error("Error fetching series:", error.message);
      return null;
    }
  },

  // Get all teams (Note: Cricbuzz API usually requires a category like 'intl', 'league', etc.)
  getTeams: async (category = 'intl') => {
    try {
      const response = await axios.get(`https://${RAPIDAPI_HOST}/teams/v1/${category}`, options);
      return response.data;
    } catch (error) {
      console.error("Error fetching teams:", error.message);
      return null;
    }
  },

  // Get player details (Note: Usually requires a playerId)
  getPlayerDetails: async (playerId) => {
    try {
      const response = await axios.get(`https://${RAPIDAPI_HOST}/stats/v1/player/${playerId}`, options);
      return response.data;
    } catch (error) {
      console.error("Error fetching player details:", error.message);
      return null;
    }
  },

  // Search players
  searchPlayers: async (playerName) => {
    try {
      const response = await axios.get(`https://${RAPIDAPI_HOST}/players/v1/search`, {
        ...options,
        params: { name: playerName }
      });
      return response.data;
    } catch (error) {
      console.error("Error searching players:", error.message);
      return null;
    }
  }
};

module.exports = rapidapiService;
