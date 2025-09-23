import React, { useState, useRef, ChangeEvent, useEffect } from 'react';
import { User, CivicIssue, IssueStatus } from '../types';
import { MOCK_ISSUES, MOCK_LEADERBOARD } from '../constants';
import Button from '../components/Button';
import Icon from '../components/Icon';
import Spinner from '../components/Spinner';
import { analyzeIssueImage, AIAnalysisResult } from '../services/geminiService';

interface PortalProps {
  user: User;
  onLogout: () => void;
}

const PortalHeader: React.FC<PortalProps> = ({ user, onLogout }) => (
    <header className="bg-slate-900/80 backdrop-blur-sm shadow-lg sticky top-0 z-40 border-b border-slate-800">
        <div className="container mx-auto px-6 py-4 flex justify-between items-center">
            <div className="flex items-center space-x-3">
                <Icon name="ledger" className="w-8 h-8 text-cyan-400" />
                <h1 className="text-2xl font-bold text-white">Citizen Portal</h1>
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

const ReportIssueModal: React.FC<{onClose: () => void, onReport: (issue: CivicIssue) => void}> = ({ onClose, onReport }) => {
    const [step, setStep] = useState(1);
    const [image, setImage] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [description, setDescription] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [analysis, setAnalysis] = useState<AIAnalysisResult | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setImage(file);
            setPreviewUrl(URL.createObjectURL(file));
            setStep(2);
            handleAnalyze(file);
        }
    };

    const handleAnalyze = async (file: File) => {
        if (!file) return;
        setIsLoading(true);
        try {
            const result = await analyzeIssueImage(file);
            setAnalysis(result);
            setDescription(result.description);
            setStep(3);
        } catch (error) {
            console.error("AI analysis failed:", error);
            // Handle error state in UI
        } finally {
            setIsLoading(false);
        }
    };
    
    const handleSubmit = () => {
        if (!image || !analysis) return;
        const newIssue: CivicIssue = {
            id: `issue-${Date.now()}`,
            type: analysis.type,
            severity: analysis.severity,
            description: description,
            imageUrl: previewUrl!,
            status: IssueStatus.Reported,
            location: { lat: 0, lng: 0, address: 'Location captured automatically' },
            reportedBy: 'current_user',
            timestamp: new Date().toISOString(),
            upvotes: 1,
        };
        onReport(newIssue);
        onClose();
    };
    
    const StepIndicator: React.FC<{currentStep: number}> = ({ currentStep }) => (
        <div className="flex justify-center items-center space-x-4 mb-6">
            {[1, 2, 3].map(s => (
                <React.Fragment key={s}>
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 ${currentStep >= s ? 'border-cyan-500 bg-cyan-500/20 text-cyan-400' : 'border-slate-600 text-slate-500'}`}>
                        {s < currentStep ? <Icon name="check-circle" className="w-5 h-5" /> : s}
                    </div>
                    {s < 3 && <div className={`flex-1 h-0.5 max-w-16 ${currentStep > s ? 'bg-cyan-500' : 'bg-slate-600'}`}></div>}
                </React.Fragment>
            ))}
        </div>
    );

    return (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4 animate-fade-in">
            <div className="bg-slate-800 rounded-xl w-full max-w-lg border border-slate-700 shadow-2xl animate-fade-in-up">
                <div className="p-6 border-b border-slate-700 flex justify-between items-center">
                    <h2 className="text-2xl font-bold">Report a New Issue</h2>
                    <button onClick={onClose} className="text-slate-400 hover:text-white"><Icon name="close" /></button>
                </div>
                <div className="p-6">
                    <StepIndicator currentStep={step} />
                    {step === 1 && (
                         <div className="text-center">
                            <input type="file" accept="image/*" ref={fileInputRef} onChange={handleFileChange} className="hidden" />
                            <button onClick={() => fileInputRef.current?.click()} className="w-full h-48 border-2 border-dashed border-slate-600 rounded-lg flex flex-col items-center justify-center text-slate-400 hover:bg-slate-700/50 hover:border-cyan-500 transition">
                                <Icon name="camera" className="w-12 h-12 mb-2" />
                                <span>Click to upload a photo</span>
                            </button>
                            <p className="text-sm text-slate-500 mt-4">Your phone's camera will work best.</p>
                        </div>
                    )}
                    {step === 2 && (
                        <div className="text-center h-48 flex flex-col items-center justify-center">
                           <Spinner />
                           <p className="mt-4 text-slate-300">AI is analyzing your image...</p>
                        </div>
                    )}
                    {step === 3 && analysis && (
                         <div className="space-y-4 animate-fade-in">
                            <img src={previewUrl!} alt="Issue preview" className="w-full h-48 object-cover rounded-lg" />
                            <div className="bg-slate-700/50 p-4 rounded-lg">
                                <h3 className="font-bold text-lg mb-2">AI Analysis Results:</h3>
                                <div className="grid grid-cols-2 gap-2">
                                    <p>Type: <span className="font-semibold text-cyan-400">{analysis.type}</span></p>
                                    <p>Severity: <span className="font-semibold text-cyan-400">{analysis.severity}</span></p>
                                </div>
                            </div>
                            <textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Add or edit the description..." className="w-full p-3 bg-slate-700 border border-slate-600 rounded-lg h-24 resize-none focus:outline-none focus:ring-2 focus:ring-cyan-500"></textarea>
                            <Button onClick={handleSubmit} disabled={!analysis} className="w-full">Submit Report</Button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

const StatusTracker: React.FC<{status: IssueStatus}> = ({ status }) => {
    const steps = [IssueStatus.Reported, IssueStatus.InProgress, IssueStatus.Resolved];
    const currentStepIndex = steps.indexOf(status);

    return (
        <div className="flex items-center w-full max-w-xs mt-2">
            {steps.map((step, index) => {
                const isActive = index <= currentStepIndex;
                const isCompleted = index < currentStepIndex;
                return (
                    <React.Fragment key={step}>
                        <div className="flex flex-col items-center text-center">
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors duration-300 ${isActive ? 'bg-cyan-500' : 'bg-slate-600'}`}>
                                {isCompleted ? <Icon name="check-circle" className="w-5 h-5 text-white" /> : <div className={`w-3 h-3 rounded-full ${isActive ? 'bg-white' : 'bg-slate-500'}`}></div>}
                            </div>
                            <span className={`text-xs mt-2 font-medium ${isActive ? 'text-cyan-400' : 'text-slate-500'}`}>{step}</span>
                        </div>
                        {index < steps.length - 1 && (
                            <div className={`flex-1 h-1 mx-2 transition-colors duration-300 ${isCompleted ? 'bg-cyan-500' : 'bg-slate-600'}`}></div>
                        )}
                    </React.Fragment>
                )
            })}
        </div>
    )
}

const AnimatedCounter: React.FC<{end: number}> = ({ end }) => {
    const [count, setCount] = useState(0);
    const ref = useRef<HTMLParagraphElement>(null);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    let start = 0;
                    const duration = 1500;
                    const frameDuration = 1000 / 60;
                    const totalFrames = Math.round(duration / frameDuration);
                    let frame = 0;
                    const counter = setInterval(() => {
                        frame++;
                        const progress = frame / totalFrames;
                        const currentCount = Math.round(end * progress);
                        setCount(currentCount);
                        if (frame === totalFrames) {
                            clearInterval(counter);
                        }
                    }, frameDuration);
                }
            },
            { threshold: 0.5 }
        );
        if (ref.current) observer.observe(ref.current);
        return () => observer.disconnect();
    }, [end]);

    return <p ref={ref} className="text-4xl font-bold text-cyan-400">{count}</p>;
};


const CitizenPortal: React.FC<PortalProps> = ({ user, onLogout }) => {
  const [activeTab, setActiveTab] = useState('reports');
  const [showModal, setShowModal] = useState(false);
  const [myIssues, setMyIssues] = useState<CivicIssue[]>(MOCK_ISSUES.filter(i => i.reportedBy === 'user-1' || i.reportedBy === 'current_user').sort((a,b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()));
  
  const handleReport = (issue: CivicIssue) => {
    setMyIssues([issue, ...myIssues]);
  };

  return (
    <div className="min-h-screen bg-slate-950">
      <PortalHeader user={user} onLogout={onLogout} />
      
      {showModal && <ReportIssueModal onClose={() => setShowModal(false)} onReport={handleReport} />}

      <main className="container mx-auto p-6">
        <div className="grid md:grid-cols-3 gap-6 mb-8">
            <div className="md:col-span-2 bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl p-6 flex justify-between items-center">
                <div>
                    <h2 className="text-3xl font-bold">Hello, {user.name}</h2>
                    <p className="text-slate-400">Thank you for making a difference in our community.</p>
                </div>
                 <div className="text-right">
                    <p className="text-slate-400 text-sm">Civic Points</p>
                    <AnimatedCounter end={user.civicPoints || 0} />
                 </div>
            </div>
            <Button onClick={() => setShowModal(true)} className="h-full text-lg">
                <div className="flex items-center justify-center gap-2">
                    <Icon name="camera" />
                    <span>Report New Issue</span>
                </div>
            </Button>
        </div>
        
        <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl p-2 md:p-4">
             <div className="flex border-b border-slate-700 mb-4">
                <button onClick={() => setActiveTab('reports')} className={`px-4 py-2 font-semibold transition-colors ${activeTab === 'reports' ? 'text-cyan-400 border-b-2 border-cyan-400' : 'text-slate-400 hover:text-white'}`}>My Reports</button>
                <button onClick={() => setActiveTab('leaderboard')} className={`px-4 py-2 font-semibold transition-colors ${activeTab === 'leaderboard' ? 'text-cyan-400 border-b-2 border-cyan-400' : 'text-slate-400 hover:text-white'}`}>Leaderboard</button>
            </div>

            {activeTab === 'reports' && (
                <div className="space-y-4">
                    {myIssues.map(issue => (
                        <div key={issue.id} className="bg-slate-700/50 p-4 rounded-lg">
                           <div className="flex items-start gap-4">
                            <img src={issue.imageUrl} alt={issue.type} className="w-28 h-28 object-cover rounded-md hidden sm:block" />
                            <div className="flex-1">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <h3 className="font-bold text-lg">{issue.type}</h3>
                                        <p className="text-sm text-slate-400 flex items-center gap-1"><Icon name="pin" className="w-4 h-4" /> {issue.location.address}</p>
                                    </div>
                                    <span className="text-xs text-slate-500 flex-shrink-0">{new Date(issue.timestamp).toLocaleDateString()}</span>
                                </div>
                                <p className="text-sm text-slate-300 mt-2 mb-4">{issue.description}</p>
                                <StatusTracker status={issue.status}/>
                            </div>
                           </div>
                        </div>
                    ))}
                    {myIssues.length === 0 && <p className="text-center text-slate-400 py-8">You haven't reported any issues yet.</p>}
                </div>
            )}

            {activeTab === 'leaderboard' && (
                <div>
                     <ul className="space-y-2">
                        {MOCK_LEADERBOARD.map((p, index) => (
                            <li key={p.name} className={`flex justify-between items-center p-3 rounded-lg ${index < 3 ? 'bg-slate-700/50' : 'bg-slate-700/20'}`}>
                                <div className="flex items-center">
                                    <span className="font-bold text-slate-400 w-8">{index + 1}</span>
                                    <span className={p.name === user.name ? 'text-cyan-400 font-bold' : ''}>{p.name}</span>
                                </div>
                                <span className="font-semibold text-cyan-400">{p.points} pts</span>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
      </main>
    </div>
  );
};

export default CitizenPortal;