import app from "./index";

const PORT = 52863;
const HOST = "0.0.0.0";

app.listen(PORT, HOST, () => {
  console.log(`Started API on ${HOST}:${PORT} 🚀 ✨`);
});
