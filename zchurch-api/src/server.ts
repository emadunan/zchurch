import dotenv from "dotenv";
import express from "express";
import bodyParser from "body-parser";

// Import routes
import bibleRoutes from "./handlers/bible";

// Extract environment variables
dotenv.config();
const { PORT } = process.env;

// Initialize express web server
const app = express();

// Configure Middleware
app.use(bodyParser.json());

// Register routes
app.use("/bible", bibleRoutes);

// Listen to requests
export default app.listen(PORT, () => {
    console.log(`Web server is running on port ${PORT}.`);
});
