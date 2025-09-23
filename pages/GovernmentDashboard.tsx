import React, { useState, useMemo } from 'react';
import { User, CivicIssue, IssueStatus } from '../types';
import { MOCK_ISSUES } from '../constants';
import Button from '../components/Button';
import Icon from '../components/Icon';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell,
} from 'recharts';

interface DashboardProps {
  user: User;
  onLogout: () => void;
}

const DashboardHeader: React.FC<DashboardProps> = ({ user, onLogout }) => (
    <header className="bg-slate-900/80 backdrop-blur-sm shadow-lg sticky top-0 z-40 border-b border-slate-800">
        <div className="container mx-auto px-6 py-4 flex justify-between items-center">
            <div className="flex items-center space-x-3">
                <Icon name="shield" className="w-8 h-8 text-green-400" />
                <h1 className="text-2xl font-bold text-white">Government Dashboard</h1>
            </div>
            <div className="flex items-center space-x-4">
                <span className="text-slate-300 hidden sm:block">Welcome, {user.name}</span>
                <Button onClick={onLogout} variant="secondary" className="!p-2 text-sm">
                  <Icon name="logout" className="w-5 h-5" />
                </Button>
            </div>
        </div>
    </header>
);

const StatCard: React.FC<{ title: string, value: number | string, iconName: any }> = ({ title, value, iconName }) => (
    <div className="bg-slate-800/50 p-6 rounded-xl border border-slate-700 flex items-center space-x-4 transition-all hover:border-cyan-500/50 hover:bg-slate-800">
        <div className="bg-slate-700 p-3 rounded-full">
            <Icon name={iconName} className="w-6 h-6 text-cyan-400" />
        </div>
        <div>
            <p className="text-slate-400 text-sm">{title}</p>
            <p className="text-2xl font-bold text-white">{value}</p>
        </div>
    </div>
);

const statusColors: { [key in IssueStatus]: { bg: string, text: string } } = {
    [IssueStatus.Reported]: { bg: 'bg-yellow-500/10', text: 'text-yellow-400' },
    [IssueStatus.InProgress]: { bg: 'bg-blue-500/10', text: 'text-blue-400' },
    [IssueStatus.Resolved]: { bg: 'bg-green-500/10', text: 'text-green-400' },
};

const severityColors: { [key: string]: string } = {
    'Low': 'text-green-400',
    'Medium': 'text-yellow-400',
    'High': 'text-red-400',
};

const GovernmentDashboard: React.FC<DashboardProps> = ({ user, onLogout }) => {
    const [issues, setIssues] = useState<CivicIssue[]>(MOCK_ISSUES);
    const [activeTab, setActiveTab] = useState('List');
    const [expandedRow, setExpandedRow] = useState<string | null>(null);

    const stats = useMemo(() => ({
        total: issues.length,
        reported: issues.filter(i => i.status === IssueStatus.Reported).length,
        inProgress: issues.filter(i => i.status === IssueStatus.InProgress).length,
        resolved: issues.filter(i => i.status === IssueStatus.Resolved).length,
    }), [issues]);

    const issueTypeData = useMemo(() => {
        const counts = issues.reduce((acc, issue) => {
            acc[issue.type] = (acc[issue.type] || 0) + 1;
            return acc;
        }, {} as Record<string, number>);
        return Object.entries(counts).map(([name, value]) => ({ name, value }));
    }, [issues]);

    const handleStatusChange = (id: string, newStatus: IssueStatus) => {
        setIssues(prevIssues => prevIssues.map(issue => 
            issue.id === id ? { ...issue, status: newStatus } : issue
        ));
    };

    const pieChartData = useMemo(() => [
        { name: 'Reported', value: stats.reported },
        { name: 'In Progress', value: stats.inProgress },
        { name: 'Resolved', value: stats.resolved },
    ], [stats]);
    const PIE_COLORS = ['#f59e0b', '#3b82f6', '#22c55e'];

    const IssueList: React.FC = () => {
        const [filter, setFilter] = useState<string>('All');
        const [searchTerm, setSearchTerm] = useState('');
        
        const filteredIssues = useMemo(() => {
            return issues
                .filter(issue => filter === 'All' || issue.status === filter)
                .filter(issue => 
                    issue.type.toLowerCase().includes(searchTerm.toLowerCase()) || 
                    issue.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    issue.location.address.toLowerCase().includes(searchTerm.toLowerCase())
                )
                .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
        }, [issues, filter, searchTerm]);

        return (
            <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl mt-8">
                <div className="p-4 border-b border-slate-700 flex flex-col md:flex-row justify-between items-center gap-4">
                    <h3 className="text-xl font-bold">All Civic Issues</h3>
                    <div className="flex items-center gap-4 w-full md:w-auto">
                        <div className="relative flex-grow">
                            <input type="text" placeholder="Search issues..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="w-full pl-10 pr-4 py-2 bg-slate-700 border border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"/>
                            <Icon name="search" className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                        </div>
                        <select onChange={e => setFilter(e.target.value)} className="bg-slate-700 border border-slate-600 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-cyan-500">
                            <option>All</option>
                            <option>Reported</option>
                            <option>In Progress</option>
                            <option>Resolved</option>
                        </select>
                    </div>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-slate-700/50">
                            <tr>
                                <th className="p-4 font-semibold">Type</th>
                                <th className="p-4 font-semibold">Location</th>
                                <th className="p-4 font-semibold">Severity</th>
                                <th className="p-4 font-semibold">Status</th>
                                <th className="p-4 font-semibold">Reported On</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredIssues.map(issue => (
                                <React.Fragment key={issue.id}>
                                    <tr onClick={() => setExpandedRow(expandedRow === issue.id ? null : issue.id)} className="border-b border-slate-700 hover:bg-slate-700/20 cursor-pointer">
                                        <td className="p-4">{issue.type}</td>
                                        <td className="p-4">{issue.location.address}</td>
                                        <td className={`p-4 font-semibold ${severityColors[issue.severity]}`}>{issue.severity}</td>
                                        <td className="p-4">
                                            <span className={`px-2 py-1 text-xs font-bold rounded-full ${statusColors[issue.status].bg} ${statusColors[issue.status].text}`}>
                                                {issue.status}
                                            </span>
                                        </td>
                                        <td className="p-4 text-slate-400">{new Date(issue.timestamp).toLocaleDateString()}</td>
                                    </tr>
                                    {expandedRow === issue.id && (
                                        <tr className="bg-slate-800/50">
                                            <td colSpan={5} className="p-4">
                                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                                    <img src={issue.imageUrl} alt={issue.type} className="rounded-lg object-cover w-full h-48"/>
                                                    <div className="md:col-span-2">
                                                        <h4 className="font-bold mb-2">Details</h4>
                                                        <p className="text-slate-300 mb-4">{issue.description}</p>
                                                        <h4 className="font-bold mb-2">Actions</h4>
                                                        <div className="flex items-center gap-2">
                                                            <span>Change status:</span>
                                                             <select value={issue.status} onChange={(e) => handleStatusChange(issue.id, e.target.value as IssueStatus)} className="bg-slate-600 border border-slate-500 rounded px-2 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-cyan-500">
                                                                <option>Reported</option>
                                                                <option>In Progress</option>
                                                                <option>Resolved</option>
                                                            </select>
                                                        </div>
                                                    </div>
                                                </div>
                                            </td>
                                        </tr>
                                    )}
                                </React.Fragment>
                            ))}
                        </tbody>
                    </table>
                    {filteredIssues.length === 0 && <p className="text-center p-8 text-slate-400">No issues found.</p>}
                </div>
            </div>
        );
    };
    
    const MapView: React.FC = () => (
        <div className="bg-slate-800/50 border border-slate-700 rounded-xl mt-8 h-[500px] p-4 relative overflow-hidden">
            <div className="absolute inset-0 map-grid"></div>
            <style>{`.map-grid { background-image: linear-gradient(rgba(203, 213, 225, 0.1) 1px, transparent 1px), linear-gradient(to right, rgba(203, 213, 225, 0.1) 1px, transparent 1px); background-size: 30px 30px; }`}</style>
            {issues.map((issue, i) => (
                <div key={issue.id} className="absolute" style={{ top: `${(issue.location.lat - 34.03) * 1500}%`, left: `${(-118.27 - issue.location.lng) * 1500}%` }}>
                    <div className="relative group">
                        <Icon name="map-pin" className={`w-8 h-8 ${severityColors[issue.severity]} drop-shadow-lg`} />
                        <div className="absolute bottom-full mb-2 w-48 bg-slate-900 p-2 rounded-lg text-sm opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                            <p className="font-bold">{issue.type}</p>
                            <p className="text-slate-400">{issue.location.address}</p>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );

    return (
        <div className="min-h-screen bg-slate-950 text-white">
            <DashboardHeader user={user} onLogout={onLogout} />
            <main className="container mx-auto p-6">
                <h2 className="text-3xl font-bold mb-6">Overview</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    <StatCard title="Total Reports" value={stats.total} iconName="list" />
                    <StatCard title="Newly Reported" value={stats.reported} iconName="filter" />
                    <StatCard title="In Progress" value={stats.inProgress} iconName="filter" />
                    <StatCard title="Resolved" value={stats.resolved} iconName="shield" />
                </div>
                
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                  <div className="lg:col-span-2 bg-slate-800/50 p-6 rounded-xl border border-slate-700">
                    <h3 className="font-bold mb-4 text-xl">Issue Trends by Type</h3>
                    <ResponsiveContainer width="100%" height={300}>
                      <BarChart data={issueTypeData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                        <XAxis dataKey="name" stroke="#94a3b8" />
                        <YAxis stroke="#94a3b8" />
                        <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155' }} />
                        <Legend />
                        <Bar dataKey="value" fill="#06b6d4" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="bg-slate-800/50 p-6 rounded-xl border border-slate-700">
                    <h3 className="font-bold mb-4 text-xl">Issue Status Distribution</h3>
                     <ResponsiveContainer width="100%" height={300}>
                        <PieChart>
                          {/* FIX: The 'percent' prop from recharts can be undefined, which would cause a type error in the arithmetic operation. Added a fallback to 0 to prevent this. */}
                          <Pie data={pieChartData} cx="50%" cy="50%" labelLine={false} outerRadius={80} fill="#8884d8" dataKey="value" label={({ name, percent }: {name: string, percent?: number}) => `${name} ${((percent || 0) * 100).toFixed(0)}%`}>
                            {pieChartData.map((entry, index) => (<Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />))}
                          </Pie>
                           <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155' }} />
                        </PieChart>
                     </ResponsiveContainer>
                  </div>
                </div>

                <div>
                    <div className="flex border-b border-slate-700">
                       <button onClick={() => setActiveTab('List')} className={`px-4 py-2 font-semibold transition-colors ${activeTab === 'List' ? 'text-cyan-400 border-b-2 border-cyan-400' : 'text-slate-400 hover:text-white'}`}>Issue List</button>
                       <button onClick={() => setActiveTab('Map')} className={`px-4 py-2 font-semibold transition-colors ${activeTab === 'Map' ? 'text-cyan-400 border-b-2 border-cyan-400' : 'text-slate-400 hover:text-white'}`}>Map View</button>
                    </div>
                    {activeTab === 'List' ? <IssueList /> : <MapView />}
                </div>
            </main>
        </div>
    );
};

export default GovernmentDashboard;
