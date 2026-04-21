// Imagina que este estado viene de tu lógica de heartbeat.ts
const botStatus = "online";

export const Navbar = () => {
    return (
        /* 1. EL CHASIS: Fijo arriba, fondo oscuro con desenfoque de cristal */
        <header className="fixed top-0 z-50 w-full border-b border-white/10 bg-slate-950/80 backdrop-blur-md">

            {/* 2. EL CONTENEDOR DE ANCHO: Centra el contenido y limita el tamaño máximo */}
            <nav className="mx-auto h-16 max-w-7xl px-4 sm:px-6 lg:px-8">

                {/* 3. EL MOTOR FLEX: Alinea los bloques a los extremos y los centra verticalmente */}
                <div className="flex h-full items-center justify-between">

                    {/* --- BLOQUE IZQUIERDO: Identidad del Bot --- */}
                    <div className="flex items-center gap-3">
                        {/* Logo con degradado "Aurum" */}
                        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-linear-to-tr from-yellow-600 to-yellow-400 font-black text-slate-900 shadow-md">
                            A
                        </div>
                        <h1 className="text-lg font-bold tracking-tight text-white">
                            AURUM <span className="text-yellow-500">DASH</span>
                        </h1>
                    </div>

                    {/* --- BLOQUE DERECHO: Status y Perfil --- */}
                    <div className="flex items-center gap-6">

                        {/* Indicador de Status (Heartbeat) */}
                        <div className="flex items-center gap-2 rounded-full bg-white/5 py-1 pl-2 pr-3 border border-white/5">
                            <div className="relative flex h-2 w-2">
                                {/* Si está online, mostramos el brillo animado */}
                                {botStatus === "online" && (
                                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75"></span>
                                )}
                                <span className={`relative inline-flex h-2 w-2 rounded-full ${botStatus === "online" ? 'bg-green-500' : 'bg-red-500'}`}></span>
                            </div>
                            <span className="text-[10px] font-bold uppercase tracking-widbg-linear-to-trest text-slate-400">
                                {botStatus === "online" ? 'System Live' : 'System Down'}
                            </span>
                        </div>

                        {/* Separador sutil */}
                        <div className="h-6 w-px bg-white/10" />

                        {/* Info del Usuario (Tú) */}
                        <div className="flex items-center gap-3">
                            <div className="hidden text-right sm:block">
                                <p className="text-xs font-bold text-white">Zyre</p>
                                <p className="text-[10px] text-yellow-500/80">Developer</p>
                            </div>
                            <div className="h-9 w-9 rounded-full border border-yellow-500/30 p-0.5">
                                <img
                                    className="h-full w-full rounded-full object-cover"
                                    src="https://api.dicebear.com/7.x/avataaars/svg?seed=Zyre"
                                    alt="Avatar"
                                />
                            </div>
                        </div>

                    </div>
                </div>
            </nav>
        </header>
    );
};