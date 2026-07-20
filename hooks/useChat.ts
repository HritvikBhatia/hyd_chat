import { useState, useEffect, useRef } from "react";

export interface Message {
  id: string;
  role: "user" | "model";
  text: string;
}

export function useChat(apiEndpoint: string) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "end",
    });
  }, [messages, isLoading]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userQuery = input;
    setInput("");
    setIsLoading(true);

    const userMsgId = crypto.randomUUID();
    const modelMsgId = crypto.randomUUID();

    const historyPayload = [
      ...messages.map((m) => ({ role: m.role, text: m.text })),
      { role: "user" as const, text: userQuery },
    ];

    setMessages((prev) => [
      ...prev,
      { id: userMsgId, role: "user", text: userQuery },
      { id: modelMsgId, role: "model", text: "" },
    ]);

    try {
      const response = await fetch(apiEndpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: historyPayload }),
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

        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === modelMsgId ? { ...msg, text: msg.text + chunk } : msg,
          ),
        );
      }
    } catch (err: any) {
      console.error(err);
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === modelMsgId
            ? { ...msg, text: `⚠️ Error: ${err.message}` }
            : msg,
        ),
      );
    } finally {
      setIsLoading(false);
    }
  };

  return { messages, input, setInput, isLoading, handleSubmit, messagesEndRef };
}
