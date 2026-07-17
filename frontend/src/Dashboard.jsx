/* eslint-disable no-unused-vars */
import { useState, useEffect } from "react";
import { 
  AlertTriangle, 
  CheckCircle, 
  Send, 
  Loader2, 
  Lightbulb, 
  RefreshCw, 
  Database,
  Layers,
  MessageSquare
} from "lucide-react";
import SlidingChatbot from "./SlidingChatbot"; // Import our brand-new sliding drawer

const API_BASE = "https://veritas-pulse-backend.onrender.com";

export default function Dashboard() {
  // --- Original Validation Dashboard States ---
  const [summary, setSummary] = useState(null);
  const [records, setRecords] = useState([]);
  const [filter, setFilter] = useState("all");
  const [insights, setInsights] = useState("");
  const [loadingInsights, setLoadingInsights] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  // --- Unified Chat & Drawer Control States ---
  const [question, setQuestion] = useState(""); // Holds the currently typed question (shared input)
  const [asking, setAsking] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false); // Controls sliding visibility
  const [chatHistory, setChatHistory] = useState([
    { sender: "bot", text: "Hi! Ask me any analytical questions about your KPI data." }
  ]);

  const loadData = async () => {
    setRefreshing(true);
    try {
      const summaryRes = await fetch(`${API_BASE}/api/summary`);
      if (summaryRes.ok) {
        setSummary(await summaryRes.json());
      }
      const statusParam = filter === "all" ? "" : `?status=${filter}`;
      const recordsRes = await fetch(`${API_BASE}/api/records${statusParam}`);
      if (recordsRes.ok) {
        setRecords(await recordsRes.json());
      }
    } catch (error) {
      console.error("Backend connection error:", error);
    } finally {
      setRefreshing(false);
    }
  };

  const loadInsights = async () => {
    setLoadingInsights(true);
    setInsights("");
    try {
      const res = await fetch(`${API_BASE}/api/insights`);
      const data = await res.json();
      if (typeof data.insights === "string") {
        setInsights(data.insights);
      } else if (data.patterns) {
        const patternText = data.patterns.map(p => 
          `Pattern: ${p.error_type} (Count: ${p.occurrence_count})\nRoot-Cause: ${p.suggested_root_cause}\nNext Step: ${p.next_step}`
        ).join("\n\n");
        setInsights(patternText);
      } else {
        setInsights(JSON.stringify(data, null, 2));
      }
    } catch (e) {
      setInsights("Could not reach the insights service. Ensure your Gemini API Key is configured.");
    } finally {
      setLoadingInsights(false);
    }
  };

  useEffect(() => {
    loadData();
    const interval = setInterval(loadData, 15000);
    return () => clearInterval(interval);
  }, [filter]);

  // Unified Request Sender (updates shared history on response)
  const handleAsk = async () => {
    if (!question.trim()) return;
    
    const userMessage = question.trim();
    setQuestion(""); // Instantly clear text input
    setAsking(true);

    // Update shared chat log immediately
    const updatedHistory = [...chatHistory, { sender: "user", text: userMessage }];
    setChatHistory(updatedHistory);

    try {
      const res = await fetch(`${API_BASE}/api/ask`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: userMessage }),
      });
      
      if (res.ok) {
        const data = await res.json();
        setChatHistory([...updatedHistory, { sender: "bot", text: data.answer }]);
      } else {
        setChatHistory([...updatedHistory, { sender: "bot", text: "The AI gateway returned an error. Please try again." }]);
      }
    } catch (e) {
      setChatHistory([...updatedHistory, { sender: "bot", text: "Could not reach the AI query service. Ensure backend is running." }]);
    } finally {
      setAsking(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 p-6 font-sans relative">
      <div className="max-w-5xl mx-auto">
        
        {/* Top Header */}
        <header className="flex justify-between items-start mb-6">
          <div>
            <div className="flex items-center gap-2">
              <span className="bg-blue-600 text-white text-xs font-bold px-2.5 py-0.5 rounded-full">TRACK 4</span>
              <h1 className="text-2xl font-bold text-slate-900 m-0">DCP Pulse</h1>
            </div>
            <p className="text-slate-500 text-sm mt-1">Digital KPI Automation & Exception Quality Gateway</p>
          </div>
          
          <div className="flex gap-2">
            {/* Open Drawer Button */}
            <button
              onClick={() => setIsChatOpen(true)}
              className="flex items-center gap-1.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 px-3.5 py-1.5 rounded-lg shadow-sm transition-all"
            >
              <MessageSquare size={13} />
              Open Assistant Drawer
            </button>

            <button 
              onClick={loadData}
              disabled={refreshing}
              className="flex items-center gap-1.5 text-xs font-medium text-slate-600 bg-white border border-slate-200 hover:bg-slate-50 px-3 py-1.5 rounded-lg shadow-sm transition-all"
            >
              <RefreshCw size={13} className={refreshing ? "animate-spin text-blue-600" : ""} />
              Sync Pipeline
            </button>
          </div>
        </header>

        {/* Metrics Overview */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="bg-white rounded-xl p-5 border border-slate-200/80 shadow-sm">
            <div className="text-slate-400 text-xs font-semibold uppercase tracking-wider">Total Ingested Records</div>
            <div className="text-3xl font-bold text-slate-900 mt-1">
              {summary ? summary.total_records : <Loader2 size={24} className="animate-spin text-slate-400" />}
            </div>
          </div>
          <div className="bg-white rounded-xl p-5 border border-red-100 shadow-sm">
            <div className="text-red-500 text-xs font-semibold flex items-center gap-1 uppercase tracking-wider">
              <AlertTriangle size={14} /> Flagged Exceptions
            </div>
            <div className="text-3xl font-bold text-red-600 mt-1">
              {summary ? summary.flagged_records : <Loader2 size={24} className="animate-spin text-red-400" />}
            </div>
          </div>
          <div className="bg-white rounded-xl p-5 border border-green-100 shadow-sm">
            <div className="text-green-600 text-xs font-semibold flex items-center gap-1 uppercase tracking-wider">
              <CheckCircle size={14} /> Passed Validation
            </div>
            <div className="text-3xl font-bold text-green-600 mt-1">
              {summary ? summary.clean_records : <Loader2 size={24} className="animate-spin text-green-400" />}
            </div>
          </div>
        </div>

        {/* Log Filters */}
        <div className="flex gap-2 mb-4">
          {["all", "flagged", "clean"].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all ${
                filter === f 
                  ? "bg-slate-900 text-white shadow" 
                  : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-50"
              }`}
            >
              {f.charAt(0).toUpperCase() + f.slice(1)} Records
            </button>
          ))}
        </div>

        {/* Data Log Table */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden mb-8">
          <div className="p-4 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
            <h3 className="text-sm font-semibold text-slate-800 flex items-center gap-1.5">
              <Database size={16} className="text-slate-500" /> Validation Log Stream
            </h3>
            <span className="text-xs text-slate-400">Showing {records.length} records</span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-slate-100/80 text-slate-600 font-medium">
                <tr className="border-b border-slate-200">
                  <th className="p-3">Plant</th>
                  <th className="p-3">KPI</th>
                  <th className="p-3">Date</th>
                  <th className="p-3">Value</th>
                  <th className="p-3">Status</th>
                  <th className="p-3">Rule Exception Cause</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {records.length > 0 ? (
                  records.map((r) => (
                    <tr key={r.id || `${r.plant}-${r.date}`} className="hover:bg-slate-50/50 transition-colors">
                      <td className="p-3 font-semibold text-slate-800">{r.plant}</td>
                      <td className="p-3 text-slate-600">{r.kpi_name}</td>
                      <td className="p-3 text-slate-500">{r.date}</td>
                      <td className="p-3 font-mono">{r.value ?? "missing"}</td>
                      <td className="p-3">
                        <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                          r.status === "flagged" 
                            ? "bg-red-100 text-red-700" 
                            : "bg-green-100 text-green-700"
                        }`}>
                          {r.status === "flagged" ? <AlertTriangle size={10} /> : <CheckCircle size={10} />}
                          {r.status}
                        </span>
                      </td>
                      <td className="p-3 text-xs text-red-600 font-medium bg-red-50/10">{r.flag_reason || "—"}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="p-8 text-center text-slate-400">
                      No records found matching current criteria.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* AI Processing Panel Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Predictive Insights Panel */}
          <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-3">
                <h2 className="font-bold text-slate-900 flex items-center gap-2">
                  <Lightbulb size={18} className="text-amber-500 animate-pulse" /> Predictive Insights
                </h2>
                <button
                  onClick={loadInsights}
                  disabled={loadingInsights}
                  className="text-xs bg-amber-50 text-amber-700 hover:bg-amber-100 border border-amber-200 px-3 py-1.5 rounded-lg flex items-center gap-1.5 font-semibold transition-all"
                >
                  {loadingInsights ? <Loader2 size={13} className="animate-spin" /> : null}
                  Analyze Patterns
                </button>
              </div>
              <p className="text-slate-500 text-xs mb-4 leading-relaxed">
                Aggregates recurring data issues from your validation engine. It uses Gemini to draft concrete plant corrective workflows.
              </p>
              {insights && (
                <div className="bg-amber-50/50 border border-amber-100 rounded-lg p-4 text-sm text-slate-700 whitespace-pre-wrap font-sans leading-relaxed shadow-inner">
                  {insights}
                </div>
              )}
            </div>
          </div>

          {/* Connected On-Page Q&A Assistant */}
          <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm flex flex-col justify-between">
            <div>
              <h2 className="font-bold text-slate-900 flex items-center gap-2 mb-3">
                <Layers size={18} className="text-blue-500" /> Ask the KPI Assistant
              </h2>
              <p className="text-slate-500 text-xs mb-4 leading-relaxed">
                Ask structured questions about the validated dataset directly. The AI is securely grounded strictly to local `kpi.db` values.
              </p>
              <div className="flex gap-2 mb-4">
                <input
                  type="text"
                  value={question}
                  onChange={(e) => setQuestion(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && !asking && handleAsk()}
                  placeholder="e.g. Which plant has the highest number of exceptions?"
                  className="flex-1 border border-slate-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none rounded-lg px-3 py-2 text-sm transition-all"
                />
                <button
                  onClick={handleAsk}
                  disabled={asking || !question.trim()}
                  className="bg-slate-900 hover:bg-slate-800 active:scale-95 text-white px-4 py-2 rounded-lg flex items-center gap-1 text-sm font-semibold shadow transition-all"
                >
                  {asking ? <Loader2 size={15} className="animate-spin" /> : <Send size={14} />}
                  Ask
                </button>
              </div>
              
              {/* Display the last message in history */}
              {chatHistory.length > 1 && (
                <div className="bg-slate-50 border border-slate-200/60 rounded-lg p-4 text-sm text-slate-700 whitespace-pre-wrap font-sans leading-relaxed">
                  <span className="text-blue-600 font-bold block text-xs mb-1 uppercase">Latest Response:</span>
                  {chatHistory[chatHistory.length - 1].text}
                </div>
              )}
            </div>
          </div>

        </div>

      </div>

      {/* RENDER THE SLIDING PANEL AND PASS SHARED PROPS */}
      <SlidingChatbot 
        messages={chatHistory} 
        isOpen={isChatOpen} 
        onClose={() => setIsChatOpen(false)} 
        question={question}
        setQuestion={setQuestion}
        onSend={handleAsk}
        asking={asking}
      />

    </div>
  );
}