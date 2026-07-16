/* eslint-disable react/prop-types */
import { MessageSquare, X, Send, Loader2 } from "lucide-react";

export default function SlidingChatbot({ 
  messages, 
  isOpen, 
  onClose, 
  question, 
  setQuestion, 
  onSend, 
  asking 
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-slate-900/40 backdrop-blur-sm animate-fade-in">
      {/* Backdrop close area */}
      <div className="flex-1" onClick={onClose} />

      {/* Chat Drawer */}
      <div className="w-full max-w-md bg-white h-full shadow-2xl flex flex-col animate-slide-in">
        
        {/* Drawer Header */}
        <header className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-900 text-white">
          <div className="flex items-center gap-2">
            <MessageSquare size={18} className="text-blue-400" />
            <h3 className="font-bold text-sm">KPI Companion</h3>
          </div>
          <button 
            onClick={onClose} 
            className="hover:bg-slate-800 p-1 rounded-full transition-colors"
          >
            <X size={18} />
          </button>
        </header>

        {/* Conversation Stream */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50/50">
          {messages.map((msg, idx) => (
            <div 
              key={idx} 
              className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
            >
              <div 
                className={`max-w-[80%] rounded-2xl p-3 text-sm leading-relaxed shadow-sm ${
                  msg.sender === "user" 
                    ? "bg-blue-600 text-white rounded-br-none" 
                    : "bg-white border border-slate-200 text-slate-800 rounded-bl-none"
                }`}
              >
                {msg.text}
              </div>
            </div>
          ))}
          {asking && (
            <div className="flex justify-start">
              <div className="bg-white border border-slate-200 rounded-2xl rounded-bl-none p-3 shadow-sm flex items-center gap-2 text-slate-400 text-xs">
                <Loader2 size={12} className="animate-spin text-blue-500" />
                Processing data...
              </div>
            </div>
          )}
        </div>

        {/* Drawer Input Bar */}
        <footer className="p-4 border-t border-slate-100 bg-white">
          <div className="flex gap-2">
            <input
              type="text"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && !asking && onSend()}
              placeholder="Ask me to crunch numbers..."
              className="flex-1 border border-slate-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none rounded-xl px-3.5 py-2 text-sm transition-all"
            />
            <button
              onClick={onSend}
              disabled={asking || !question.trim()}
              className="bg-blue-600 hover:bg-blue-700 active:scale-95 disabled:bg-slate-200 text-white p-2.5 rounded-xl flex items-center justify-center shadow transition-all"
            >
              <Send size={15} />
            </button>
          </div>
        </footer>

      </div>
    </div>
  );
}