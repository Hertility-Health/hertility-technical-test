import express from "express";
import cors from "cors";
import { resultsRouter } from "./routers/results";

const PORT = 52863;
const HOST = "0.0.0.0";

function main() {
    const app = express();

    app.use(cors());
    app.use(express.json());

    const router = express.Router();

    /* health check path */
    router.get("/", (_req, res) => {
        res.send("OK");
    });

   // api routers
   app.use("/results", resultsRouter); 

    app.listen(PORT, HOST, () => {
        console.log(`Started API on ${HOST}:${PORT} 🚀 ✨`);
    });
}

main();
