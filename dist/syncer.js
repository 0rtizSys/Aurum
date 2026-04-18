"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.cmds = void 0;
const ping_js_1 = require("./commands/utils/ping.js");
const sync_slash_js_1 = require("./commands/developer/sync_slash.js");
const wallet_js_1 = require("./commands/economy/public/wallet.js");
const add_balance_js_1 = require("./commands/economy/moderators/add_balance.js");
const work_js_1 = require("./commands/economy/public/work.js");
const set_cd_time_admin_js_1 = require("./commands/economy/admin/set_cd_time.admin.js");
exports.cmds = [
    ping_js_1.pingSlash,
    sync_slash_js_1.syncSlash,
    //* ECONOMY COGS
    wallet_js_1.get_wallet_balance,
    add_balance_js_1.add_balance,
    work_js_1.work_command,
    set_cd_time_admin_js_1.set_cd_time_admin
];
