/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import Dashboard from './Dashboard';
import AboutUs from './AboutUs';
import {
  LayoutDashboard,
  Award,
  Lock,
  LogOut,
  CheckCircle2,
  Sun,
  Moon,
  MessageSquare,
  X,
  Send,
  Loader2,
  TrendingUp,
  FileSpreadsheet,
  Cpu,
  ArrowRight,
  Radio
} from 'lucide-react';

const API_BASE = "https://veritas-pulse-backend.onrender.com";

// The pulse line is the signature element of this design: an oscilloscope-style
// trace that visually is the "Pulse" in Veritas Pulse. Reused in the hero and
// as a section divider so it reads as a system, not a one-off decoration.
const PulseLine = ({ className = "", strokeWidth = 2 }) => (
  <svg viewBox="0 0 800 60" preserveAspectRatio="none" className={className} aria-hidden="true">
    <path
      d="M0,30 L160,30 L185,30 L200,8 L215,52 L230,30 L260,30 L340,30 L360,18 L375,42 L390,30 L800,30"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      className="pulse-trace"
    />
  </svg>
);

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [activeTab, setActiveTab] = useState('home'); // Defaults to public Home page
  const [isChatOpen, setIsChatOpen] = useState(false);

  // Chatbot Assistant States
  const [chatInput, setChatInput] = useState('');
  const [chatMessages, setChatMessages] = useState([
    { sender: 'ai', text: 'Hello! I am your Veritas Pulse Assistant. Ask me anything about our system or current database records.' }
  ]);
  const [isSendingChat, setIsSendingChat] = useState(false);

  // Theme State
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('theme') || 'dark';
  });

  useEffect(() => {
    const root = window.document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => (prev === 'light' ? 'dark' : 'light'));
  };

  const handleLoginSubmit = (e) => {
    e.preventDefault();
    if (username.toLowerCase() === 'admin' && password === 'dcp2026') {
      setIsAuthenticated(true);
      setShowLoginModal(false);
      setLoginError('');
      setActiveTab('dashboard'); // Redirect directly to the console
    } else {
      setLoginError('Access denied. Use demo login: admin / dcp2026');
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setActiveTab('home');
    setUsername('');
    setPassword('');
  };

  // Helper function to strip Markdown ** bold tags out of AI text
  const cleanMarkdown = (text) => {
    return text.replace(/\*\*/g, '').replace(/\*/g, '');
  };

  // Send message to the backend grounding endpoint
  const handleSendChatMessage = async (e) => {
    e.preventDefault();
    if (!chatInput.trim()) return;

    const userQuery = chatInput;
    setChatMessages(prev => [...prev, { sender: 'user', text: userQuery }]);
    setChatInput('');
    setIsSendingChat(true);

    try {
      const res = await fetch(`${API_BASE}/api/ask`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: userQuery }),
      });
      if (res.ok) {
        const data = await res.json();
        setChatMessages(prev => [...prev, { sender: 'ai', text: cleanMarkdown(data.answer) }]);
      } else {
        setChatMessages(prev => [...prev, { sender: 'ai', text: 'The server encountered an error. Please try again.' }]);
      }
    } catch (err) {
      setChatMessages(prev => [...prev, { sender: 'ai', text: 'Unable to connect to backend server. Make sure app.py is running.' }]);
    } finally {
      setIsSendingChat(false);
    }
  };

  return (
    <div className="vp-root min-h-screen flex flex-col relative">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;600;700&family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500;600&display=swap');

        :root {
          --bg-base: #F3F5F7;
          --bg-panel: #FFFFFF;
          --bg-panel-raised: #F7F9FA;
          --border-hair: rgba(15, 23, 32, 0.10);
          --text-primary: #10151B;
          --text-muted: #5B6472;
          --accent-kiln: #E85D1F;
          --accent-cyan: #0E9C89;
          --grid-line: rgba(15, 23, 32, 0.045);
        }
        html.dark {
          --bg-base: #12161B;
          --bg-panel: #1B2129;
          --bg-panel-raised: #212933;
          --border-hair: rgba(255, 255, 255, 0.09);
          --text-primary: #EDEFF2;
          --text-muted: #8891A0;
          --accent-kiln: #FF7A33;
          --accent-cyan: #38DFC9;
          --grid-line: rgba(255, 255, 255, 0.045);
        }

        .vp-root {
          background-color: var(--bg-base);
          color: var(--text-primary);
          font-family: 'Inter', sans-serif;
          background-image:
            linear-gradient(var(--grid-line) 1px, transparent 1px),
            linear-gradient(90deg, var(--grid-line) 1px, transparent 1px);
          background-size: 42px 42px;
        }
        .vp-display { font-family: 'Space Grotesk', sans-serif; letter-spacing: -0.01em; }
        .vp-mono { font-family: 'JetBrains Mono', monospace; letter-spacing: 0.02em; }

        .vp-panel {
          background-color: var(--bg-panel);
          border: 1px solid var(--border-hair);
        }
        .vp-panel-raised { background-color: var(--bg-panel-raised); }

        .pulse-trace {
          color: var(--accent-kiln);
          stroke-dasharray: 900;
          stroke-dashoffset: 900;
          animation: vp-draw 2.4s ease-out forwards, vp-glow 3s ease-in-out 2.4s infinite;
        }
        @keyframes vp-draw { to { stroke-dashoffset: 0; } }
        @keyframes vp-glow {
          0%, 100% { opacity: 0.75; }
          50% { opacity: 1; }
        }
        @media (prefers-reduced-motion: reduce) {
          .pulse-trace { animation: none; stroke-dashoffset: 0; }
        }

        .vp-corner-panel {
          position: relative;
          background-color: var(--bg-panel);
          border: 1px solid var(--border-hair);
        }
        .vp-corner-panel::before, .vp-corner-panel::after,
        .vp-corner-panel .vp-corner-br, .vp-corner-panel .vp-corner-bl {
          content: '';
          position: absolute;
          width: 14px;
          height: 14px;
          border-color: var(--accent-kiln);
          opacity: 0.7;
        }
        .vp-corner-panel::before { top: -1px; left: -1px; border-top: 2px solid; border-left: 2px solid; }
        .vp-corner-panel::after { top: -1px; right: -1px; border-top: 2px solid; border-right: 2px solid; }
        .vp-corner-panel .vp-corner-bl { bottom: -1px; left: -1px; border-bottom: 2px solid; border-left: 2px solid; }
        .vp-corner-panel .vp-corner-br { bottom: -1px; right: -1px; border-bottom: 2px solid; border-right: 2px solid; }

        .vp-focus:focus-visible {
          outline: 2px solid var(--accent-cyan);
          outline-offset: 2px;
        }

        .vp-status-dot {
          box-shadow: 0 0 0 3px color-mix(in srgb, var(--accent-cyan) 20%, transparent);
        }
      `}</style>

      {/* 1. Global Navigation Bar */}
      <nav className="vp-panel sticky top-0 z-40" style={{ borderLeft: 'none', borderRight: 'none', borderTop: 'none' }}>
        <div className="max-w-5xl mx-auto px-6 h-16 flex justify-between items-center">

          <div className="flex items-center gap-3 cursor-pointer vp-focus" onClick={() => setActiveTab('home')} tabIndex={0}>
            <div
              className="w-9 h-9 rounded-md flex items-center justify-center vp-mono font-bold text-xs"
              style={{ backgroundColor: 'var(--accent-kiln)', color: '#12161B' }}
            >
              DCP
            </div>
            <div>
              <span className="vp-display font-bold text-base block leading-tight">Veritas Pulse</span>
              <span
                className="vp-mono text-[10px] uppercase tracking-wider block"
                style={{ color: 'var(--accent-cyan)' }}
              >
                Team Veritas &middot; Track 4
              </span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex gap-1 pr-4" style={{ borderRight: '1px solid var(--border-hair)' }}>
              {[
                { id: 'home', label: 'Home' },
                { id: 'about', label: 'About Team' },
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className="vp-focus px-3 py-1.5 rounded-md text-xs font-semibold vp-display transition-colors"
                  style={{
                    color: activeTab === tab.id ? 'var(--accent-kiln)' : 'var(--text-muted)',
                    backgroundColor: activeTab === tab.id ? 'var(--bg-panel-raised)' : 'transparent'
                  }}
                >
                  {tab.label}
                </button>
              ))}

              {isAuthenticated && (
                <button
                  onClick={() => setActiveTab('dashboard')}
                  className="vp-focus flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold vp-display transition-colors"
                  style={{
                    color: activeTab === 'dashboard' ? 'var(--accent-kiln)' : 'var(--text-muted)',
                    backgroundColor: activeTab === 'dashboard' ? 'var(--bg-panel-raised)' : 'transparent'
                  }}
                >
                  <LayoutDashboard size={13} />
                  Operational Portal
                </button>
              )}
            </div>

            <button
              onClick={toggleTheme}
              className="vp-focus p-1.5 rounded-md transition-colors"
              style={{ color: 'var(--text-muted)' }}
              aria-label="Toggle theme"
            >
              {theme === 'light' ? <Moon size={16} /> : <Sun size={16} />}
            </button>

            {isAuthenticated ? (
              <button
                onClick={handleLogout}
                className="vp-focus flex items-center gap-1 px-3 py-1.5 text-xs font-semibold rounded-md transition-colors"
                style={{ color: '#E5484D' }}
              >
                <LogOut size={14} />
                Sign Out
              </button>
            ) : (
              <button
                onClick={() => setShowLoginModal(true)}
                className="vp-focus font-semibold text-xs px-4 py-2 rounded-md flex items-center gap-1.5 transition-transform hover:scale-[1.02]"
                style={{ backgroundColor: 'var(--accent-kiln)', color: '#12161B' }}
              >
                <Lock size={12} />
                Client Gateway
              </button>
            )}
          </div>
        </div>
      </nav>

      {/* 2. Main Body Routes */}
      <main className="flex-1">
        {activeTab === 'home' && (
          <div className="max-w-5xl mx-auto px-6 py-16">
            {/* Hero */}
            <div className="max-w-2xl mb-6">
              <span
                className="vp-mono inline-block text-[10px] font-semibold px-2.5 py-1 rounded uppercase tracking-wider"
                style={{ backgroundColor: 'var(--bg-panel-raised)', color: 'var(--accent-cyan)', border: '1px solid var(--border-hair)' }}
              >
                <Radio size={10} className="inline mr-1.5 -mt-0.5" />
                Live telemetry validation
              </span>
              <h1 className="vp-display text-4xl md:text-[3.25rem] font-bold mt-5 leading-[1.05]">
                Every KPI, verified<br />before it reaches a report.
              </h1>
              <p className="text-sm md:text-base mt-5 leading-relaxed" style={{ color: 'var(--text-muted)' }}>
                Veritas Pulse sits between plant-floor Excel reporting and management decisions, catching bad readings, tracing recurring faults, and answering questions on the validated record, grounded, not guessed.
              </p>
            </div>

            {/* Signature pulse line */}
            <div className="mb-10 -mx-6 md:mx-0">
              <PulseLine className="w-full h-10" strokeWidth={2.5} />
            </div>

            <div className="flex flex-wrap gap-3 mb-16">
              {isAuthenticated ? (
                <button
                  onClick={() => setActiveTab('dashboard')}
                  className="vp-focus font-semibold text-xs px-5 py-3 rounded-md flex items-center gap-2 transition-transform hover:scale-[1.02]"
                  style={{ backgroundColor: 'var(--accent-kiln)', color: '#12161B' }}
                >
                  Open Console
                  <ArrowRight size={14} />
                </button>
              ) : (
                <button
                  onClick={() => setShowLoginModal(true)}
                  className="vp-focus font-semibold text-xs px-5 py-3 rounded-md flex items-center gap-2 transition-transform hover:scale-[1.02]"
                  style={{ backgroundColor: 'var(--accent-kiln)', color: '#12161B' }}
                >
                  Launch Core Portal
                  <ArrowRight size={14} />
                </button>
              )}
              <button
                onClick={() => setActiveTab('about')}
                className="vp-focus vp-panel font-semibold text-xs px-5 py-3 rounded-md transition-colors"
              >
                Meet Our Team
              </button>
            </div>

            {/* Pipeline stages, real sequence: intake -> reasoning -> access */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {[
                {
                  stage: 'STAGE — INTAKE',
                  icon: FileSpreadsheet,
                  title: 'Anomaly Lock Gateway',
                  copy: 'Bridges legacy operational spreadsheet reporting with automated relational storage, instantly flagging out-of-spec readings.'
                },
                {
                  stage: 'STAGE — REASONING',
                  icon: Cpu,
                  title: 'Active AI Remediation',
                  copy: 'Integrates Gemini models to evaluate exception telemetry logs on the fly, auto-generating concrete engineering corrective briefs.'
                },
                {
                  stage: 'STAGE — ACCESS',
                  icon: TrendingUp,
                  title: 'Grounded QA Chatbot',
                  copy: 'Empowers operations room staff to query the validation logs securely in natural language, ensuring absolute technical clarity.'
                }
              ].map((card, idx) => (
                <div key={idx} className="vp-corner-panel p-6 rounded-md">
                  <div className="vp-corner-br"></div>
                  <div className="vp-corner-bl"></div>
                  <span
                    className="vp-mono text-[9px] font-semibold tracking-widest"
                    style={{ color: 'var(--accent-kiln)' }}
                  >
                    {card.stage}
                  </span>
                  <div
                    className="w-9 h-9 rounded flex items-center justify-center mt-3 mb-4"
                    style={{ backgroundColor: 'var(--bg-panel-raised)', color: 'var(--accent-cyan)' }}
                  >
                    <card.icon size={18} />
                  </div>
                  <h3 className="vp-display font-bold text-sm">{card.title}</h3>
                  <p className="text-xs mt-2 leading-relaxed" style={{ color: 'var(--text-muted)' }}>
                    {card.copy}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'about' && <AboutUs />}

        {activeTab === 'dashboard' && (
          isAuthenticated ? <Dashboard /> : (
            <div className="text-center py-20">
              <p className="text-sm font-semibold" style={{ color: '#E5484D' }}>
                Security Gate Active: Please authenticate through Client Gateway.
              </p>
            </div>
          )
        )}
      </main>

      {/* 3. Footer */}
      <footer className="vp-panel py-6 mt-12" style={{ borderLeft: 'none', borderRight: 'none', borderBottom: 'none' }}>
        <div className="max-w-5xl mx-auto px-6 flex flex-col sm:flex-row justify-between items-center gap-3 text-xs" style={{ color: 'var(--text-muted)' }}>
          <p>&copy; 2026 Team Veritas. Submitted for the DCP University Engineering Challenge.</p>
          <div className="flex items-center gap-1.5 font-medium">
            <Award size={13} style={{ color: 'var(--accent-kiln)' }} /> Organized by ULES ARB
          </div>
        </div>
      </footer>

      {/* 4. Login Modal */}
      {showLoginModal && (
        <div className="fixed inset-0 z-50 flex justify-center items-center px-4" style={{ backgroundColor: 'rgba(10,13,16,0.7)', backdropFilter: 'blur(4px)' }}>
          <div className="vp-panel w-full max-w-md p-8 rounded-xl relative">
            <button
              onClick={() => setShowLoginModal(false)}
              className="vp-focus absolute top-4 right-4 transition-colors"
              style={{ color: 'var(--text-muted)' }}
              aria-label="Close"
            >
              <X size={18} />
            </button>

            <div className="mb-6">
              <div
                className="inline-flex vp-mono font-bold text-xs px-2.5 py-1.5 rounded mb-3"
                style={{ backgroundColor: 'var(--accent-kiln)', color: '#12161B' }}
              >
                DCP
              </div>
              <h2 className="vp-display text-xl font-bold">Sign In to Portal</h2>
              <p className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>
                Secure operations dashboard authorization
              </p>
            </div>

            <form onSubmit={handleLoginSubmit} className="space-y-4">
              <div>
                <label className="vp-mono block text-[10px] font-semibold uppercase tracking-wider mb-1.5" style={{ color: 'var(--text-muted)' }}>
                  Username
                </label>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Enter 'admin'"
                  className="vp-focus w-full rounded-lg px-4 py-2.5 text-sm"
                  style={{ backgroundColor: 'var(--bg-panel-raised)', border: '1px solid var(--border-hair)', color: 'var(--text-primary)' }}
                  required
                />
              </div>

              <div>
                <label className="vp-mono block text-[10px] font-semibold uppercase tracking-wider mb-1.5" style={{ color: 'var(--text-muted)' }}>
                  Password
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter 'dcp2026'"
                  className="vp-focus w-full rounded-lg px-4 py-2.5 text-sm"
                  style={{ backgroundColor: 'var(--bg-panel-raised)', border: '1px solid var(--border-hair)', color: 'var(--text-primary)' }}
                  required
                />
              </div>

              {loginError && (
                <p className="text-xs font-semibold p-2.5 rounded-lg" style={{ color: '#E5484D', backgroundColor: 'rgba(229,72,77,0.1)', border: '1px solid rgba(229,72,77,0.25)' }}>
                  {loginError}
                </p>
              )}

              <button
                type="submit"
                className="vp-focus w-full font-semibold py-3 rounded-lg text-sm transition-transform hover:scale-[1.01]"
                style={{ backgroundColor: 'var(--accent-kiln)', color: '#12161B' }}
              >
                Authenticate Portal
              </button>
            </form>

            <div
              className="mt-6 pt-4 flex items-start gap-2 text-[10px] -mx-8 -mb-8 p-4 rounded-b-xl"
              style={{ borderTop: '1px solid var(--border-hair)', backgroundColor: 'var(--bg-panel-raised)', color: 'var(--text-muted)' }}
            >
              <CheckCircle2 size={14} style={{ color: 'var(--accent-cyan)' }} className="shrink-0 mt-0.5" />
              <div>
                <span className="font-bold">Access Credentials:</span> Use{' '}
                <code className="vp-mono px-1 rounded font-bold" style={{ backgroundColor: 'var(--bg-panel)', color: 'var(--accent-kiln)' }}>admin</code>{' '}
                and{' '}
                <code className="vp-mono px-1 rounded font-bold" style={{ backgroundColor: 'var(--bg-panel)', color: 'var(--accent-kiln)' }}>dcp2026</code>.
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 5. Floating Chat Button */}
      <div className="fixed bottom-6 right-6 z-50">
        <button
          onClick={() => setIsChatOpen(!isChatOpen)}
          className="vp-focus p-4 rounded-full shadow-2xl transition-transform hover:scale-105 active:scale-95 flex items-center justify-center"
          style={{ backgroundColor: 'var(--accent-kiln)', color: '#12161B' }}
          aria-label="Toggle assistant"
        >
          {isChatOpen ? <X size={22} /> : <MessageSquare size={22} />}
        </button>
      </div>

      {/* 6. Slide-out Chat Panel */}
      <div
        className={`vp-panel fixed top-0 right-0 h-full w-full sm:w-1/3 z-45 transform transition-transform duration-300 ease-in-out flex flex-col ${
          isChatOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
        style={{ borderTop: 'none', borderRight: 'none', borderBottom: 'none' }}
      >
        <div className="p-4 flex justify-between items-center mt-16 sm:mt-0" style={{ borderBottom: '1px solid var(--border-hair)', backgroundColor: 'var(--bg-panel-raised)' }}>
          <div>
            <h3 className="vp-display font-bold text-sm">Veritas Pulse Assistant</h3>
            <p className="vp-mono text-[9px] uppercase tracking-wider" style={{ color: 'var(--accent-cyan)' }}>
              Grounded security operations agent
            </p>
          </div>
          <button onClick={() => setIsChatOpen(false)} className="vp-focus transition-colors" style={{ color: 'var(--text-muted)' }} aria-label="Close assistant">
            <X size={16} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {chatMessages.map((msg, idx) => (
            <div key={idx} className={`flex flex-col max-w-[85%] ${msg.sender === 'user' ? 'ml-auto items-end' : 'mr-auto items-start'}`}>
              <div
                className="p-3 rounded-lg text-xs leading-relaxed"
                style={
                  msg.sender === 'user'
                    ? { backgroundColor: 'var(--accent-kiln)', color: '#12161B', borderTopRightRadius: 0 }
                    : { backgroundColor: 'var(--bg-panel-raised)', color: 'var(--text-primary)', border: '1px solid var(--border-hair)', borderTopLeftRadius: 0 }
                }
              >
                {msg.text}
              </div>
            </div>
          ))}
          {isSendingChat && (
            <div className="flex items-center gap-1.5 text-xs pl-1" style={{ color: 'var(--text-muted)' }}>
              <Loader2 size={12} className="animate-spin" />
              <span className="vp-mono">Analyst is querying local database...</span>
            </div>
          )}
        </div>

        <form onSubmit={handleSendChatMessage} className="p-3 flex gap-2" style={{ borderTop: '1px solid var(--border-hair)' }}>
          <input
            type="text"
            value={chatInput}
            onChange={(e) => setChatInput(e.target.value)}
            placeholder="Ask database..."
            className="vp-focus flex-1 rounded-lg px-3 py-2 text-xs transition-colors"
            style={{ backgroundColor: 'var(--bg-panel-raised)', border: '1px solid var(--border-hair)', color: 'var(--text-primary)' }}
          />
          <button
            type="submit"
            disabled={isSendingChat}
            className="vp-focus p-2 rounded-lg transition-transform hover:scale-105"
            style={{ backgroundColor: 'var(--accent-kiln)', color: '#12161B' }}
            aria-label="Send message"
          >
            <Send size={13} />
          </button>
        </form>
      </div>
    </div>
  );
}

export default App;