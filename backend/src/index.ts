import cors from "cors";
import express from "express";
import { errorHandler } from "./middleware/error-handler";
import { resultsRouter } from "./routers/results";

const app = express();

app.use(
  cors({
    origin: process.env.ALLOWED_ORIGINS?.split(",") || [],
  }),
);
app.use(express.json());

const router = express.Router();

/* health check path */
router.get("/", (_req, res) => {
  res.send("OK");
});

// api routers
app.use("/results", resultsRouter);

app.use(errorHandler);

export default app;
