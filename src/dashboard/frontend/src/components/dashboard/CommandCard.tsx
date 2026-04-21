import { audienceLabels, availabilityLabels } from "../../data/commandCatalog";
import { cn } from "../../lib/cn";
import type { CommandDefinition } from "../../types/dashboard";
import { Badge } from "../ui/Badge";

interface CommandCardProps {
  command: CommandDefinition;
  selected: boolean;
  onSelect: () => void;
}

export function CommandCard({ command, selected, onSelect }: CommandCardProps) {
  return (
    <button
      type="button"
      onClick={onSelect}
      className={cn(
        "w-full rounded-[28px] border p-5 text-left transition",
        selected
          ? "border-slate-500 bg-slate-900 shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]"
          : "border-slate-800 bg-slate-950 hover:border-slate-700 hover:bg-slate-900/75",
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-[11px] font-medium uppercase tracking-[0.28em] text-slate-500">
            {command.slash}
          </p>
          <h3 className="mt-3 text-lg font-semibold text-white">{command.title}</h3>
        </div>
        <Badge tone={selected ? "active" : "muted"}>
          {availabilityLabels[command.availability]}
        </Badge>
      </div>

      <p className="mt-4 text-sm leading-7 text-slate-400">{command.description}</p>

      <div className="mt-4 flex flex-wrap gap-2">
        <Badge tone="muted">{audienceLabels[command.audience]}</Badge>
        <Badge tone="muted">{command.options.length} fields</Badge>
      </div>
    </button>
  );
}
