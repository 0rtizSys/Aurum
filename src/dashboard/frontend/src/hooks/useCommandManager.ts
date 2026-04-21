import { useDeferredValue, useMemo, useState } from "react";
import type {
  CommandDefinition,
  CommandDraft,
  CommandErrorMap,
  CommandFieldValue,
  DashboardErrorState,
  ModuleFilter,
  PreparedCommandState,
} from "../types/dashboard";

function buildDefaultDraft(command: CommandDefinition): CommandDraft {
  return command.options.reduce<CommandDraft>((draft, option) => {
    draft[option.id] = option.defaultValue;
    return draft;
  }, {});
}

function buildInitialDrafts(commands: CommandDefinition[]) {
  return commands.reduce<Record<string, CommandDraft>>((drafts, command) => {
    drafts[command.id] = buildDefaultDraft(command);
    return drafts;
  }, {});
}

function validateDraft(command: CommandDefinition, draft: CommandDraft): CommandErrorMap {
  const errors: CommandErrorMap = {};

  command.options.forEach((field) => {
    const rawValue = draft[field.id];

    if (field.type === "number") {
      const hasEmptyValue = rawValue === "" || rawValue === undefined || rawValue === null;

      if (field.required && hasEmptyValue) {
        errors[field.id] = "Este campo es obligatorio.";
        return;
      }

      if (hasEmptyValue) {
        return;
      }

      const numericValue = Number(rawValue);

      if (Number.isNaN(numericValue)) {
        errors[field.id] = "Ingresa un numero valido.";
        return;
      }

      if (field.min !== undefined && numericValue < field.min) {
        errors[field.id] = `Debe ser mayor o igual a ${field.min}.`;
      }

      if (field.max !== undefined && numericValue > field.max) {
        errors[field.id] = `Debe ser menor o igual a ${field.max}.`;
      }

      return;
    }

    if (field.type === "boolean") {
      return;
    }

    const textValue = String(rawValue ?? "").trim();

    if (field.required && textValue.length === 0) {
      errors[field.id] = "Este campo es obligatorio.";
      return;
    }

    if (field.minLength !== undefined && textValue.length < field.minLength) {
      errors[field.id] = `Debe tener al menos ${field.minLength} caracteres.`;
    }

    if (field.maxLength !== undefined && textValue.length > field.maxLength) {
      errors[field.id] = `Debe tener maximo ${field.maxLength} caracteres.`;
    }
  });

  return errors;
}

function buildPayloadPreview(command: CommandDefinition, draft: CommandDraft) {
  const options = Object.fromEntries(
    command.options.map((field) => [field.id, draft[field.id] ?? field.defaultValue]),
  );

  return JSON.stringify(
    {
      commandId: command.id,
      slash: command.slash,
      transport: {
        method: command.method,
        route: command.route,
      },
      context: {
        requiresGuild: command.requiresGuild,
        audience: command.audience,
        module: command.module,
      },
      options,
    },
    null,
    2,
  );
}

function formatPreparedSummary(command: CommandDefinition, draft: CommandDraft) {
  if (command.options.length === 0) {
    return `${command.slash} listo para conectarse sin parametros.`;
  }

  const snapshot = command.options
    .map((field) => `${field.id}: ${String(draft[field.id])}`)
    .join(" | ");

  return `${command.slash} preparado con ${snapshot}`;
}

export function useCommandManager(commands: CommandDefinition[]) {
  const [moduleFilter, setModuleFilter] = useState<ModuleFilter>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCommandId, setSelectedCommandId] = useState(commands[0]?.id ?? "");
  const [drafts, setDrafts] = useState<Record<string, CommandDraft>>(() =>
    buildInitialDrafts(commands),
  );
  const [errorsByCommand, setErrorsByCommand] = useState<DashboardErrorState>({});
  const [preparedByCommand, setPreparedByCommand] = useState<Record<string, PreparedCommandState>>(
    {},
  );
  const [copiedCommandId, setCopiedCommandId] = useState<string | null>(null);

  const deferredSearch = useDeferredValue(searchQuery);

  const filteredCommands = useMemo(() => {
    const normalizedSearch = deferredSearch.trim().toLowerCase();

    return commands.filter((command) => {
      const matchesModule = moduleFilter === "all" || command.module === moduleFilter;
      const matchesSearch =
        normalizedSearch.length === 0 ||
        command.title.toLowerCase().includes(normalizedSearch) ||
        command.slash.toLowerCase().includes(normalizedSearch) ||
        command.description.toLowerCase().includes(normalizedSearch) ||
        command.tags.some((tag) => tag.toLowerCase().includes(normalizedSearch));

      return matchesModule && matchesSearch;
    });
  }, [commands, deferredSearch, moduleFilter]);

  const hasVisibleCommands = filteredCommands.length > 0;

  const selectedCommand =
    filteredCommands.find((command) => command.id === selectedCommandId) ??
    filteredCommands[0] ??
    commands[0];

  const activeDraft = selectedCommand
    ? drafts[selectedCommand.id] ?? buildDefaultDraft(selectedCommand)
    : {};

  const activeErrors = selectedCommand ? errorsByCommand[selectedCommand.id] ?? {} : {};
  const payloadPreview = selectedCommand ? buildPayloadPreview(selectedCommand, activeDraft) : "";
  const preparedState = selectedCommand ? preparedByCommand[selectedCommand.id] : undefined;

  function updateField(fieldId: string, value: CommandFieldValue) {
    if (!selectedCommand) {
      return;
    }

    setDrafts((currentDrafts) => ({
      ...currentDrafts,
      [selectedCommand.id]: {
        ...(currentDrafts[selectedCommand.id] ?? buildDefaultDraft(selectedCommand)),
        [fieldId]: value,
      },
    }));

    setErrorsByCommand((currentErrors) => {
      const nextFieldErrors = { ...(currentErrors[selectedCommand.id] ?? {}) };
      delete nextFieldErrors[fieldId];

      return {
        ...currentErrors,
        [selectedCommand.id]: nextFieldErrors,
      };
    });
  }

  function resetDraft() {
    if (!selectedCommand) {
      return;
    }

    setDrafts((currentDrafts) => ({
      ...currentDrafts,
      [selectedCommand.id]: buildDefaultDraft(selectedCommand),
    }));

    setErrorsByCommand((currentErrors) => ({
      ...currentErrors,
      [selectedCommand.id]: {},
    }));
  }

  function prepareDraft() {
    if (!selectedCommand) {
      return false;
    }

    const nextErrors = validateDraft(selectedCommand, activeDraft);

    setErrorsByCommand((currentErrors) => ({
      ...currentErrors,
      [selectedCommand.id]: nextErrors,
    }));

    if (Object.keys(nextErrors).length > 0) {
      return false;
    }

    setPreparedByCommand((currentState) => ({
      ...currentState,
      [selectedCommand.id]: {
        payload: payloadPreview,
        summary: formatPreparedSummary(selectedCommand, activeDraft),
        timestamp: new Intl.DateTimeFormat("es-MX", {
          dateStyle: "medium",
          timeStyle: "short",
        }).format(new Date()),
      },
    }));

    return true;
  }

  async function copyPayload() {
    if (!selectedCommand || !payloadPreview || typeof navigator === "undefined") {
      return false;
    }

    try {
      await navigator.clipboard.writeText(payloadPreview);
      setCopiedCommandId(selectedCommand.id);

      window.setTimeout(() => {
        setCopiedCommandId((currentValue) =>
          currentValue === selectedCommand.id ? null : currentValue,
        );
      }, 1400);

      return true;
    } catch (error) {
      console.error("Clipboard copy failed:", error);
      return false;
    }
  }

  return {
    moduleFilter,
    setModuleFilter,
    searchQuery,
    setSearchQuery,
    selectedCommandId,
    setSelectedCommandId,
    filteredCommands,
    hasVisibleCommands,
    selectedCommand,
    activeDraft,
    activeErrors,
    payloadPreview,
    preparedState,
    copiedCommandId,
    updateField,
    resetDraft,
    prepareDraft,
    copyPayload,
  };
}
