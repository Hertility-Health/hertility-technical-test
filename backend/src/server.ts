import app from "./index";

const PORT = Number(process.env.PORT) || 52863;
const HOST = process.env.HOST || "0.0.0.0";

app.listen(PORT, HOST, () => {
  console.log(`Started API on ${HOST}:${PORT} 🚀 ✨`);
});
