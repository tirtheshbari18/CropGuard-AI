import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Navbar } from './components/Navbar';
import { Sidebar } from './components/Sidebar';
import { Footer } from './components/Footer';

import { LoginPage } from './pages/LoginPage';
import { DashboardPage } from './pages/DashboardPage';
import { AnalyzePage } from './pages/AnalyzePage';
import { ResultDetailPage } from './pages/ResultDetailPage';
import { InspectionsPage } from './pages/InspectionsPage';
import { MapPage } from './pages/MapPage';
import { AlertsPage } from './pages/AlertsPage';
import { AnalyticsPage } from './pages/AnalyticsPage';
import { ModelPerformancePage } from './pages/ModelPerformancePage';
import { ReportsPage } from './pages/ReportsPage';
import { SystemHealthPage } from './pages/SystemHealthPage';
import { AdminPage } from './pages/AdminPage';
import { AboutPage } from './pages/AboutPage';

import type { UserRole, Language } from './types';
import { api } from './services/api';

export const App: React.FC = () => {
  const [currentRole, setCurrentRole] = useState<UserRole>(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem('cropguard_user');
        if (saved) {
          const parsed = JSON.parse(saved);
          if (parsed.role) return parsed.role as UserRole;
        }
      } catch {
        // Fallback to default
      }
    }
    return 'FARMER';
  });
  const [language, setLanguage] = useState<Language>('en');

  const handleRoleChange = (role: UserRole) => {
    setCurrentRole(role);
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem('cropguard_user');
        const userObj = saved ? JSON.parse(saved) : {};
        userObj.role = role;
        localStorage.setItem('cropguard_user', JSON.stringify(userObj));
      } catch {
        // Ignore storage errors
      }
    }
  };

  const handleResetDemo = async () => {
    if (window.confirm('Reset demo environment and seed sample dataset?')) {
      await api.resetDemoDatabase();
      window.location.reload();
    }
  };

  return (
    <BrowserRouter>
      <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100">
        
        <Navbar
          currentRole={currentRole}
          onRoleChange={handleRoleChange}
          language={language}
          onLanguageChange={setLanguage}
          onResetDemo={handleResetDemo}
        />

        <div className="flex flex-1">
          <Sidebar language={language} />

          <main className="flex-1 p-4 lg:p-8 max-w-7xl mx-auto w-full">
            <Routes>
              <Route path="/" element={<Navigate to="/dashboard" replace />} />
              <Route path="/login" element={<LoginPage onLoginSuccess={handleRoleChange} />} />
              <Route path="/dashboard" element={<DashboardPage currentRole={currentRole} language={language} />} />
              <Route path="/analyze" element={<AnalyzePage language={language} />} />
              <Route path="/result/:id" element={<ResultDetailPage language={language} />} />
              <Route path="/inspections" element={<InspectionsPage language={language} />} />
              <Route path="/map" element={<MapPage language={language} />} />
              <Route path="/alerts" element={<AlertsPage currentRole={currentRole} language={language} />} />
              <Route path="/analytics" element={<AnalyticsPage language={language} />} />
              <Route path="/model-performance" element={<ModelPerformancePage language={language} />} />
              <Route path="/reports" element={<ReportsPage />} />
              <Route path="/system-health" element={<SystemHealthPage />} />
              <Route path="/admin" element={<AdminPage />} />
              <Route path="/about" element={<AboutPage />} />
              <Route path="*" element={<Navigate to="/dashboard" replace />} />
            </Routes>
          </main>
        </div>

        <Footer />
      </div>
    </BrowserRouter>
  );
};

export default App;
