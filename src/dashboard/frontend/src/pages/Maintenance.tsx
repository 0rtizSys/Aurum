import { Badge } from "../components/ui/Badge";
import { commandCatalog, commandModules } from "../data/commandCatalog";
import type { ApiState } from "../types/dashboard";

interface MaintenanceProps {
  apiState: ApiState;
  statusEndpoint: string;
}

const apiTone = {
  checking: "muted",
  online: "active",
  offline: "default",
} as const;

const apiLabel = {
  checking: "Checking API",
  online: "Status endpoint online",
  offline: "Status endpoint fallback",
} as const;

export function Maintenance({ apiState, statusEndpoint }: MaintenanceProps) {
  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-950 px-4 py-10 text-white sm:px-6 lg:px-8">
      <div className="w-full max-w-5xl">
        <section className="steel-panel overflow-hidden p-6 sm:p-8 lg:p-10">
          <div className="grid gap-8 lg:grid-cols-[minmax(0,1.1fr)_320px] lg:items-center">
            <div>
              <div className="flex flex-wrap gap-3">
                <Badge tone="default">Maintenance mode</Badge>
                <Badge tone={apiTone[apiState]}>{apiLabel[apiState]}</Badge>
              </div>

              <div className="mt-6 flex h-14 w-14 items-center justify-center rounded-3xl border border-slate-700 bg-slate-950 text-sm font-semibold uppercase tracking-[0.24em] text-white">
                AU
              </div>

              <h1 className="mt-8 text-4xl font-semibold leading-tight text-white sm:text-5xl">
                El dashboard está temporalmente en mantenimiento.
              </h1>

              <p className="mt-6 max-w-2xl text-base leading-8 text-slate-400 sm:text-lg">
                La interfaz ya está preparada con catálogo modular, editor dinámico y preview de contratos para que puedas continuar la integración desde backend cuando quieras.
              </p>

              <div className="mt-8 grid gap-4 sm:grid-cols-3">
                <div className="rounded-[28px] border border-slate-800 bg-slate-950 p-5">
                  <p className="text-[11px] font-medium uppercase tracking-[0.28em] text-slate-500">
                    Commands
                  </p>
                  <p className="mt-3 text-3xl font-semibold text-white">{commandCatalog.length}</p>
                </div>
                <div className="rounded-[28px] border border-slate-800 bg-slate-950 p-5">
                  <p className="text-[11px] font-medium uppercase tracking-[0.28em] text-slate-500">
                    Modules
                  </p>
                  <p className="mt-3 text-3xl font-semibold text-white">{commandModules.length}</p>
                </div>
                <div className="rounded-[28px] border border-slate-800 bg-slate-950 p-5">
                  <p className="text-[11px] font-medium uppercase tracking-[0.28em] text-slate-500">
                    Route
                  </p>
                  <p className="mt-3 text-sm font-medium leading-6 text-slate-300">/api/status</p>
                </div>
              </div>
            </div>

            <aside className="space-y-4 rounded-[32px] border border-slate-800 bg-slate-950 p-6">
              <div className="rounded-[24px] border border-slate-800 bg-slate-900 p-5">
                <p className="text-sm font-semibold text-white">Qué ya quedó resuelto</p>
                <p className="mt-3 text-sm leading-7 text-slate-400">
                  Catálogo central de comandos, manejo de drafts, validación, copy-to-clipboard y composición modular del dashboard.
                </p>
              </div>

              <div className="rounded-[24px] border border-slate-800 bg-slate-900 p-5">
                <p className="text-sm font-semibold text-white">Qué conectarás después</p>
                <p className="mt-3 text-sm leading-7 text-slate-400">
                  Ejecución real de comandos, persistencia de configuración y lecturas de balances desde los endpoints del backend.
                </p>
              </div>

              <div className="rounded-[24px] border border-slate-800 bg-slate-900 p-5">
                <p className="text-[11px] font-medium uppercase tracking-[0.28em] text-slate-500">
                  Endpoint
                </p>
                <code className="mt-3 block text-xs leading-6 text-slate-300">{statusEndpoint}</code>
              </div>
            </aside>
          </div>
        </section>
      </div>
    </main>
  );
}
