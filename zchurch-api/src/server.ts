import http from "http";
import express from "express";
import * as dotenv from "dotenv";
import bodyParser from "body-parser";

import { errorHandler, pageNotFoundHandler } from "./controllers/error";

/** Import app controllers' routes */
import authRoutes from "./routes/auth";
import bibleRoutes from "./routes/bible";
import expressionsRoutes from "./routes/expression";

// Extract environment variables
dotenv.config();
const { PORT } = process.env;

// Initialize express web server
const app = express();
const server = http.createServer(app);

// Configure Middleware
app.use(bodyParser.json());

// Register routes
app.use("/auth", authRoutes);
app.use("/bible", bibleRoutes);
app.use("/expressions", expressionsRoutes);

// Handle Errors
app.use(pageNotFoundHandler);
app.use(errorHandler);

// Listen to requests
server.listen(PORT, () => {
    console.log(`🚀 Server running on http://127.0.0.1:${PORT}`);
});

export default server;
