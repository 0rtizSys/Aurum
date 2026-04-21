import type { Dispatch, SetStateAction } from "react";
import type { CommandDefinition, CommandModuleMeta, ModuleFilter } from "../../types/dashboard";
import { Button } from "../ui/Button";
import { Input } from "../ui/Input";
import { CommandCard } from "./CommandCard";

interface SidebarProps {
  commands: CommandDefinition[];
  modules: CommandModuleMeta[];
  moduleFilter: ModuleFilter;
  setModuleFilter: Dispatch<SetStateAction<ModuleFilter>>;
  searchQuery: string;
  setSearchQuery: Dispatch<SetStateAction<string>>;
  selectedCommandId: string;
  onSelectCommand: (commandId: string) => void;
}

export function Sidebar({
  commands,
  modules,
  moduleFilter,
  setModuleFilter,
  searchQuery,
  setSearchQuery,
  selectedCommandId,
  onSelectCommand,
}: SidebarProps) {
  return (
    <aside className="flex h-fit flex-col gap-6 rounded-[32px] border border-slate-800 bg-slate-900 p-5 xl:sticky xl:top-8">
      <div>
        <p className="text-[11px] font-medium uppercase tracking-[0.28em] text-slate-500">
          Command registry
        </p>
        <h2 className="mt-3 text-2xl font-semibold text-white">Explorador</h2>
      </div>

      <div>
        <label className="text-[11px] font-medium uppercase tracking-[0.28em] text-slate-500">
          Search
        </label>
        <Input
          value={searchQuery}
          onChange={(event) => setSearchQuery(event.target.value)}
          placeholder="work, balance, sync..."
          className="mt-3"
        />
      </div>

      <div>
        <p className="text-[11px] font-medium uppercase tracking-[0.28em] text-slate-500">
          Modules
        </p>
        <div className="mt-3 flex flex-wrap gap-2">
          <Button
            variant={moduleFilter === "all" ? "primary" : "secondary"}
            size="sm"
            onClick={() => setModuleFilter("all")}
          >
            All
          </Button>
          {modules.map((module) => (
            <Button
              key={module.id}
              variant={moduleFilter === module.id ? "primary" : "secondary"}
              size="sm"
              onClick={() => setModuleFilter(module.id)}
            >
              {module.shortLabel}
            </Button>
          ))}
        </div>
      </div>

      <div className="space-y-3">
        {commands.length > 0 ? (
          commands.map((command) => (
            <CommandCard
              key={command.id}
              command={command}
              selected={selectedCommandId === command.id}
              onSelect={() => onSelectCommand(command.id)}
            />
          ))
        ) : (
          <div className="rounded-[28px] border border-dashed border-slate-800 bg-slate-950 px-5 py-8 text-sm leading-7 text-slate-400">
            No hay coincidencias con ese filtro. Ajusta la busqueda o vuelve a todos los modulos.
          </div>
        )}
      </div>
    </aside>
  );
}
