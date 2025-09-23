
import React, { useState, useEffect } from 'react';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import CitizenPortal from './pages/CitizenPortal';
import GovernmentDashboard from './pages/GovernmentDashboard';
import { User } from './types';

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [view, setView] = useState<'home' | 'login' | 'portal' | 'dashboard'>('home');

  useEffect(() => {
    // This effect could be used to check for a stored session
    // For now, it just sets the view based on the user state.
    if (user) {
      setView(user.role === 'citizen' ? 'portal' : 'dashboard');
    } else {
      // If no user, but trying to access portal/dashboard, redirect to home
      if(view === 'portal' || view === 'dashboard') {
        setView('home');
      }
    }
  }, [user, view]);

  const handleLogin = (loggedInUser: User) => {
    setUser(loggedInUser);
  };

  const handleLogout = () => {
    setUser(null);
    setView('home');
  };

  const renderView = () => {
    switch (view) {
      case 'login':
        return <LoginPage onLogin={handleLogin} />;
      case 'portal':
        if (user) return <CitizenPortal user={user} onLogout={handleLogout} />;
        // Fallback to login if user is null
        return <LoginPage onLogin={handleLogin} />;
      case 'dashboard':
        if (user) return <GovernmentDashboard user={user} onLogout={handleLogout} />;
        // Fallback to login if user is null
        return <LoginPage onLogin={handleLogin} />;
      case 'home':
      default:
        return <HomePage onLoginClick={() => setView('login')} />;
    }
  };

  return (
      <div className="text-white bg-slate-950 font-sans">
          {renderView()}
      </div>
  );
};

export default App;
