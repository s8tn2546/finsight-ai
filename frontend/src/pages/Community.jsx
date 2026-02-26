import React, { useState, useEffect, useRef } from 'react';
import { io } from 'socket.io-client';
import { Send, Users, MessageSquare, Shield, Wallet, User } from 'lucide-react';
import Card from '../components/common/Card';
import { useAuth } from '../routes/AuthContext';

const SOCKET_URL = 'http://localhost:8000';

export default function Community() {
  const { user } = useAuth();
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  const [socket, setSocket] = useState(null);
  const [onlineCount, setOnlineCount] = useState(0);
  const scrollRef = useRef(null);

  useEffect(() => {
    const newSocket = io(SOCKET_URL);
    setSocket(newSocket);

    newSocket.on('initial_messages', (initialMsgs) => {
      setMessages(initialMsgs);
    });

    newSocket.on('new_message', (msg) => {
      setMessages((prev) => [...prev, msg]);
    });

    // Simple online count simulation for now
    setOnlineCount(Math.floor(Math.random() * 50) + 10);

    return () => newSocket.close();
  }, []);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = (e) => {
    e.preventDefault();
    if (!inputText.trim() || !socket) return;

    const messageData = {
      text: inputText,
      user: {
        id: user.id,
        name: user.name || user.email || 'Anonymous',
        wallet: user.wallet
      }
    };

    socket.emit('send_message', messageData);
    setInputText('');
  };

  return (
    <div className="h-[calc(100vh-160px)] flex flex-col space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-black text-white uppercase italic tracking-tight">Alpha Channel</h2>
          <p className="text-slate-500 font-bold uppercase tracking-tighter text-xs mt-1">Real-time community intelligence</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="px-4 py-2 rounded-xl bg-primary/10 border border-primary/20 flex items-center gap-2">
            <Users className="w-4 h-4 text-primary" />
            <span className="text-xs font-black text-primary uppercase tracking-widest">{onlineCount} Online</span>
          </div>
        </div>
      </div>

      <div className="flex-1 grid grid-cols-1 lg:grid-cols-4 gap-6 min-h-0">
        {/* Sidebar */}
        <div className="hidden lg:block space-y-6">
          <Card title="Rooms" className="border-none bg-slate-900/40">
            <div className="space-y-2">
              <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl bg-primary text-secondary font-black uppercase tracking-widest text-[10px]">
                <MessageSquare className="w-4 h-4" /> General Alpha
              </button>
              <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-slate-500 hover:bg-white/5 font-black uppercase tracking-widest text-[10px] transition-all">
                <Shield className="w-4 h-4" /> Technical Analysis
              </button>
              <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-slate-500 hover:bg-white/5 font-black uppercase tracking-widest text-[10px] transition-all">
                <Wallet className="w-4 h-4" /> Whale Alerts
              </button>
            </div>
          </Card>

          <Card title="Active Traders" className="border-none bg-slate-900/40">
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center border border-white/5">
                    <User className="w-4 h-4 text-slate-500" />
                  </div>
                  <div className="flex-1 overflow-hidden">
                    <div className="text-[10px] font-black text-white uppercase truncate">Trader_{Math.random().toString(36).substring(7)}</div>
                    <div className="flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-primary"></span>
                      <span className="text-[8px] font-bold text-slate-500 uppercase tracking-tighter">Online</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Chat Area */}
        <Card className="lg:col-span-3 flex flex-col border-none bg-slate-900/40 min-h-0 overflow-hidden">
          <div 
            ref={scrollRef}
            className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar"
          >
            {messages.length === 0 && (
              <div className="h-full flex flex-col items-center justify-center text-slate-600 gap-4 opacity-50">
                <MessageSquare className="w-12 h-12" />
                <p className="text-sm font-bold uppercase tracking-widest">Start the conversation</p>
              </div>
            )}
            {messages.map((msg) => {
              const isMe = msg.user.id === user.id;
              return (
                <div key={msg.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[80%] space-y-1 ${isMe ? 'text-right' : 'text-left'}`}>
                    <div className="flex items-center gap-2 mb-1 justify-inherit">
                      {!isMe && <span className="text-[10px] font-black text-primary uppercase tracking-widest">{msg.user.name}</span>}
                      <span className="text-[8px] font-bold text-slate-600 uppercase tracking-tighter">
                        {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                      {isMe && <span className="text-[10px] font-black text-cyan-400 uppercase tracking-widest">You</span>}
                    </div>
                    <div className={`px-4 py-3 rounded-2xl text-sm font-medium leading-relaxed ${
                      isMe 
                        ? 'bg-primary text-secondary rounded-tr-none shadow-[0_0_15px_rgba(99,211,242,0.2)]' 
                        : 'bg-white/5 text-slate-200 border border-white/5 rounded-tl-none'
                    }`}>
                      {msg.text}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <form onSubmit={handleSend} className="p-4 border-t border-white/5 bg-black/20">
            <div className="relative">
              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="Type a message to the community..."
                className="w-full bg-white/[0.03] border border-white/10 rounded-xl py-4 pl-6 pr-16 text-sm text-white focus:outline-none focus:border-primary/50 transition-all"
              />
              <button
                type="submit"
                disabled={!inputText.trim()}
                className="absolute right-2 top-1/2 -translate-y-1/2 p-3 rounded-lg bg-primary text-secondary hover:bg-white transition-all disabled:opacity-20 disabled:cursor-not-allowed"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </form>
        </Card>
      </div>
    </div>
  );
}
