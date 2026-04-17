"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.error_icon = exports.emb_color = void 0;
const embed_configs_json_1 = __importDefault(require("./embed_configs.json"));
//* exporting especifico settings
exports.emb_color = parseInt(embed_configs_json_1.default.embed_conf.color);
exports.error_icon = "https://i.imgur.com/Yztr9JE.png";
