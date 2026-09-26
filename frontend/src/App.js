import UserTestEngine from './UserTestEngine';
import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from './Login';
import AdminDashboard from './AdminDashboard';
import TestPage from './TestPage';
import Leaderboard from './Leaderboard';
import PracticeDashboard from './PracticeDashboard';
import PracticeSession from './PracticeSession';
import StudentResults from './StudentResults';
import GlobalLeaderboard from './GlobalLeaderboard';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Set Login as the default landing page */}
        <Route path="/" element={<Login />} />
        
        {/* Dashboards */}
        <Route path="/practice" element={<PracticeDashboard />} />
        <Route path="/admin" element={<AdminDashboard />} />
        
        {/* Practice Engine Entry Point */}
        <Route path="/aptitude" element={<PracticeSession />} />
        
        {/* Test & Leaderboard Routes */}
        <Route path="/test/:testId" element={<TestPage />} />
        <Route path="/leaderboard/:testId" element={<Leaderboard />} />
        <Route path="/assessments" element={<UserTestEngine />} />
        <Route path="/results" element={<StudentResults />} />
        <Route path="/leaderboard" element={<GlobalLeaderboard />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;