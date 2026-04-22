import { useState, useRef, useEffect } from "react";

interface Message {
  id: string;
  sender: "user" | "bot";
  content: string;
  timestamp: Date;
}

export function UserCommandTester() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      sender: "bot",
      content: "¡Hola! Soy Aurum. Puedes probar mis comandos aquí. Intenta escribir /help o /ping.",
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendCommand = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      sender: "user",
      content: input,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsTyping(true);
    let dContent: string = "...";

    try {
      // Simulate connecting to the backend. Replace with your actual backend endpoint.
      const response = await fetch("http://localhost:3001/api/commands/execute", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ command: input }),
      });

      const data = await response.json();

      // CORRECCIÓN AQUÍ:
      // Si el backend mandó 404 (NotFound) o 400 (BadRequest)
      if (response.status === 404 || data.errCode === 404) {
        dContent = "❌ Ese comando no existe bro... intenta con /help";
      } else if (response.status === 200) {
        dContent = data.message; // "Ejecutando /help..."
      } else {
        dContent = "Algo salió mal en la Matrix.";
      }

      // Pequeño delay para que el "isTyping" se vea natural
      await new Promise((resolve) => setTimeout(resolve, 800));

      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        sender: "bot",
        content: dContent,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      console.error("Error executing command:", error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        sender: "bot",
        content: "Hubo un error al conectar con el servidor.",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="flex h-screen w-full bg-slate-900 text-slate-100 overflow-hidden font-sans">
      {/* Left Sidebar - Navigation / Categories */}
      <aside className="w-64 bg-slate-950 border-r border-slate-800 flex flex-col transition-all duration-300">
        <div className="h-16 flex items-center px-6 border-b border-slate-800 shadow-sm shadow-slate-900/50">
          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-br from-amber-400 to-amber-600 text-slate-950 font-bold text-sm shadow-lg shadow-amber-500/20">
            Au
          </div>
          <span className="ml-3 font-semibold text-lg tracking-wide">Aurum</span>
        </div>

        <div className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
          <p className="px-3 text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Secciones</p>
          {[
            { id: "general", label: "General", active: true, icon: "M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" },
            { id: "moderation", label: "Moderación", active: false, icon: "M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" },
            { id: "music", label: "Música", active: false, icon: "M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" },
            { id: "economy", label: "Economía", active: false, icon: "M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" },
          ].map((item) => (
            <button
              key={item.id}
              className={`w-full flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-colors ${item.active
                ? "bg-amber-500/10 text-amber-500"
                : "text-slate-400 hover:bg-slate-800/50 hover:text-slate-200"
                }`}
            >
              <svg className="w-5 h-5 mr-3 opacity-75" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={item.icon} />
              </svg>
              {item.label}
            </button>
          ))}
        </div>

        <div className="p-4 border-t border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center">
              <span className="text-sm font-medium text-slate-300">U</span>
            </div>
            <div>
              <p className="text-sm font-medium">Usuario Test</p>
              <p className="text-xs text-slate-500">ID: 123456789</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col relative bg-slate-900/50">
        {/* Top Navbar */}
        <header className="h-16 flex items-center justify-between px-6 border-b border-slate-800/60 bg-slate-900/80 backdrop-blur-md z-10">
          <div className="flex items-center gap-4">
            <h1 className="text-lg font-semibold flex items-center gap-2">
              <span className="text-slate-500 text-xl">#</span>
              probar-comandos
            </h1>
            <div className="h-4 w-[1px] bg-slate-700"></div>
            <p className="text-sm text-slate-400">Área interactiva para interactuar con Aurum</p>
          </div>

          <div className="flex items-center gap-4">
            <button className="p-2 text-slate-400 hover:text-slate-200 transition-colors rounded-lg hover:bg-slate-800">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
            </button>
            <button className="p-2 text-slate-400 hover:text-slate-200 transition-colors rounded-lg hover:bg-slate-800">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </button>
          </div>
        </header>

        {/* Chat / Messages Area */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex gap-4 max-w-4xl mx-auto w-full ${msg.sender === "user" ? "flex-row-reverse" : ""
                }`}
            >
              {/* Avatar */}
              <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center shadow-md ${msg.sender === "bot"
                ? "bg-gradient-to-br from-amber-400 to-amber-600 text-slate-900"
                : "bg-slate-700 text-slate-300"
                }`}>
                {msg.sender === "bot" ? "Au" : "U"}
              </div>

              {/* Message Bubble */}
              <div className={`flex flex-col ${msg.sender === "user" ? "items-end" : "items-start"}`}>
                <div className="flex items-baseline gap-2 mb-1">
                  <span className="font-medium text-sm text-slate-200">
                    {msg.sender === "bot" ? "Aurum Bot" : "Tú"}
                  </span>
                  <span className="text-xs text-slate-500">
                    {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
                <div className={`px-4 py-2.5 rounded-2xl max-w-2xl text-[15px] leading-relaxed shadow-sm ${msg.sender === "user"
                  ? "bg-amber-600 text-white rounded-tr-none"
                  : "bg-slate-800 text-slate-200 rounded-tl-none border border-slate-700/50"
                  }`}>
                  {msg.content}
                </div>
              </div>
            </div>
          ))}

          {isTyping && (
            <div className="flex gap-4 max-w-4xl mx-auto w-full">
              <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center text-slate-900 shadow-md">
                Au
              </div>
              <div className="flex flex-col items-start">
                <div className="flex items-baseline gap-2 mb-1">
                  <span className="font-medium text-sm text-slate-200">Aurum Bot</span>
                </div>
                <div className="px-5 py-3.5 rounded-2xl bg-slate-800 text-slate-200 rounded-tl-none border border-slate-700/50 flex items-center gap-1.5">
                  <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: "0ms" }}></div>
                  <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: "150ms" }}></div>
                  <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: "300ms" }}></div>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="p-4 bg-slate-900 border-t border-slate-800/60 w-full">
          <form onSubmit={handleSendCommand} className="max-w-4xl mx-auto relative">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Escribe un comando para Aurum..."
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-5 py-3.5 pr-14 text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500/50 transition-all shadow-inner"
            />
            <button
              type="submit"
              disabled={!input.trim() || isTyping}
              className="absolute right-2 top-2 bottom-2 aspect-square flex items-center justify-center rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-900 transition-colors disabled:opacity-50 disabled:hover:bg-amber-500"
            >
              <svg className="w-5 h-5 ml-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
              </svg>
            </button>
          </form>
          <div className="max-w-4xl mx-auto mt-2 text-center">
            <p className="text-[11px] text-slate-500">
              Interactuando con la API del bot en tiempo real. Escribe <code className="bg-slate-800 px-1 py-0.5 rounded text-amber-500">/help</code> para ver comandos disponibles.
            </p>
          </div>
        </div>
      </main>

      {/* Right Sidebar - Optional Context/Info */}
      <aside className="w-64 bg-slate-950 border-l border-slate-800 hidden lg:flex flex-col">
        <div className="h-16 flex items-center px-6 border-b border-slate-800">
          <span className="font-semibold text-sm text-slate-200">Información</span>
        </div>
        <div className="p-4 space-y-6">

          <div>
            <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">Estado del Bot</h3>
            <div className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]"></div>
              <span className="text-sm font-medium text-slate-300">Conectado (23ms)</span>
            </div>
          </div>

          <div>
            <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">Servidor Actual</h3>
            <div className="bg-slate-800/50 rounded-lg p-3 border border-slate-700/50">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded bg-indigo-500/20 flex items-center justify-center text-indigo-400 font-bold">
                  DS
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-200">Discord Server</p>
                  <p className="text-xs text-slate-400">1,245 miembros</p>
                </div>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">Comandos Recientes</h3>
            <div className="space-y-2">
              {['/ping', '/play lofi hip hop', '/balance'].map((cmd, i) => (
                <div key={i} className="text-sm text-slate-400 bg-slate-900 px-3 py-1.5 rounded-md border border-slate-800/50 flex items-center gap-2">
                  <span className="text-amber-500/50 text-xs">❯</span> {cmd}
                </div>
              ))}
            </div>
          </div>

        </div>
      </aside>
    </div>
  );
}
