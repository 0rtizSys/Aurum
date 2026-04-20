// ? =========================
// ? Utils
// ? =========================

import { pingSlash } from "./commands/utils/ping.js";

// ! =========================
// ! Development
// ! =========================

import { syncSlash } from "./commands/dev/sync_slash.js";

// * =========================
// * Economy - Public
// * =========================

import { getWalletBalance } from "./commands/economy/public/wallet.js";
import { workCommand } from "./commands/economy/public/work.js";
import { getBankBalance } from "./commands/economy/public/bank.js";

// * =========================
// * Economy - Moderators
// * =========================

import { addBalance } from "./commands/economy/moderators/add_balance.js";

// * =========================
// * Economy - Admin
// * =========================

import { setCdTimeAdmin } from "./commands/economy/admin/set_cd_time.admin.js";
import { setEconomySymbolAdmin } from "./commands/economy/admin/set_eco_symbol.admin.js";

// ! =========================
// ! Command Registry
// ! =========================

export const cmds = [
  // ? Utils
  pingSlash,

  // ! Development
  syncSlash,

  // * Economy - Public
  getWalletBalance,
  workCommand,
  getBankBalance,

  // * Economy - Moderators
  addBalance,

  // * Economy - Admin
  setCdTimeAdmin,
  setEconomySymbolAdmin,
];
