"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = require("./app");
const env_1 = require("./config/env");
const port = env_1.env.PORT;
app_1.app.listen(port, () => {
    console.log(`Movement Safety API listening on port ${port}`);
});
//# sourceMappingURL=server.js.map