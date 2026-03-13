import { BrowserRouter, Routes, Route, Outlet, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Matches from "./pages/Matches";
import MatchDetails from "./pages/MatchDetails";
import MatchPlayerDetails from "./pages/MatchPlayerDetails";
import Players from "./pages/Players";
import PlayerDetails from "./pages/PlayerDetails";
import ComparePlayers from "./pages/ComparePlayers";
import Login from "./pages/Login";
import Register from "./pages/Register";
import OTPVerification from "./pages/OTPVerification";
import AddMatch from "./pages/AddMatch";
import AddPlayer from "./pages/AddPlayer";
import AdminDashboard from "./pages/AdminDashboard";
import SyncMatches from "./pages/SyncMatches";
import Standings from "./pages/Standings";
import Rankings from "./pages/Rankings";
import Chat from "./pages/Chat";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import "./App.css";

import { useState } from "react";

const MainLayout = () => {
  const [theme, setTheme] = useState("t20i"); // Default theme

  return (
    <div className="main-theme-wrapper" data-theme={theme}>
      <Navbar />
      <div className="app-container">
        <Outlet context={{ setTheme }} />
      </div>
    </div>
  );
};

function App() {
  const userInfo = JSON.parse(localStorage.getItem("userInfo"));

  return (
    <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <Routes>
        {/* Pages with Navbar and Header */}
        <Route element={<MainLayout />}>
          <Route path="/" element={<Navigate to="/login" />} />
          <Route path="/dashboard" element={<Home />} />
          <Route path="/matches" element={<Matches />} />
          <Route path="/matches/:id" element={<MatchDetails />} />
          <Route path="/match-player/:matchId/:playerName/:playerTeam" element={<MatchPlayerDetails />} />
          <Route path="/players" element={<Players />} />
          <Route path="/players/:id" element={<PlayerDetails />} />
          <Route path="/compare" element={<ComparePlayers />} />
          <Route path="/add-match" element={<AddMatch />} />
          <Route path="/add-player" element={<AddPlayer />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/sync-matches" element={<SyncMatches />} />
          <Route path="/standings" element={<Standings defaultTab="standings" />} />
          <Route path="/stats" element={<Standings defaultTab="stats" />} />
          <Route path="/rankings" element={<Rankings />} />
          <Route path="/chat" element={<Chat />} />
        </Route>

        {/* Clean pages without Navbar/Header */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/verify-otp" element={<OTPVerification />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;