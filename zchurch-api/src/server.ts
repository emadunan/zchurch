import dotenv from "dotenv";
import express from "express";
import bodyParser from "body-parser";

// Import routes
import bibleRoutes from "./controllers/bible";
import expressionsRoutes from "./controllers/expression";

// Extract environment variables
dotenv.config();
const { PORT } = process.env;

// Initialize express web server
const app = express();

// Configure Middleware
app.use(bodyParser.json());

// Register routes
app.use("/bible", bibleRoutes);
app.use("/expressions", expressionsRoutes);

// Listen to requests
const applistener = app.listen(PORT, () => {
    console.log(`Web server is running on port ${PORT}.`);
});

export default applistener;
