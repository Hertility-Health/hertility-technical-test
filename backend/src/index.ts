import cors from "cors";
import express from "express";
import { errorHandler } from "./middleware/error-handler";
import { resultsRouter } from "./routers/results";

const PORT = 52863;
const HOST = "0.0.0.0";

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

app.use(errorHandler);

app.listen(PORT, HOST, () => {
  console.log(`Started API on ${HOST}:${PORT} 🚀 ✨`);
});

export default app;
