import { CommandEditor } from "../components/dashboard/CommandEditor";
import { PreviewPanel } from "../components/dashboard/PreviewPanel";
import { Sidebar } from "../components/dashboard/Sidebar";
import { Badge } from "../components/ui/Badge";
import { commandCatalog, commandModules } from "../data/commandCatalog";
import { useCommandManager } from "../hooks/useCommandManager";
import type { ApiState } from "../types/dashboard";

interface DashboardProps {
  apiState: ApiState;
  statusEndpoint: string;
}

const apiStateLabel = {
  checking: "Checking API",
  online: "API online",
  offline: "Local fallback",
} as const;

const apiStateTone = {
  checking: "muted",
  online: "active",
  offline: "default",
} as const;

export function Dashboard({ apiState, statusEndpoint }: DashboardProps) {
  const commandManager = useCommandManager(commandCatalog);
  const protectedCommands = commandCatalog.filter((command) => command.audience !== "public").length;
  const configurableCommands = commandCatalog.filter((command) => command.options.length > 0).length;

  return (
    <main className="min-h-screen bg-slate-950 px-4 py-6 text-white sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <header className="rounded-[36px] border border-slate-800 bg-slate-900 px-6 py-6 shadow-[0_24px_60px_rgba(0,0,0,0.28)] sm:px-8">
          <div className="flex flex-col gap-6 xl:flex-row xl:items-end xl:justify-between">
            <div className="max-w-3xl">
              <div className="flex flex-wrap items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-slate-700 bg-slate-950 text-sm font-semibold uppercase tracking-[0.24em] text-white">
                  AU
                </div>
                <Badge tone={apiStateTone[apiState]}>{apiStateLabel[apiState]}</Badge>
                <Badge tone="muted">Stealth Minimalist</Badge>
              </div>

              <h1 className="mt-6 text-4xl font-semibold tracking-tight text-white sm:text-5xl">
                Dashboard modular, sobrio y listo para backend.
              </h1>
              <p className="mt-4 max-w-2xl text-base leading-8 text-slate-400">
                Toda la interacción del panel sale de un catálogo tipado. Agregar o ajustar comandos queda centrado en datos, no en reescribir componentes.
              </p>
            </div>

            <div className="grid gap-3 sm:grid-cols-3">
              <div className="rounded-[28px] border border-slate-800 bg-slate-950 px-5 py-4">
                <p className="text-[11px] font-medium uppercase tracking-[0.28em] text-slate-500">
                  Commands
                </p>
                <p className="mt-3 text-3xl font-semibold text-white">{commandCatalog.length}</p>
              </div>
              <div className="rounded-[28px] border border-slate-800 bg-slate-950 px-5 py-4">
                <p className="text-[11px] font-medium uppercase tracking-[0.28em] text-slate-500">
                  Protected
                </p>
                <p className="mt-3 text-3xl font-semibold text-white">{protectedCommands}</p>
              </div>
              <div className="rounded-[28px] border border-slate-800 bg-slate-950 px-5 py-4">
                <p className="text-[11px] font-medium uppercase tracking-[0.28em] text-slate-500">
                  Editable
                </p>
                <p className="mt-3 text-3xl font-semibold text-white">{configurableCommands}</p>
              </div>
            </div>
          </div>

          <div className="mt-6 flex flex-wrap items-center gap-3 border-t border-slate-800 pt-6">
            <Badge tone="muted">{commandModules.length} modules</Badge>
            <Badge tone="muted">{statusEndpoint}</Badge>
          </div>
        </header>

        <section className="mt-6 grid gap-6 xl:grid-cols-[360px_minmax(0,1fr)]">
          <Sidebar
            commands={commandManager.filteredCommands}
            modules={commandModules}
            moduleFilter={commandManager.moduleFilter}
            setModuleFilter={commandManager.setModuleFilter}
            searchQuery={commandManager.searchQuery}
            setSearchQuery={commandManager.setSearchQuery}
            selectedCommandId={commandManager.selectedCommandId}
            onSelectCommand={commandManager.setSelectedCommandId}
          />

          {commandManager.hasVisibleCommands ? (
            <div className="grid gap-6 2xl:grid-cols-[minmax(0,1fr)_360px]">
              <CommandEditor
                command={commandManager.selectedCommand}
                draft={commandManager.activeDraft}
                errors={commandManager.activeErrors}
                onFieldChange={commandManager.updateField}
                onReset={commandManager.resetDraft}
                onPrepare={commandManager.prepareDraft}
              />

              <PreviewPanel
                command={commandManager.selectedCommand}
                payloadPreview={commandManager.payloadPreview}
                preparedState={commandManager.preparedState}
                copied={
                  Boolean(commandManager.selectedCommand) &&
                  commandManager.copiedCommandId === commandManager.selectedCommand?.id
                }
                onCopy={commandManager.copyPayload}
              />
            </div>
          ) : (
            <section className="rounded-[32px] border border-dashed border-slate-800 bg-slate-900 p-10 text-center">
              <p className="text-[11px] font-medium uppercase tracking-[0.28em] text-slate-500">
                Empty explorer
              </p>
              <h2 className="mt-4 text-3xl font-semibold text-white">
                No hay comandos para esta combinación
              </h2>
              <p className="mt-4 mx-auto max-w-xl text-sm leading-7 text-slate-400">
                Ajusta la búsqueda o cambia de módulo para volver a ver el editor y el panel de preview.
              </p>
            </section>
          )}
        </section>

        <section className="mt-6 grid gap-4 lg:grid-cols-3">
          <article className="rounded-[28px] border border-slate-800 bg-slate-900 p-5">
            <p className="text-lg font-semibold text-white">Single source of truth</p>
            <p className="mt-3 text-sm leading-7 text-slate-400">
              El catálogo describe permisos, opciones, método HTTP, route y preview de respuesta.
            </p>
          </article>

          <article className="rounded-[28px] border border-slate-800 bg-slate-900 p-5">
            <p className="text-lg font-semibold text-white">Client state isolated</p>
            <p className="mt-3 text-sm leading-7 text-slate-400">
              Validación, drafts, filtros y copy-to-clipboard viven en un hook dedicado y reutilizable.
            </p>
          </article>

          <article className="rounded-[28px] border border-slate-800 bg-slate-900 p-5">
            <p className="text-lg font-semibold text-white">Backend-friendly</p>
            <p className="mt-3 text-sm leading-7 text-slate-400">
              El preview JSON funciona como contrato visual para integrar `GET /api/status` y `POST /api/commands/execute`.
            </p>
          </article>
        </section>
      </div>
    </main>
  );
}
