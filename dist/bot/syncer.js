"use strict";
// ? =========================
// ? Utils
// ? =========================
Object.defineProperty(exports, "__esModule", { value: true });
exports.cmds = void 0;
const ping_js_1 = require("./commands/utils/ping.js");
// ! =========================
// ! Development
// ! =========================
const sync_slash_js_1 = require("./commands/developer/sync_slash.js");
// * =========================
// * Economy - Public
// * =========================
const wallet_js_1 = require("./commands/economy/public/wallet.js");
const work_js_1 = require("./commands/economy/public/work.js");
// * =========================
// * Economy - Moderators
// * =========================
const add_balance_js_1 = require("./commands/economy/moderators/add_balance.js");
// * =========================
// * Economy - Admin
// * =========================
const set_cd_time_admin_js_1 = require("./commands/economy/admin/set_cd_time.admin.js");
const set_eco_symbol_admin_js_1 = require("./commands/economy/admin/set_eco_symbol.admin.js");
// ! =========================
// ! Command Registry
// ! =========================
exports.cmds = [
    // ? Utils
    ping_js_1.pingSlash,
    // ! Development
    sync_slash_js_1.syncSlash,
    // * Economy - Public
    wallet_js_1.getWalletBalance,
    work_js_1.workCommand,
    // * Economy - Moderators
    add_balance_js_1.addBalance,
    // * Economy - Admin
    set_cd_time_admin_js_1.setCdTimeAdmin,
    set_eco_symbol_admin_js_1.setEconomySymbolAdmin,
];
