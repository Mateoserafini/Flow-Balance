import app from "./app.js";
import { connectDB } from "./config/db.js";
import "./config/env.js";


const PORT = process.env.PORT;

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server is running on port ${"http://localhost:" + PORT}`);
  });
});