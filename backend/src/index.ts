import express from "express";
import { reportRouter } from "./routers";

const PORT = 52863;
const HOST = "0.0.0.0";

function main() {
    const app = express();

    app.use(express.json());

    const router = express.Router();

    /* health check path */
    router.get("/", (_req, res) => {
        res.send({});
    });

    // api routers
    app.use("/report", reportRouter);

    app.listen(PORT, HOST, () => {
        console.log(`Started API on ${HOST}:${PORT} 🚀 ✨`);
    });
}

main();
