import './App.css'

function App() {
  return (
    <div className="min-h-screen bg-[#0f0f12] flex flex-col items-center justify-center text-white font-sans">
      <div className="text-center space-y-6">
        {/* Un placeholder para el logo de Aurum */}
        <div className="w-24 h-24 bg-gradient-to-tr from-yellow-400 to-yellow-600 rounded-full mx-auto shadow-lg shadow-yellow-500/20 flex items-center justify-center">
          <span className="text-4xl font-bold">A</span>
        </div>

        <h1 className="text-5xl font-extrabold tracking-tight">
          Aurum <span className="text-yellow-500">Dashboard</span>
        </h1>

        <p className="text-slate-400 text-lg max-w-md mx-auto">
          Estamos forjando el panel de control. El bot sigue operando, pero la web está bajo mantenimiento.
        </p>

        <div className="flex items-center justify-center gap-3">
          <span className="relative flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-yellow-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-yellow-500"></span>
          </span>
          <span className="text-sm font-mono text-yellow-500/80 uppercase tracking-widest">
            Working on backend connection...
          </span>
        </div>
      </div>
    </div>
  )
}

export default App