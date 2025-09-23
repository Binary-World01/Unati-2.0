
import React, { useState } from 'react';
import Button from '../components/Button';
import Icon from '../components/Icon';
import { User } from '../types';

interface LoginPageProps {
  onLogin: (user: User) => void;
}

const LoginPage: React.FC<LoginPageProps> = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = (role: 'citizen' | 'government') => {
    if (username.trim() === '') {
      setError('Please enter a username.');
      return;
    }
    setError('');
    
    // In a real app, you'd use the username to fetch user data
    // Here we'll just use a mock object
    const user: User = {
      id: role === 'citizen' ? 'user-1' : 'gov-1',
      name: username,
      role: role,
      civicPoints: role === 'citizen' ? 180 : undefined,
    };
    onLogin(user);
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="flex justify-center items-center space-x-2 mb-8">
          <Icon name="ledger" className="w-10 h-10 text-cyan-400" />
          <h1 className="text-4xl font-bold text-white">CivicLedger</h1>
        </div>
        <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl p-8 shadow-2xl">
          <h2 className="text-2xl font-bold text-center text-white mb-6">Login</h2>
          {error && <p className="bg-red-500/20 text-red-400 p-3 rounded-lg mb-4 text-center">{error}</p>}
          <div className="space-y-4">
            <input
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 text-white"
            />
            <input
              type="password"
              placeholder="Password (mock)"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 text-white"
            />
          </div>
          <div className="mt-6 space-y-3">
             <Button onClick={() => handleLogin('citizen')} className="w-full text-lg" variant="primary">
                Login as Citizen
             </Button>
             <Button onClick={() => handleLogin('government')} className="w-full text-lg" variant="secondary">
                Login as Government Official
             </Button>
          </div>
          <p className="text-center text-sm text-slate-400 mt-6">
            Don't have an account? <a href="#" className="font-semibold text-cyan-400 hover:underline">Register</a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
