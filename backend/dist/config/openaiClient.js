"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getOpenAIClient = void 0;
const openai_1 = __importDefault(require("openai"));
const env_1 = require("./env");
let client = null;
const getOpenAIClient = () => {
    if (!env_1.env.OPENAI_API_KEY) {
        return null;
    }
    if (!client) {
        client = new openai_1.default({
            apiKey: env_1.env.OPENAI_API_KEY,
        });
    }
    return client;
};
exports.getOpenAIClient = getOpenAIClient;
//# sourceMappingURL=openaiClient.js.map