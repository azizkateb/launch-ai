import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import generateRoute from "./routes/generate.js";
import exportRoute from "./routes/export.js";
import path from "path";

dotenv.config();

const app = express();

app.use(cors());
// Increase JSON/body size limit to allow image uploads as base64 in requests
const bodyLimit = process.env.BODY_LIMIT || "25mb";
app.use(express.json({ limit: bodyLimit }));
app.use(express.urlencoded({ limit: bodyLimit, extended: true }));

// Serve uploaded images and exported projects
app.use('/uploads', express.static(path.join(process.cwd(), 'public', 'uploads')));
app.use('/exports', express.static(path.join(process.cwd(), 'public', 'exports')));

app.use("/api/generate", generateRoute);
app.use("/api/export", exportRoute);

const PORT = 5000;

app.listen(PORT, () => {
  console.log(`Server running on ${PORT}`);
});