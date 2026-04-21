import type { CommandDefinition, CommandErrorMap, CommandFieldDefinition, CommandFieldValue } from "../../types/dashboard";
import { Badge } from "../ui/Badge";
import { Button } from "../ui/Button";
import { Input } from "../ui/Input";
import { Select } from "../ui/Select";

interface CommandEditorProps {
  command?: CommandDefinition;
  draft: Record<string, CommandFieldValue>;
  errors: CommandErrorMap;
  onFieldChange: (fieldId: string, value: CommandFieldValue) => void;
  onReset: () => void;
  onPrepare: () => void;
}

function FieldControl({
  field,
  value,
  error,
  onChange,
}: {
  field: CommandFieldDefinition;
  value: CommandFieldValue;
  error?: string;
  onChange: (value: CommandFieldValue) => void;
}) {
  return (
    <div className="rounded-[28px] border border-slate-800 bg-slate-950 p-4">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <label className="text-sm font-semibold text-white">{field.label}</label>
          <p className="mt-2 text-sm leading-7 text-slate-400">{field.description}</p>
        </div>
        <Badge tone={field.required ? "active" : "muted"}>
          {field.required ? "Required" : "Optional"}
        </Badge>
      </div>

      <div className="mt-4">
        {field.type === "select" ? (
          <Select
            value={String(value)}
            onChange={(event) => onChange(event.target.value)}
          >
            {field.options?.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </Select>
        ) : null}

        {field.type === "boolean" ? (
          <div className="grid gap-3 sm:grid-cols-2">
            {[
              { label: "Visible", value: true },
              { label: "Private", value: false },
            ].map((choice) => (
              <Button
                key={choice.label}
                variant={value === choice.value ? "primary" : "secondary"}
                className="w-full justify-start rounded-2xl normal-case tracking-[0.02em]"
                onClick={() => onChange(choice.value)}
              >
                {choice.label}
              </Button>
            ))}
          </div>
        ) : null}

        {field.type === "text" || field.type === "user" ? (
          <Input
            value={String(value)}
            placeholder={field.placeholder}
            onChange={(event) => onChange(event.target.value)}
          />
        ) : null}

        {field.type === "number" ? (
          <Input
            type="number"
            min={field.min}
            max={field.max}
            value={typeof value === "number" || value === "" ? value : ""}
            placeholder={field.placeholder}
            onChange={(event) =>
              onChange(event.target.value === "" ? "" : Number(event.target.value))
            }
          />
        ) : null}
      </div>

      {field.unit ? (
        <p className="mt-3 text-[11px] font-medium uppercase tracking-[0.24em] text-slate-500">
          {field.unit}
        </p>
      ) : null}

      {error ? <p className="mt-3 text-sm text-slate-300">{error}</p> : null}
    </div>
  );
}

export function CommandEditor({
  command,
  draft,
  errors,
  onFieldChange,
  onReset,
  onPrepare,
}: CommandEditorProps) {
  if (!command) {
    return (
      <section className="rounded-[32px] border border-dashed border-slate-800 bg-slate-900 p-8 text-sm leading-7 text-slate-400">
        No hay comando disponible para editar.
      </section>
    );
  }

  return (
    <section className="rounded-[32px] border border-slate-800 bg-slate-900 p-6">
      <div className="flex flex-col gap-4 border-b border-slate-800 pb-6 lg:flex-row lg:items-start lg:justify-between">
        <div className="max-w-3xl">
          <div className="flex flex-wrap gap-2">
            <Badge tone="active">{command.slash}</Badge>
            <Badge tone="muted">{command.method}</Badge>
            <Badge tone="muted">{command.requiresGuild ? "Guild required" : "Global safe"}</Badge>
          </div>

          <h2 className="mt-4 text-3xl font-semibold text-white">{command.title}</h2>
          <p className="mt-4 text-sm leading-7 text-slate-400">{command.description}</p>
        </div>

        <div className="rounded-[24px] border border-slate-800 bg-slate-950 p-4 text-sm text-slate-400">
          <p className="text-[11px] font-medium uppercase tracking-[0.28em] text-slate-500">
            Transport
          </p>
          <p className="mt-3 font-medium text-white">
            {command.method} {command.route}
          </p>
        </div>
      </div>

      <div className="mt-6 grid gap-4 md:grid-cols-2">
        {command.notes.map((note) => (
          <div
            key={note}
            className="rounded-[24px] border border-slate-800 bg-slate-950 px-4 py-4 text-sm leading-7 text-slate-400"
          >
            {note}
          </div>
        ))}
      </div>

      <div className="mt-6 flex flex-wrap gap-3">
        <Button variant="secondary" onClick={onReset}>
          Reset
        </Button>
        <Button variant="primary" onClick={onPrepare}>
          Prepare payload
        </Button>
      </div>

      <div className="mt-6 space-y-4">
        {command.options.length > 0 ? (
          command.options.map((field) => (
            <FieldControl
              key={field.id}
              field={field}
              value={draft[field.id] ?? field.defaultValue}
              error={errors[field.id]}
              onChange={(value) => onFieldChange(field.id, value)}
            />
          ))
        ) : (
          <div className="rounded-[28px] border border-dashed border-slate-800 bg-slate-950 px-5 py-8 text-sm leading-7 text-slate-400">
            Este comando no necesita formulario. Ya está listo para conectarse a una acción directa de backend.
          </div>
        )}
      </div>
    </section>
  );
}
