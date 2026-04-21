/**
 * ARCHIVO: commandCatalog.ts
 * DESCRIPCIÓN: Este es el "Single Source of Truth" (Única fuente de verdad).
 * Aquí defines la metadata de los comandos de Discord para que el Dashboard 
 * sepa cómo renderizar formularios, validar inputs y qué endpoints disparar.
 */

import type { CommandDefinition, CommandModuleMeta } from "../types/dashboard";

/**
 * 1. MÓDULOS DEL SISTEMA
 * Define las categorías en las que se agrupan los comandos en el Sidebar/Filtros.
 */
export const commandModules: CommandModuleMeta[] = [
  {
    id: "utility",
    label: "Utility",
    shortLabel: "Utils",
    description: "Diagnóstico rápido y salud general del bot.",
  },
  {
    id: "economy-public",
    label: "Economy Public",
    shortLabel: "Public",
    description: "Comandos que usan los miembros para jugar con la economía.",
  },
  {
    id: "economy-moderation",
    label: "Economy Moderation",
    shortLabel: "Moderation",
    description: "Ajustes manuales para balances y operaciones sensibles.",
  },
  {
    id: "economy-admin",
    label: "Economy Admin",
    shortLabel: "Admin",
    description: "Configuraciones de servidor para símbolos y cooldowns.",
  },
  {
    id: "developer",
    label: "Developer",
    shortLabel: "Dev",
    description: "Herramientas privadas para sincronización y mantenimiento.",
  },
];

/**
 * 2. ETIQUETAS DE AUDIENCIA
 * Mapeo de IDs técnicos a nombres legibles para las Badges de la UI.
 */
export const audienceLabels = {
  public: "Publico",
  moderation: "Moderacion",
  admin: "Administrador",
  owner: "Owner",
} as const;

/**
 * 3. ESTADOS DE DISPONIBILIDAD
 * Ayuda a saber si un comando ya se puede usar desde el panel o si el
 * backend aún no está listo para recibir esa petición.
 */
export const availabilityLabels = {
  "bot-live": "Activo en bot",      // Ya funciona en Discord
  "dashboard-ready": "Listo para panel", // El front ya lo soporta
  "pending-backend": "Pendiente backend", // Falta crear la ruta en el bot
} as const;

/**
 * 4. CATÁLOGO MAESTRO DE COMANDOS
 * Aquí vive la configuración de cada Slash Command.
 */
export const commandCatalog: CommandDefinition[] = [
  // --- COMANDO: PING ---
  {
    id: "ping",                         // ID interno único
    slash: "/ping",                     // Comando real en Discord
    title: "Latency Probe",
    description: "Mide latencia del mensaje y ping del websocket para validar salud del bot.",
    module: "utility",
    audience: "public",
    availability: "dashboard-ready",
    method: "POST",                     // Verbo HTTP para la API
    route: "/api/commands/execute",     // Endpoint en tu server de Node.js
    requiresGuild: false,               // ¿Se puede usar en DMs?
    tags: ["health", "latency", "diagnostic"],
    notes: [
      "No requiere parametros.",
      "Responde con el tiempo del mensaje y el ping de Discord API.",
    ],
    responsePreviewTitle: "Pong",
    responsePreview: "Latency 42ms · API 65ms", // Lo que vería el usuario en Discord
    options: [],                        // No tiene argumentos (inputs)
  },

  // --- COMANDO: WORK ---
  {
    id: "work",
    slash: "/work",
    title: "Work Reward",
    description: "Genera una ganancia aleatoria para el usuario respetando cooldown por servidor.",
    module: "economy-public",
    audience: "public",
    availability: "dashboard-ready",
    method: "POST",
    route: "/api/commands/execute",
    requiresGuild: true,                // Obligatorio estar en un servidor
    tags: ["economy", "cooldown", "earnings"],
    notes: [
      "Usa el simbolo configurado en el servidor.",
      "Respeta cooldown y puede responder de forma publica o privada.",
    ],
    responsePreviewTitle: "Work",
    responsePreview: "@user earned $350",
    options: [
      {
        id: "visibility",               // ID de la prop que se enviará al backend
        label: "Public visibility",
        description: "Permite que otros vean la ganancia.",
        type: "boolean",                // Renderiza un Toggle/Switch
        defaultValue: false,
      },
    ],
  },

  // --- COMANDO: ADD BALANCE (Moderación) ---
  {
    id: "add_balance",
    slash: "/add_balance",
    title: "Add Balance",
    description: "Agrega dinero a wallet o bank para un usuario, con validacion de permisos y limites.",
    module: "economy-moderation",
    audience: "admin",
    availability: "dashboard-ready",
    method: "POST",
    route: "/api/commands/execute",
    requiresGuild: true,
    tags: ["economy", "admin", "wallet", "bank"],
    notes: [
      "Requiere permisos de administrador.",
      "El monto debe estar entre 1 y 1,000,000,000.",
    ],
    responsePreviewTitle: "Added Balance",
    responsePreview: "@mod added $1,000 to @target",
    options: [
      {
        id: "method",
        label: "Destination",
        description: "Selecciona si el dinero cae en wallet o bank.",
        type: "select",                 // Renderiza un Menú Desplegable
        defaultValue: "wallet",
        required: true,
        options: [                      // Opciones específicas del Select
          { label: "Wallet", value: "wallet" },
          { label: "Bank", value: "bank" },
        ],
      },
      {
        id: "amount",
        label: "Amount",
        description: "Cantidad de dinero a sumar.",
        type: "number",                 // Input numérico con validación min/max
        defaultValue: 1000,
        required: true,
        min: 1,
        max: 1_000_000_000,
      },
      {
        id: "user",
        label: "Target user",
        description: "Usuario que recibira el balance.",
        type: "user",                   // Input especial (menciona usuario)
        defaultValue: "",
        required: true,
        placeholder: "@member",
      },
      {
        id: "visibility",
        label: "Public visibility",
        description: "Permite que otros vean la operacion.",
        type: "boolean",
        defaultValue: false,
      },
    ],
  },

  // --- COMANDO: SET ECONOMY SYMBOL (Ajustes) ---
  {
    id: "set_economy_symbol",
    slash: "/set_economy_symbol",
    title: "Set Economy Symbol",
    description: "Actualiza el simbolo economico del servidor y muestra el valor anterior y nuevo.",
    module: "economy-admin",
    audience: "admin",
    availability: "dashboard-ready",
    method: "PATCH",                    // PATCH porque solo actualizamos una parte del config
    route: "/api/settings/economy/symbol",
    requiresGuild: true,
    tags: ["economy", "settings", "branding"],
    notes: [
      "El simbolo solo admite 1 o 2 caracteres.",
      "Conviene exponerlo en un endpoint de configuracion reutilizable.",
    ],
    responsePreviewTitle: "Configuration Saved",
    responsePreview: "Old symbol: $ · New symbol: AU",
    options: [
      {
        id: "symbol",
        label: "Symbol",
        description: "Nuevo simbolo economico del servidor.",
        type: "text",
        defaultValue: "AU",
        required: true,
        minLength: 1,
        maxLength: 2,
        placeholder: "AU",
      },
    ],
  },

  // --- COMANDO: SYNC SLASH GUILD (Dev Only) ---
  {
    id: "sync_slash_guild",
    slash: "/sync_slash_guild",
    title: "Sync Slash Guild",
    description: "Limpia duplicados y vuelve a sincronizar los slash commands solo para la guild.",
    module: "developer",
    audience: "owner",
    availability: "dashboard-ready",
    method: "POST",
    route: "/api/commands/execute",
    requiresGuild: true,
    tags: ["developer", "sync", "deployment"],
    notes: [
      "Solo debe estar disponible para OWNER_ID.",
      "Es ideal para un panel privado de mantenimiento.",
    ],
    responsePreviewTitle: "Guild Synchronized",
    responsePreview: "Guild sincronizada con 8 comandos",
    options: [], // Sin parámetros, acción directa
  },
];