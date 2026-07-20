"use client";

import { useChat } from "@/hooks/useChat";

interface ChatUIProps {
  apiEndpoint: string;
  characterName: string;
  avatarSrc?: string;
  emptyStateText: string;
  placeholderText: string;
  typingText: string;
}

export default function ChatUI({
  apiEndpoint,
  characterName,
  avatarSrc,
  emptyStateText,
  placeholderText,
  typingText,
}: ChatUIProps) {
  const { messages, input, setInput, isLoading, handleSubmit, messagesEndRef } =
    useChat(apiEndpoint);

  const lastMessage = messages[messages.length - 1];
  const isTyping =
    isLoading && lastMessage?.role === "model" && lastMessage.text.length === 0;

  return (
    <div className="flex flex-col w-full max-w-2xl mx-auto h-dvh justify-between p-3 md:p-4 bg-zinc-950 text-zinc-100 overflow-hidden">
      <header className="py-3 border-b border-zinc-800 shrink-0 flex items-center justify-center gap-3">
        {avatarSrc && (
          <img
            src={avatarSrc}
            alt={`${characterName} Avatar`}
            className="w-9 h-9 md:w-10 md:h-10 rounded-full object-cover border border-amber-500/40 shadow-md"
          />
        )}
        <h1 className="text-xl md:text-2xl font-bold tracking-wide text-indigo-400">
          {characterName}
        </h1>
      </header>

      <div className="flex-1 overflow-y-auto my-3 space-y-4 px-1 py-2 scrollbar-none">
        {messages.length === 0 && (
          <p className="text-zinc-500 text-center mt-10 text-xs md:text-sm italic">
            {emptyStateText}
          </p>
        )}

        {messages.map((m) => (
          <div
            key={m.id}
            className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}
          >
            {m.text && (
              <div
                className={`max-w-[88%] md:max-w-[80%] p-3 rounded-2xl shadow-md ${
                  m.role === "user"
                    ? "bg-indigo-600 text-white rounded-tr-none"
                    : "bg-zinc-900 text-zinc-100 border border-zinc-800 rounded-tl-none"
                }`}
              >
                <span
                  className={`text-[10px] md:text-xs block mb-1 font-bold tracking-wider ${
                    m.role === "user" ? "text-indigo-200" : "text-amber-400"
                  }`}
                >
                  {m.role === "user" ? "You" : characterName}
                </span>
                <p className="whitespace-pre-wrap text-sm leading-relaxed wrap-break-word">
                  {m.text}
                </p>
              </div>
            )}
          </div>
        ))}

        {isTyping && (
          <div className="text-xs text-zinc-500 animate-pulse pl-2 font-mono">
            {typingText}
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      <form
        onSubmit={handleSubmit}
        className="flex gap-2 bg-zinc-900 p-2 rounded-xl shadow-lg border border-zinc-800 shrink-0 mb-1"
      >
        <input
          className="flex-1 p-2 bg-transparent outline-none text-zinc-100 placeholder-zinc-500 text-sm min-w-0"
          value={input}
          placeholder={placeholderText}
          onChange={(e) => setInput(e.target.value)}
          disabled={isLoading}
        />
        <button
          type="submit"
          disabled={!input.trim() || isLoading}
          className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-indigo-700 transition disabled:opacity-50"
        >
          Send
        </button>
      </form>
    </div>
  );
}
