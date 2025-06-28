import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { useAuthStore } from "../store/authStore";
import { getTransactions } from "../api/transaction";
import { LuBotMessageSquare } from "react-icons/lu";

export default function ChatBot() {
  const { user, accessToken } = useAuthStore();
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [allowHistory, setAllowHistory] = useState(true);
  const [messages, setMessages] = useState([
    { role: "ai", content: "Hi, how can I help you today?" },
  ]);
  const [loading, setLoading] = useState(false);
  const [transactions, setTransactions] = useState([]);
  const bottomRef = useRef();

  useEffect(() => {
    if (open) {
      getTransactions(accessToken).then((r) => setTransactions(r.data));
    }
  }, [open, accessToken]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const sendMessage = async (e) => {
    e.preventDefault();
    const text = input.trim();
    if (!text) return;

    const userMsg = { role: "user", content: text };
    setMessages((msgs) => [...msgs, userMsg]);
    setInput("");
    setLoading(true);

    try {
      const topTxns = [...transactions]
        .sort((a, b) => b.amount - a.amount)
        .slice(0, 10);

      const payload = {
        email: user.email,
        isTransactionAllowed: allowHistory,
        query: text,
        transactions: topTxns.map((t) => ({
          amount: t.amount,
          type: t.type,
          date: `${t.date.split("T")[0]}T00:00:00`,
          description: t.description,
          category: t.category.name,
        })),
      };

      setMessages((msgs) => [...msgs, { role: "ai-typing", content: "" }]);

      const res = await axios.post("http://51.20.53.130/predict", payload, {
        timeout: 60000,
      });
      const aiText = res.data.received_data;

      await new Promise((resolve) => {
        let idx = 0;
        const interval = setInterval(() => {
          idx++;
          setMessages((msgs) =>
            msgs.map((m) =>
              m.role === "ai-typing"
                ? { ...m, content: aiText.slice(0, idx) }
                : m
            )
          );
          if (idx >= aiText.length) {
            clearInterval(interval);
            resolve();
          }
        }, 20);
      });

      setMessages((msgs) =>
        msgs
          .filter((m) => m.role !== "ai-typing")
          .concat({ role: "ai", content: aiText })
      );
    } catch (err) {
      console.error(err);
      setMessages((msgs) =>
        msgs
          .filter((m) => m.role !== "ai-typing")
          .concat({
            role: "ai",
            content: "⚠️ Sorry, I couldn’t get a response. Try again.",
          })
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Toggle button */}
      <button
        onClick={() => setOpen((o) => !o)}
        className="fixed bottom-4 right-4 w-16 h-16 bg-purple-600 rounded-full text-white flex items-center justify-center"
      >
        
        <LuBotMessageSquare size={24} />
      </button>

      {open && (
        <div className="fixed bottom-24 right-4 w-[440px] h-[634px] bg-white p-4 rounded-lg shadow-lg flex flex-col text-black">
          {/* Header */}
          <div className="flex justify-between items-center mb-2">
            <h2 className="font-semibold">Finance ChatBot</h2>
            <label className="text-xs">
              <input
                type="checkbox"
                checked={allowHistory}
                onChange={() => setAllowHistory((h) => !h)}
                className="mr-1"
              />
              Share transactions
            </label>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto pr-2">
            {messages.map((m, i) => (
              <div
                key={i}
                className={`my-2 flex ${
                  m.role === "user" ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`px-4 py-2 rounded-lg max-w-[75%] ${
                    m.role === "user"
                      ? "bg-black text-white"
                      : "bg-gray-100 text-gray-800"
                  }`}
                >
                  {m.content}
                </div>
              </div>
            ))}
            {loading && (
              <div className="text-center text-gray-500 text-xs my-2">
                💭 Finance advisor thinking...
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          {/* Input */}
          <form onSubmit={sendMessage} className="flex space-x-2 pt-2">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="flex-1 border rounded px-3 py-2 text-sm"
              placeholder="Ask a question..."
              disabled={loading}
            />
            <button
              type="submit"
              className="bg-black text-white px-4 py-2 rounded"
              disabled={loading}
            >
              Send
            </button>
          </form>
        </div>
      )}
    </>
  );
}
