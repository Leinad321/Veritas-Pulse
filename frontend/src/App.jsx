/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import Dashboard from './Dashboard';
import AboutUs from './AboutUs';
import { 
  LayoutDashboard, 
  Users, 
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
  ArrowRight
} from 'lucide-react';

const API_BASE = "https://veritas-pulse-backend.onrender.com";

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
    return localStorage.getItem('theme') || 'light';
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
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col font-sans transition-colors duration-200 relative">
      
      {/* 1. Global Navigation Bar (Always Visible) */}
      <nav className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 sticky top-0 z-40 shadow-sm">
        <div className="max-w-5xl mx-auto px-6 h-16 flex justify-between items-center">
          
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => setActiveTab('home')}>
            <div className="bg-blue-600 text-white p-2 rounded-lg font-bold text-lg shadow-sm">
              DCP
            </div>
            <div>
              <span className="font-bold text-slate-800 dark:text-white text-base tracking-tight block">Veritas Pulse</span>
              <span className="text-[10px] text-blue-600 dark:text-blue-400 font-semibold tracking-wider uppercase block -mt-1">Team Veritas</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex gap-1 border-r border-slate-200 dark:border-slate-800 pr-3">
              <button
                onClick={() => setActiveTab('home')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  activeTab === 'home'
                    ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 shadow-sm'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
                }`}
              >
                Home
              </button>
              <button
                onClick={() => setActiveTab('about')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  activeTab === 'about'
                    ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 shadow-sm'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
                }`}
              >
                About Team
              </button>
              
              {/* Only show Console Tab if Logged In */}
              {isAuthenticated && (
                <button
                  onClick={() => setActiveTab('dashboard')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    activeTab === 'dashboard'
                      ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 shadow-sm'
                      : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
                  }`}
                >
                  <LayoutDashboard size={13} />
                  Operational Portal
                </button>
              )}
            </div>

            {/* Theme Toggle */}
            <button 
              onClick={toggleTheme}
              className="p-1.5 rounded-lg text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all"
            >
              {theme === 'light' ? <Moon size={16} /> : <Sun size={16} />}
            </button>

            {/* Auth Action Button */}
            {isAuthenticated ? (
              <button
                onClick={handleLogout}
                className="flex items-center gap-1 px-3 py-1.5 text-xs font-semibold text-red-600 hover:bg-red-50 dark:hover:bg-red-950/20 rounded-lg transition-all"
              >
                <LogOut size={14} />
                Sign Out
              </button>
            ) : (
              <button
                onClick={() => setShowLoginModal(true)}
                className="bg-slate-900 dark:bg-blue-600 text-white font-semibold text-xs px-4 py-2 rounded-lg hover:bg-slate-800 dark:hover:bg-blue-500 transition-all flex items-center gap-1"
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
          <div className="max-w-5xl mx-auto px-6 py-12 font-sans">
            {/* Hero Section */}
            <div className="text-center max-w-2xl mx-auto mb-16">
              <span className="bg-blue-100 dark:bg-blue-950/50 text-blue-800 dark:text-blue-300 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                Industrial Intelligence Gateway
              </span>
              <h1 className="text-4xl md:text-5xl font-extrabold mt-4 text-slate-900 dark:text-white tracking-tight">
                Data Assurance & Telemetry Validation
              </h1>
              <p className="text-slate-500 dark:text-slate-400 text-sm mt-4 leading-relaxed">
                Veritas Pulse automatically processes, monitors, and validates real-time plant KPIs to detect industrial anomalies and prevent telemetry drift. Underpinned by custom rule evaluation engines and Gemini-powered mitigation flows.
              </p>
              <div className="mt-8 flex justify-center gap-3">
                {isAuthenticated ? (
                  <button 
                    onClick={() => setActiveTab('dashboard')}
                    className="bg-blue-600 text-white font-semibold text-xs px-5 py-3 rounded-xl hover:bg-blue-500 transition-all flex items-center gap-2 shadow-lg shadow-blue-500/20"
                  >
                    Open Console
                    <ArrowRight size={14} />
                  </button>
                ) : (
                  <button 
                    onClick={() => setShowLoginModal(true)}
                    className="bg-blue-600 text-white font-semibold text-xs px-5 py-3 rounded-xl hover:bg-blue-500 transition-all flex items-center gap-2 shadow-lg shadow-blue-500/20"
                  >
                    Launch Core Portal
                    <ArrowRight size={14} />
                  </button>
                )}
                <button 
                  onClick={() => setActiveTab('about')}
                  className="bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-800 font-semibold text-xs px-5 py-3 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 transition-all"
                >
                  Meet Our Team
                </button>
              </div>
            </div>

            {/* Core Features Pillars */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
                <div className="w-10 h-10 bg-blue-100 dark:bg-blue-950/50 rounded-lg flex items-center justify-center text-blue-600 dark:text-blue-400 mb-4">
                  <FileSpreadsheet size={20} />
                </div>
                <h3 className="font-bold text-slate-900 dark:text-white text-base">Anomaly Lock Gateway</h3>
                <p className="text-slate-500 dark:text-slate-400 text-xs mt-2 leading-relaxed">
                  Bridges legacy operational spreadsheet reporting with automated relational storage, instantly flagging out-of-spec readings.
                </p>
              </div>

              <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
                <div className="w-10 h-10 bg-blue-100 dark:bg-blue-950/50 rounded-lg flex items-center justify-center text-blue-600 dark:text-blue-400 mb-4">
                  <Cpu size={20} />
                </div>
                <h3 className="font-bold text-slate-900 dark:text-white text-base">Active AI Remediation</h3>
                <p className="text-slate-500 dark:text-slate-400 text-xs mt-2 leading-relaxed">
                  Integrates Gemini models to evaluate exception telemetry logs on the fly, auto-generating concrete engineering corrective briefs.
                </p>
              </div>

              <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
                <div className="w-10 h-10 bg-blue-100 dark:bg-blue-950/50 rounded-lg flex items-center justify-center text-blue-600 dark:text-blue-400 mb-4">
                  <TrendingUp size={20} />
                </div>
                <h3 className="font-bold text-slate-900 dark:text-white text-base">Grounded QA Chatbot</h3>
                <p className="text-slate-500 dark:text-slate-400 text-xs mt-2 leading-relaxed">
                  Empowers operations room staff to query the validation logs securely in natural language, ensuring absolute technical clarity.
                </p>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'about' && <AboutUs />}

        {activeTab === 'dashboard' && (
          isAuthenticated ? <Dashboard /> : (
            <div className="text-center py-20">
              <p className="text-red-500 text-sm font-semibold">Security Gate Active: Please authenticate through Client Gateway.</p>
            </div>
          )
        )}
      </main>

      {/* 3. Global Footer */}
      <footer className="bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 py-6 mt-12 text-center text-xs text-slate-400">
        <div className="max-w-5xl mx-auto px-6 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p>© 2026 Team Veritas. Submitted for the DCP University Engineering Challenge.</p>
          <div className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400 font-medium">
            <Award size={14} className="text-amber-500" /> Organized by ULES ARB
          </div>
        </div>
      </footer>

      {/* 4. Login Modal */}
      {showLoginModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/65 backdrop-blur-sm flex justify-center items-center px-4">
          <div className="w-full max-w-md bg-white dark:bg-slate-900 dark:border-slate-800 p-8 rounded-2xl border border-slate-200 shadow-2xl relative">
            
            <button 
              onClick={() => setShowLoginModal(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
            >
              <X size={18} />
            </button>

            <div className="text-center mb-6">
              <div className="inline-flex bg-blue-600 text-white p-2.5 rounded-xl font-bold text-lg shadow-sm mb-2">DCP</div>
              <h2 className="text-xl font-extrabold text-slate-900 dark:text-white">Sign In to Portal</h2>
              <p className="text-xs text-slate-400 mt-0.5">Secure operations dashboard authorization</p>
            </div>

            <form onSubmit={handleLoginSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider mb-1">Username</label>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Enter 'admin'"
                  className="w-full border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white outline-none rounded-xl px-4 py-2 text-sm"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider mb-1">Password</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter 'dcp2026'"
                  className="w-full border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white outline-none rounded-xl px-4 py-2 text-sm"
                  required
                />
              </div>

              {loginError && (
                <p className="text-xs text-red-600 font-semibold bg-red-50 dark:bg-red-950/20 p-2.5 rounded-lg border border-red-100 dark:border-red-900/30">
                  {loginError}
                </p>
              )}

              <button
                type="submit"
                className="w-full bg-slate-900 dark:bg-blue-600 hover:bg-slate-800 dark:hover:bg-blue-500 text-white font-semibold py-3 rounded-xl text-sm"
              >
                Authenticate Portal
              </button>
            </form>

            <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-850 flex items-start gap-2 text-[10px] text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-slate-950/20 -mx-8 -mb-8 p-4 rounded-b-2xl">
              <CheckCircle2 size={14} className="text-blue-500 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold">Access Credentials:</span> Use <code className="bg-slate-200 dark:bg-slate-800 px-1 rounded font-bold text-blue-600">admin</code> and <code className="bg-slate-200 dark:bg-slate-800 px-1 rounded font-bold text-blue-600">dcp2026</code>.
              </div>
            </div>

          </div>
        </div>
      )}

      {/* 5. FLOATING PERSISTENT CHATBOT ACTION BUTTON */}
      <div className="fixed bottom-6 right-6 z-50">
        <button
          onClick={() => setIsChatOpen(!isChatOpen)}
          className="bg-blue-600 hover:bg-blue-500 hover:scale-105 active:scale-95 text-white p-4 rounded-full shadow-2xl transition-all flex items-center justify-center gap-2"
        >
          {isChatOpen ? <X size={22} /> : <MessageSquare size={22} />}
        </button>
      </div>

      {/* 6. SLIDE-OUT PANEL CHATBOT (1/3 Screen Width) */}
      <div 
        className={`fixed top-0 right-0 h-full w-full sm:w-1/3 bg-white dark:bg-slate-900 border-l border-slate-200 dark:border-slate-800 shadow-2xl z-45 transform transition-transform duration-300 ease-in-out flex flex-col ${
          isChatOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* Chat Panel Header */}
        <div className="p-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50 flex justify-between items-center mt-16 sm:mt-0">
          <div>
            <h3 className="font-bold text-slate-800 dark:text-white text-sm">Veritas Pulse Assistant</h3>
            <p className="text-[10px] text-slate-400">Grounded Security Operations Agent</p>
          </div>
          <button 
            onClick={() => setIsChatOpen(false)}
            className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
          >
            <X size={16} />
          </button>
        </div>

        {/* Chat Log Message Window */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {chatMessages.map((msg, idx) => (
            <div 
              key={idx} 
              className={`flex flex-col max-w-[85%] ${msg.sender === 'user' ? 'ml-auto items-end' : 'mr-auto items-start'}`}
            >
              <div 
                className={`p-3 rounded-xl text-xs leading-relaxed ${
                  msg.sender === 'user' 
                    ? 'bg-blue-600 text-white rounded-tr-none' 
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 rounded-tl-none border border-slate-200/50 dark:border-slate-700/50'
                }`}
              >
                {msg.text}
              </div>
            </div>
          ))}
          {isSendingChat && (
            <div className="flex items-center gap-1.5 text-slate-400 text-xs pl-1">
              <Loader2 size={12} className="animate-spin" />
              <span>Analyst is querying local database...</span>
            </div>
          )}
        </div>

        {/* Chat Input form */}
        <form onSubmit={handleSendChatMessage} className="p-3 border-t border-slate-200 dark:border-slate-800 flex gap-2">
          <input
            type="text"
            value={chatInput}
            onChange={(e) => setChatInput(e.target.value)}
            placeholder="Ask database..."
            className="flex-1 border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-850 text-slate-900 dark:text-white focus:border-blue-500 outline-none rounded-lg px-3 py-2 text-xs transition-all"
          />
          <button
            type="submit"
            disabled={isSendingChat}
            className="bg-slate-900 dark:bg-blue-600 hover:bg-slate-800 dark:hover:bg-blue-500 text-white p-2 rounded-lg transition-all"
          >
            <Send size={13} />
          </button>
        </form>
      </div>

    </div>
  );
}

export default App;