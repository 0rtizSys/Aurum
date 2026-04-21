import { Placeholder } from "./BotImage";
import { StatusBadge } from "../ui/StatusBadge";
import type { ApiState } from "../../types/dashboard";

interface DashboardNavBarProps {
  apiState: ApiState;
  commandCount: number;
  moduleCount: number;
}

const apiStateLabel = {
  checking: "Verificando API",
  online: "API online",
  offline: "Modo local",
} as const;

const apiStateTone = {
  checking: "warning",
  online: "success",
  offline: "accent",
} as const;

export const DashboardNavBar = ({
  apiState,
  commandCount,
  moduleCount,
}: DashboardNavBarProps) => {
  return (
    <header className="sticky top-0 z-50 border-b border-white/8 bg-[#060608]/70 backdrop-blur-xl">
      <nav className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-4">
          <a href="#overview" className="rounded-full border border-white/8 bg-white/3 px-3 py-2">
            <Placeholder compact />
          </a>

          <div className="hidden items-center gap-2 text-sm text-slate-300 md:flex">
            <a href="#overview" className="rounded-full px-3 py-1.5 transition hover:bg-white/6 hover:text-white">
              Overview
            </a>
            <a href="#commands" className="rounded-full px-3 py-1.5 transition hover:bg-white/6 hover:text-white">
              Commands
            </a>
            <a href="#blueprint" className="rounded-full px-3 py-1.5 transition hover:bg-white/6 hover:text-white">
              Blueprint
            </a>
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-end gap-2">
          <StatusBadge text={apiStateLabel[apiState]} type={apiStateTone[apiState]} pulse={apiState === "checking"} />
          <span className="rounded-full border border-white/8 bg-white/4 px-3 py-1.5 text-xs font-medium text-slate-300">
            {commandCount} comandos
          </span>
          <span className="rounded-full border border-white/8 bg-white/4 px-3 py-1.5 text-xs font-medium text-slate-300">
            {moduleCount} modulos
          </span>
        </div>
      </nav>
    </header>
  );
};
