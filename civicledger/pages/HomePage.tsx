import React, { useEffect, useRef } from 'react';
import Button from '../components/Button';
import Icon from '../components/Icon';
import { MOCK_ISSUES } from '../constants';
import { IssueStatus } from '../types';

interface HomePageProps {
  onLoginClick: () => void;
}

const Header: React.FC<HomePageProps> = ({ onLoginClick }) => (
  <header className="fixed top-0 left-0 right-0 z-50 bg-slate-950/80 backdrop-blur-sm border-b border-slate-800">
    <div className="container mx-auto px-6 py-4 flex justify-between items-center">
      <div className="flex items-center space-x-2">
        <Icon name="ledger" className="w-8 h-8 text-cyan-400" />
        <h1 className="text-2xl font-bold text-white">CivicLedger</h1>
      </div>
      <nav className="hidden md:flex items-center space-x-6">
        <a href="#how-it-works" className="text-slate-300 hover:text-white transition">How It Works</a>
        <a href="#features" className="text-slate-300 hover:text-white transition">Features</a>
        <a href="#ledger" className="text-slate-300 hover:text-white transition">Public Ledger</a>
      </nav>
      <Button onClick={onLoginClick} variant="primary" className="px-4 py-2">Login / Register</Button>
    </div>
  </header>
);

const HeroSection: React.FC<HomePageProps> = ({ onLoginClick }) => {
  const gridRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (gridRef.current) {
        const { clientX, clientY } = e;
        gridRef.current.style.setProperty('--mouse-x', `${clientX}px`);
        gridRef.current.style.setProperty('--mouse-y', `${clientY}px`);
      }
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <section className="min-h-screen flex items-center justify-center text-center relative overflow-hidden pt-20">
      <div 
        ref={gridRef}
        className="absolute inset-0 bg-slate-950 z-0 interactive-grid"
      ></div>
      <div className="container mx-auto px-6 z-10">
        <h1 className="text-5xl md:text-7xl font-black text-white leading-tight mb-4 animate-fade-in-up">
          Building Better Communities, <span className="text-cyan-400">Together.</span>
        </h1>
        <p className="text-xl md:text-2xl text-slate-300 max-w-3xl mx-auto mb-8 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
          Report civic issues with a photo. Track progress on an unchangeable public ledger. Powered by AI and Blockchain.
        </p>
        <div className="flex justify-center space-x-4 animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
          <Button onClick={onLoginClick} variant="primary" className="text-lg">Report an Issue</Button>
          <Button onClick={onLoginClick} variant="secondary" className="text-lg">Login / Register</Button>
        </div>
      </div>
    </section>
  );
};

const AnimatedSection: React.FC<{children: React.ReactNode, id: string, className?: string}> = ({ children, id, className }) => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
        }
      },
      {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
      }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => {
      if (ref.current) {
        observer.unobserve(ref.current);
      }
    };
  }, []);
  
  return <section id={id} ref={ref} className={`py-24 transition-all duration-1000 transform opacity-0 translate-y-10 ${className}`}>{children}</section>;
}

const HowItWorksSection: React.FC = () => (
    <AnimatedSection id="how-it-works" className="bg-slate-900/50">
        <div className="container mx-auto px-6 text-center">
            <h2 className="text-4xl font-bold mb-2">A Simple 3-Step Process</h2>
            <p className="text-slate-400 mb-12 max-w-2xl mx-auto">Engaging with your community has never been easier or more transparent.</p>
            <div className="grid md:grid-cols-3 gap-8 animated-children">
                <div className="bg-slate-800 p-8 rounded-xl border border-slate-700 hover:border-cyan-500 transition-all transform hover:-translate-y-2">
                    <div className="bg-slate-700 text-cyan-400 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                        <Icon name="camera" className="w-8 h-8" />
                    </div>
                    <h3 className="text-2xl font-bold mb-3">1. Snap & Report</h3>
                    <p className="text-slate-400">See an issue? Snap a photo. Our app automatically captures the location and uses AI to identify the problem.</p>
                </div>
                <div className="bg-slate-800 p-8 rounded-xl border border-slate-700 hover:border-cyan-500 transition-all transform hover:-translate-y-2" style={{ transitionDelay: '150ms' }}>
                    <div className="bg-slate-700 text-cyan-400 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                        <Icon name="shield" className="w-8 h-8" />
                    </div>
                    <h3 className="text-2xl font-bold mb-3">2. Track & Verify</h3>
                    <p className="text-slate-400">View the issue on a public map. Officials update the status, providing a photo proof-of-fix.</p>
                </div>
                <div className="bg-slate-800 p-8 rounded-xl border border-slate-700 hover:border-cyan-500 transition-all transform hover:-translate-y-2" style={{ transitionDelay: '300ms' }}>
                    <div className="bg-slate-700 text-cyan-400 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                        <Icon name="blockchain" className="w-8 h-8" />
                    </div>
                    <h3 className="text-2xl font-bold mb-3">3. Immutable Record</h3>
                    <p className="text-slate-400">Every resolved issue is recorded on the CivicLedger, creating a permanent, transparent record.</p>
                </div>
            </div>
        </div>
    </AnimatedSection>
);

const FeaturesSection: React.FC = () => (
  <AnimatedSection id="features" className="bg-slate-950">
    <div className="container mx-auto px-6">
      <h2 className="text-4xl font-bold text-center mb-12">Empowering Everyone</h2>
      <div className="grid md:grid-cols-2 gap-10 animated-children">
        <div className="bg-slate-800/50 backdrop-blur-sm p-8 rounded-xl border border-slate-700">
          <h3 className="text-3xl font-bold text-cyan-400 mb-4">For Citizens</h3>
          <ul className="space-y-4 text-slate-300 text-lg">
            <li className="flex items-start"><Icon name="check-circle" className="text-cyan-400 w-6 h-6 mr-3 mt-1 flex-shrink-0" /> <strong>Effortless Reporting:</strong> Go from seeing to reporting in seconds.</li>
            <li className="flex items-start"><Icon name="check-circle" className="text-cyan-400 w-6 h-6 mr-3 mt-1 flex-shrink-0" /> <strong>Transparent Tracking:</strong> Real-time status updates on your reports.</li>
            <li className="flex items-start"><Icon name="check-circle" className="text-cyan-400 w-6 h-6 mr-3 mt-1 flex-shrink-0" /> <strong>Community Upvoting:</strong> Highlight urgent issues with your vote.</li>
            <li className="flex items-start"><Icon name="check-circle" className="text-cyan-400 w-6 h-6 mr-3 mt-1 flex-shrink-0" /> <strong>Gamified Engagement:</strong> Earn points and climb the leaderboard.</li>
          </ul>
        </div>
        <div className="bg-slate-800/50 backdrop-blur-sm p-8 rounded-xl border border-slate-700" style={{ transitionDelay: '150ms' }}>
          <h3 className="text-3xl font-bold text-green-400 mb-4">For Government</h3>
          <ul className="space-y-4 text-slate-300 text-lg">
            <li className="flex items-start"><Icon name="check-circle" className="text-green-400 w-6 h-6 mr-3 mt-1 flex-shrink-0" /> <strong>AI-Powered Dashboard:</strong> Automatically categorize and prioritize issues.</li>
            <li className="flex items-start"><Icon name="check-circle" className="text-green-400 w-6 h-6 mr-3 mt-1 flex-shrink-0" /> <strong>Actionable Analytics:</strong> Identify hotspots and recurring problems with data.</li>
            <li className="flex items-start"><Icon name="check-circle" className="text-green-400 w-6 h-6 mr-3 mt-1 flex-shrink-0" /> <strong>Verifiable Resolutions:</strong> Photo proof builds public trust and accountability.</li>
             <li className="flex items-start"><Icon name="check-circle" className="text-green-400 w-6 h-6 mr-3 mt-1 flex-shrink-0" /> <strong>Efficient Workflow:</strong> Streamline issue assignment and management.</li>
          </ul>
        </div>
      </div>
    </div>
  </AnimatedSection>
);

const LedgerPreview: React.FC = () => {
    const resolvedIssues = MOCK_ISSUES.filter(issue => issue.status === IssueStatus.Resolved);
    const duplicatedIssues = [...resolvedIssues, ...resolvedIssues, ...resolvedIssues]; 

    return (
        <AnimatedSection id="ledger" className="bg-slate-900/50">
            <div className="container mx-auto px-6">
                <h2 className="text-4xl font-bold text-center mb-12">Live Public Ledger</h2>
                <div className="relative w-full overflow-hidden [mask-image:linear-gradient(to_right,transparent,white_10%,white_90%,transparent)]">
                    <div className="flex animate-scroll-x">
                        {duplicatedIssues.map((issue, index) => (
                            <div key={`${issue.id}-${index}`} className="flex-shrink-0 w-80 bg-slate-800 rounded-lg p-4 border border-slate-700 mx-4 flex items-center space-x-4 relative overflow-hidden">
                               <div className="absolute -left-2 -top-2 w-4 h-4 bg-cyan-400/50 rounded-full blur-sm"></div>
                               <div className="flex-shrink-0 bg-green-500/10 text-green-400 p-3 rounded-full border border-green-500/20">
                                    <Icon name="shield" className="w-6 h-6"/>
                               </div>
                               <div>
                                    <p className="font-semibold text-white">{issue.type} Fixed</p>
                                    <p className="text-sm text-slate-400">{issue.location.address}</p>
                                    <p className="text-xs text-slate-500 mt-1">{new Date(issue.timestamp).toLocaleString()}</p>
                               </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </AnimatedSection>
    );
};

const Footer: React.FC = () => (
  <footer className="bg-slate-950 border-t border-slate-800">
    <div className="container mx-auto px-6 py-8 text-center text-slate-400">
      <div className="flex justify-center space-x-6 mb-4">
        <a href="#" className="hover:text-white transition">About Us</a>
        <a href="#how-it-works" className="hover:text-white transition">How It Works</a>
        <a href="#ledger" className="hover:text-white transition">Public Ledger</a>
        <a href="#" className="hover:text-white transition">Contact</a>
        <a href="#" className="hover:text-white transition">Privacy Policy</a>
      </div>
      <p>&copy; {new Date().getFullYear()} CivicLedger. All rights reserved.</p>
    </div>
  </footer>
);

const HomePage: React.FC<HomePageProps> = ({ onLoginClick }) => {
  return (
    <>
      <style>{`
        .interactive-grid {
          background-image:
            radial-gradient(circle at var(--mouse-x) var(--mouse-y), rgba(14, 165, 233, 0.15), transparent 20vw),
            linear-gradient(to right, #0f172a, #0f172a),
            radial-gradient(transparent 1px, #0f172a 1px),
            radial-gradient(transparent 1px, #1e293b 1px);
          background-size: 100% 100%, 100% 100%, 40px 40px, 40px 40px;
          background-position: 0 0, 0 0, -20px -20px, 0 0;
          transition: background-position 0.2s ease-out;
        }
        @keyframes scroll-x {
          from { transform: translateX(0); }
          to { transform: translateX(-50%); }
        }
        .animate-scroll-x {
          animation: scroll-x 60s linear infinite;
        }
        section.is-visible {
          opacity: 1;
          transform: translateY(0);
        }
        section.is-visible .animated-children > * {
           opacity: 1;
           transform: translateY(0);
        }
         .animated-children > * {
            opacity: 0;
            transform: translateY(20px);
            transition: all 0.5s ease-out;
         }
      `}</style>
      <div className="min-h-screen bg-slate-950">
        <Header onLoginClick={onLoginClick} />
        <main>
          <HeroSection onLoginClick={onLoginClick} />
          <HowItWorksSection />
          <FeaturesSection />
          <LedgerPreview />
        </main>
        <Footer />
      </div>
    </>
  );
};

export default HomePage;