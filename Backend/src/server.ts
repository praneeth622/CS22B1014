import app from './app';
import { fetchAndStoreAllData } from './services/api';

const PORT = process.env.PORT || 3001;

// Start the server
const server = app.listen(PORT, async () => {
  console.log(`Server running on port ${PORT}`);
  
  try {
    // Fetch and store all data once at startup
    console.log("Loading data from the evaluation service...");
    const success = await fetchAndStoreAllData();
    
    if (success) {
      console.log("✅ Data loading complete. Server is ready!");
    } else {
      console.log("⚠️ Data loading had some issues. API responses may be incomplete.");
    }
  } catch (error) {
    console.error("Failed to load data:", error);
    console.log("⚠️ Server will attempt to use cached data if available.");
  }
});

// Handle graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM signal received: closing HTTP server');
  server.close(() => {
    console.log('HTTP server closed');
  });
});