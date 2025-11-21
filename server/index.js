import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath, pathToFileURL } from 'url'; // 👈 ADD pathToFileURL

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const app = express();

// Serve frontend build
app.use(express.static(path.join(__dirname, "../client/build")));

// Serve index.html for all other routes (for client-side routing)
app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "../client/build", "index.html"));
});

// --- Server Listening Logic (Fixes the Crash and Loop) ---

// 1. Correctly determine if the script is the main entry point
// We convert the file path in process.argv[1] (a string) to a URL for comparison.
const isMainModule = import.meta.url === pathToFileURL(process.argv[1]).href;

// Only start listening if this is the main process and not being run by tests
if (process.env.NODE_ENV !== 'test' && isMainModule) {
    
    // Initialize dotenv to load .env file contents
    dotenv.config(); 

    // Set port
    const PORT = process.env.PORT || 5000;
    
    // Start the server and keep the process alive
    app.listen(PORT, () => {
        console.log(`✅ Server is running on http://localhost:${PORT}`);
    });
}

export default app; // Export app for testing purposes