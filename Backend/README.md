# Social Media Aggregator Backend

Express.js-based backend service that aggregates and caches social media data from an evaluation service.

## Project Overview

This backend service:
- Fetches and aggregates user posts and comments
- Implements caching with 5-minute TTL
- Provides RESTful endpoints for data access
- Uses TypeScript for type safety

## Project Structure

```
├── src/
│   ├── controllers/    # Request handlers
│   │   ├── posts.ts
│   │   └── users.ts
│   ├── services/      # Business logic & external API calls
│   │   ├── api.ts     # Evaluation service client
│   │   └── cache.ts   # In-memory cache implementation
│   ├── routes/        # API route definitions
│   │   ├── posts.ts
│   │   └── users.ts
│   ├── data/         # Data models & storage
│   │   └── raw_data.json
│   ├── app.ts        # Express app setup
│   └── server.ts     # Server entry point
├── dist/            # Compiled JavaScript output
└── node_modules/    # Dependencies
```

## API Endpoints

- `GET /users` - Returns top 5 users by comment count
- `GET /posts?type=popular` - Returns posts with highest comments
- `GET /posts?type=latest` - Returns 5 most recent posts
- `GET /health` - Service health check

## Key Features

1. **Intelligent Caching**
   - Initial data load on server start
   - 5-minute TTL for cached data
   - Fallback to cached data during API failures

2. **Error Handling**
   - Graceful degradation with cached data
   - Detailed error logging
   - User-friendly error messages

3. **Type Safety**
   - Full TypeScript implementation
   - Interface definitions for all data structures

## Getting Started

1. **Prerequisites**
   - Node.js (v14+)
   - Yarn package manager

2. **Installation**
   ```bash
   yarn install
   ```

3. **Development**
   ```bash
   yarn dev     # Start development server
   yarn build   # Build for production
   yarn start   # Run production server
   ```

## Environment Variables

Create `.env` file in project root:
```
PORT=3001
NODE_ENV=development
```

## Docker Support

```bash
# Build image
docker build -t social-media-backend .

# Run container
docker run -p 3001:3001 social-media-backend
```

## Error Handling

The service implements a robust error handling strategy:
- API timeouts: Returns cached data
- Service unavailable: 503 response with clear message
- Invalid requests: 400 response with validation details

## Caching Strategy

- Initial cache population on server start
- 5-minute TTL for all cached data
- Automatic cache invalidation
- File-based backup for cached data

## Performance Considerations

- Minimized API calls through caching
- Batch data loading at startup
- Rate limiting for external API calls
- Efficient memory usage with TTL-based cleanup
