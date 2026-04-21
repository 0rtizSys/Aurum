// shared/heartbeat.ts
import { Client } from "discord.js";

export interface BotHeartbeat {
  status: 'online' | 'offline' | 'maintenance';
  last_heartbeat: number; // Timestamp en milisegundos
  bot_tag: string;
  version: string;
}

export const HEARTBEAT_PATH = '/home/j0srd3v/last_heartbeat.json';

export function startHearthBeat(client: Client){
    
}