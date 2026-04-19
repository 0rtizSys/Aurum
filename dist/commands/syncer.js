"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.cmds = void 0;
const ping_js_1 = require("./utils/ping.js");
const sync_slash_js_1 = require("./developer/sync_slash.js");
exports.cmds = [ping_js_1.pingSlash, sync_slash_js_1.syncSlash];
