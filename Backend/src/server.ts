import app from './app';
import { preloadAllData } from './services/api';

const PORT = process.env.PORT || 3001;

// Start the server
const server = app.listen(PORT, async () => {
  console.log(`Server running on port ${PORT}`);
  
  try {
    // Preload all data
    console.log("Preloading all data from the evaluation service...");
    const success = await preloadAllData();
    
    if (success) {
      console.log("✅ Data preloading complete. Server is ready!");
    } else {
      console.log("⚠️ Data preloading had some issues. Server will fall back to on-demand fetching.");
    }
  } catch (error) {
    console.error("Failed to preload data:", error);
    console.log("⚠️ Server will fall back to on-demand fetching.");
  }
});

// Handle graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM signal received: closing HTTP server');
  server.close(() => {
    console.log('HTTP server closed');
  });
});