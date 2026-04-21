import type { CommandDefinition, PreparedCommandState } from "../../types/dashboard";
import { Badge } from "../ui/Badge";
import { Button } from "../ui/Button";

interface PreviewPanelProps {
  command?: CommandDefinition;
  payloadPreview: string;
  preparedState?: PreparedCommandState;
  copied: boolean;
  onCopy: () => Promise<boolean>;
}

export function PreviewPanel({
  command,
  payloadPreview,
  preparedState,
  copied,
  onCopy,
}: PreviewPanelProps) {
  if (!command) {
    return (
      <aside className="rounded-[32px] border border-dashed border-slate-800 bg-slate-900 p-6 text-sm leading-7 text-slate-400">
        No hay comando seleccionado.
      </aside>
    );
  }

  return (
    <aside className="space-y-5">
      <section className="rounded-[32px] border border-slate-800 bg-slate-900 p-5">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-[11px] font-medium uppercase tracking-[0.28em] text-slate-500">
              Payload
            </p>
            <h3 className="mt-2 text-lg font-semibold text-white">Contrato JSON</h3>
          </div>
          <Button variant={copied ? "primary" : "secondary"} size="sm" onClick={() => void onCopy()}>
            {copied ? "Copied" : "Copy"}
          </Button>
        </div>

        <pre className="mt-4 overflow-x-auto rounded-[24px] border border-slate-800 bg-slate-950 p-4 text-xs leading-6 text-slate-300">
          {payloadPreview}
        </pre>
      </section>

      <section className="rounded-[32px] border border-slate-800 bg-slate-900 p-5">
        <p className="text-[11px] font-medium uppercase tracking-[0.28em] text-slate-500">
          Response preview
        </p>
        <h3 className="mt-2 text-lg font-semibold text-white">{command.responsePreviewTitle}</h3>
        <div className="mt-4 rounded-[24px] border border-slate-800 bg-slate-950 p-4">
          <p className="text-sm leading-7 text-slate-300">{command.responsePreview}</p>
        </div>
      </section>

      <section className="rounded-[32px] border border-slate-800 bg-slate-900 p-5">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-[11px] font-medium uppercase tracking-[0.28em] text-slate-500">
              Prepared snapshot
            </p>
            <h3 className="mt-2 text-lg font-semibold text-white">Estado local</h3>
          </div>
          <Badge tone={preparedState ? "active" : "muted"}>
            {preparedState ? "Ready" : "Idle"}
          </Badge>
        </div>

        {preparedState ? (
          <div className="mt-4 rounded-[24px] border border-slate-800 bg-slate-950 p-4">
            <p className="text-sm font-medium text-white">{preparedState.summary}</p>
            <p className="mt-2 text-sm text-slate-400">{preparedState.timestamp}</p>
          </div>
        ) : (
          <p className="mt-4 text-sm leading-7 text-slate-400">
            Prepara el comando para guardar un snapshot local del payload antes de conectar el endpoint real.
          </p>
        )}
      </section>
    </aside>
  );
}
