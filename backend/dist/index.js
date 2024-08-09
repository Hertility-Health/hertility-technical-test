"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const routers_1 = require("./routers");
const PORT = 52863;
const HOST = "0.0.0.0";
function main() {
    const app = (0, express_1.default)();
    app.use(express_1.default.json());
    const router = express_1.default.Router();
    /* health check path */
    router.get("/", (_req, res) => {
        res.send({});
    });
    // api routers
    app.use("/report", routers_1.reportRouter);
    app.listen(PORT, HOST, () => {
        console.log(`Started API on ${HOST}:${PORT} 🚀 ✨`);
    });
}
main();
//# sourceMappingURL=index.js.map