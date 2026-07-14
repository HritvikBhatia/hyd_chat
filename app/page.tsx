'use client';

import { useState } from 'react';

interface Message {
  id: string;
  role: 'user' | 'model';
  text: string;
}

export default function Chat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.SubmitEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userQuery = input;
    setInput('');
    setIsLoading(true);

    const userMsgId = crypto.randomUUID();
    const modelMsgId = crypto.randomUUID();

    // 1. Build the exact payload history to send BEFORE updating local UI states
    const historyPayload = [
      ...messages.map(m => ({ role: m.role, text: m.text })),
      { role: 'user' as const, text: userQuery }
    ];

    // Update UI tracking
    setMessages(prev => [
      ...prev,
      { id: userMsgId, role: 'user', text: userQuery },
      { id: modelMsgId, role: 'model', text: '' }
    ]);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: historyPayload }), // 💡 Sending the whole history array
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `Server error: ${response.status}`);
      }

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();
      if (!reader) return;

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });

        setMessages(prev => prev.map(msg => 
          msg.id === modelMsgId 
            ? { ...msg, text: msg.text + chunk }
            : msg
        ));
      }
    } catch (err: any) {
      console.error(err);
      setMessages(prev => prev.map(msg => 
        msg.id === modelMsgId 
          ? { ...msg, text: `⚠️ Error: ${err.message}` }
          : msg
      ));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col w-full max-w-2xl mx-auto h-screen justify-between p-4 bg-zinc-950 text-zinc-100">
      <header className="py-4 border-b border-zinc-800">
        <h1 className="text-2xl font-bold text-center tracking-wide text-indigo-400">Hyderabad Group</h1>
      </header>

      <div className="flex-1 overflow-y-auto my-4 space-y-4 p-2">
        {messages.length === 0 && (
          <p className="text-zinc-500 text-center mt-10 text-sm italic">
            Saleem Pheku is online. Go ahead, talk to him.
          </p>
        )}

        {messages.map(m => (
          <div key={m.id} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            {m.text && (
              <div className={`max-w-[80%] p-3 rounded-2xl shadow-md ${
                m.role === 'user'
                  ? 'bg-indigo-600 text-white rounded-tr-none'
                  : 'bg-zinc-900 text-zinc-100 border border-zinc-800 rounded-tl-none'
              }`}>
                <span className={`text-xs block mb-1 font-bold tracking-wider ${
                  m.role === 'user' ? 'text-indigo-200' : 'text-amber-400'
                }`}>
                  {m.role === 'user' ? 'You' : 'Saleem Pheku'}
                </span>
                <p className="whitespace-pre-wrap text-sm leading-relaxed">{m.text}</p>
              </div>
            )}
          </div>
        ))}
        
        {isLoading && !messages[messages.length - 1]?.text && (
          <div className="text-xs text-zinc-500 animate-pulse pl-2 font-mono">
            Saleem Pheku is typing...
          </div>
        )}
      </div>

      <form onSubmit={handleSubmit} className="flex gap-2 bg-zinc-900 p-2 rounded-xl shadow-lg border border-zinc-800">
        <input
          className="flex-1 p-2 bg-transparent outline-none text-zinc-100 placeholder-zinc-500 text-sm"
          value={input}
          placeholder="Talk to Saleem..."
          onChange={e => setInput(e.target.value)}
          disabled={isLoading}
        />
        <button
          type="submit"
          disabled={!input.trim() || isLoading}
          className="bg-indigo-600 text-white px-5 py-2 rounded-lg text-sm font-medium hover:bg-indigo-700 transition disabled:opacity-50"
        >
          Send
        </button>
      </form>
    </div>
  );
}