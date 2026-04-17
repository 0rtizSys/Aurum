import { pingSlash } from "./commands/utils/ping.js"
import { syncSlash } from "./commands/developer/sync_slash.js"

import { get_wallet_balance } from "./commands/economy/public/wallet.js"
import { add_balance } from "./commands/economy/moderators/add_balance.js"
import { work_command } from "./commands/economy/public/work.js"
export const cmds = [
    pingSlash,
    syncSlash,

    //* ECONOMY COGS
    get_wallet_balance,
    add_balance,
    work_command
]