interface LRButtonProps {
    text: string;
    dotColor?: string; // Por ejemplo: "#fbbf24" o "gold"
}

// 1. Recibimos 'dotColor' en la desestructuración
export const LRButton = ({ text, dotColor = "#475569" }: LRButtonProps) => {
    return (
        <button className="
            group
            flex items-center gap-2
            border-2 border-slate-600 
            px-6 py-2 
            rounded-xl 
            text-slate-300 font-medium
            transition-all duration-300
            hover:border-amber-500/50 
            hover:text-amber-300 
            hover:shadow-[0_0_15px_rgba(245,158,11,0.1)]
            active:scale-95
        ">
            {/* 2. Usamos style para el color dinámico y clases para el resto */}
            <span
                className="w-2 h-2 rounded-full transition-all duration-300 group-hover:brightness-125 group-hover:shadow-[0_0_8px_currentColor]"
                style={{ backgroundColor: dotColor }}
            ></span>

            <span>{text}</span>
        </button>
    )
}