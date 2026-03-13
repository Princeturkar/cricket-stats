const axios = require("axios");

const CRICAPI_BASE_URL = "https://api.cricapi.com/v1";
const API_KEY = process.env.CRICAPI_KEY;

const cricapiService = {
  getMatches: async () => {
    try {
      const response = await axios.get(`${CRICAPI_BASE_URL}/matches`, {
        params: { apikey: API_KEY, offset: 0 }
      });
      console.log("Raw Response:", JSON.stringify(response.data).substring(0, 500));
      return response.data.data || [];
    } catch (error) {
      console.error("Error fetching matches from CricAPI:", error.response?.data || error.message);
      return [];
    }
  },

  getMatchDetails: async (matchId) => {
    try {
      const response = await axios.get(`${CRICAPI_BASE_URL}/cricketMatch`, {
        params: { apikey: API_KEY, id: matchId }
      });
      return response.data;
    } catch (error) {
      console.error("Error fetching match details:", error.message);
      return null;
    }
  },

  getPlayerStats: async (playerId) => {
    try {
      const response = await axios.get(`${CRICAPI_BASE_URL}/playerStats`, {
        params: { apikey: API_KEY, pid: playerId }
      });
      return response.data;
    } catch (error) {
      console.error("Error fetching player stats:", error.message);
      return null;
    }
  },

  getLiveMatches: async () => {
    try {
      const response = await axios.get(`${CRICAPI_BASE_URL}/matches`, {
        params: { apikey: API_KEY, offset: 0 }
      });
      // CricAPI v1 returns data in response.data.data
      const allMatches = response.data.data || [];
      return allMatches.filter(m => 
        (m.ms === "live") || // ms: match status (live/upcoming/finished)
        (m.matchStarted === true && m.matchEnded === false) ||
        (m.status && m.status.toLowerCase().includes("live"))
      );
    } catch (error) {
      console.error("Error fetching live matches:", error.message);
      return [];
    }
  }
};

module.exports = cricapiService;
