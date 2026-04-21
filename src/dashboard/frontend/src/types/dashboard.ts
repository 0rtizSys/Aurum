export type CommandModule =
  | "utility"
  | "economy-public"
  | "economy-moderation"
  | "economy-admin"
  | "developer";

export type CommandAudience = "public" | "moderation" | "admin" | "owner";

export type CommandAvailability = "bot-live" | "dashboard-ready" | "pending-backend";

export type CommandFieldType = "text" | "number" | "boolean" | "select" | "user";

export type CommandFieldValue = string | number | boolean;
export type ModuleFilter = CommandModule | "all";
export type CommandErrorMap = Record<string, string>;

export interface CommandFieldOption {
  label: string;
  value: string;
}

export interface CommandFieldDefinition {
  id: string;
  label: string;
  description: string;
  type: CommandFieldType;
  defaultValue: CommandFieldValue;
  required?: boolean;
  placeholder?: string;
  options?: CommandFieldOption[];
  unit?: string;
  min?: number;
  max?: number;
  minLength?: number;
  maxLength?: number;
}

export interface CommandDefinition {
  id: string;
  slash: string;
  title: string;
  description: string;
  module: CommandModule;
  audience: CommandAudience;
  availability: CommandAvailability;
  method: "GET" | "POST" | "PATCH";
  route: string;
  requiresGuild: boolean;
  tags: string[];
  notes: string[];
  responsePreviewTitle: string;
  responsePreview: string;
  options: CommandFieldDefinition[];
}

export interface CommandModuleMeta {
  id: CommandModule;
  label: string;
  shortLabel: string;
  description: string;
}

export type CommandDraft = Record<string, CommandFieldValue>;
export type ApiState = "checking" | "online" | "offline";

export interface PreparedCommandState {
  payload: string;
  summary: string;
  timestamp: string;
}

export type DashboardErrorState = Record<string, CommandErrorMap>;
