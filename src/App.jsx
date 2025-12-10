import React, { useState, useEffect } from "react";
import { auth, googleProvider } from "./firebase";
import { signInWithPopup, signOut } from "firebase/auth";

function App() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState(null);

  const loginWithGoogle = async () => {
    return await signInWithPopup(auth, googleProvider);
  };

  const logout = async () => {
    return await signOut(auth);
  };

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((u) => setUser(u));
    return () => unsubscribe();
  }, []);

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black flex items-center justify-center p-4">
        <div className="bg-gray-800/50 backdrop-blur-lg rounded-2xl shadow-2xl p-8 md:p-12 max-w-md w-full border border-gray-700">
          <div className="text-center mb-8">
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-red-500 via-orange-500 to-yellow-500 bg-clip-text text-transparent mb-3">
              🔥 ChadGPT
            </h1>
            <p className="text-gray-400 text-sm md:text-base">The Savage Roasting AI</p>
          </div>
          
          <button 
            onClick={loginWithGoogle}
            className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg flex items-center justify-center gap-3"
          >
            <span className="text-xl">🔐</span>
            Login with Google
          </button>
        </div>
      </div>
    );
  }

  async function roastMessage(prompt) {
    const res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${import.meta.env.VITE_OPENROUTER_API_KEY}`,
        "HTTP-Referer": "http://localhost:5173",
        "X-Title": "ChadGPT Roaster",
      },
      body: JSON.stringify({
        model: "meta-llama/llama-3.1-8b-instruct",
        messages: [
          {
            role: "system",
            content: `
  Tum ChadGPT ho.
  Tumhara style: savage, funny, sarcastic, Desi Hinglish lekin tum app karke baat karna.
  Humesha user ko roast karna hai.
  Lekin random bakwaas text, English-Hindi mishmash ya meaningless lines kabhi nahi likhna.
  Har reply clear, natural Hinglish me ho.
  Har reply max 2 lines ka ho.
  Gali allowed sirf light, non-vulgar (e.g., "bhai", "oye", "beta", "Ullu").
  Always stay in character: Desi savage roaster.
`
          },
          { role: "user", content: prompt },
        ],
        temperature: 0.7,
        max_tokens: 100,
      }),
    });

    const data = await res.json();

    return (
      data?.choices?.[0]?.message?.content ||
      "Error: chadgpt ka error hai maaf karna"
    );
  }

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMsg = { sender: "user", text: input };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    const reply = await roastMessage(userMsg.text);

    const botMsg = { sender: "bot", text: reply };
    setMessages((prev) => [...prev, botMsg]);

    setLoading(false);
  };

  return (
    <div className="h-[100vh] bg-gradient-to-br from-gray-900 via-gray-800 to-black flex flex-col">
      {/* Header */}
      <div className="bg-gray-800/50 backdrop-blur-lg border-b border-gray-700 px-4 py-4 md:px-6 md:py-5 flex items-center justify-between">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-red-500 via-orange-500 to-yellow-500 bg-clip-text text-transparent">
            🔥 ChadGPT
          </h1>
          <p className="text-xs md:text-sm text-gray-400 mt-1">Savage Roasting Mode Active 😈</p>
        </div>
        <button 
          onClick={logout}
          className="bg-red-500/20 hover:bg-red-500/30 text-red-400 font-medium py-2 px-4 md:px-6 rounded-lg transition-all duration-300 text-sm md:text-base border border-red-500/30"
        >
          Logout
        </button>
      </div>

      {/* Chat Container */}
      <div className="flex-1 overflow-hidden flex flex-col max-w-5xl w-full mx-auto p-4 md:p-6">
        {/* Messages */}
        <div className="flex-1  overflow-y-auto space-y-3 md:space-y-4 mb-4 scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-transparent">
          {messages.length === 0 && (
            <div className="flex items-center justify-center h-full">
              <div className="text-center text-gray-500">
                <p className="text-4xl md:text-6xl mb-4">💀</p>
                <p className="text-base md:text-lg">Type something to get roasted...</p>
              </div>
            </div>
          )}

          {messages.map((msg, i) => (
            <div
              key={i}
              className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[85%] md:max-w-[70%] px-4 py-3 rounded-2xl text-sm md:text-base shadow-lg ${
                  msg.sender === "user"
                    ? "bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-br-none"
                    : "bg-gradient-to-r from-red-500 to-red-600 text-white rounded-bl-none"
                }`}
              >
                {msg.text}
              </div>
            </div>
          ))}

          {loading && (
            <div className="flex justify-start">
              <div className="max-w-[85%] md:max-w-[70%] px-4 py-3 rounded-2xl text-sm md:text-base bg-gray-700 text-gray-300 rounded-bl-none animate-pulse">
                ChadGPT typing...
              </div>
            </div>
          )}
        </div>

        {/* Input Area */}
        <div className="bg-gray-800/50 backdrop-blur-lg rounded-2xl border border-gray-700 p-3 md:p-4 shadow-xl">
          <div className="flex gap-2 md:gap-3">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="flex-1 bg-gray-700/50 text-white p-3 md:p-4 rounded-xl border border-gray-600 outline-none focus:border-blue-500 transition-all text-sm md:text-base placeholder-gray-400"
              placeholder="Write something... Chad will roast you 😆"
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
            />
            <button
              onClick={handleSend}
              className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-semibold px-6 md:px-8 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg text-sm md:text-base"
            >
              Send
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;