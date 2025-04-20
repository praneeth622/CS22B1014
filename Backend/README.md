# Social Media Aggregation Backend

A microservice backend built with Express.js (TypeScript) that aggregates data from a social media API.

## Features

- **Caching with TTL**: Minimize API calls with time-based expiration (5 minutes)
- **RESTful API**: Clean endpoints for accessing data
- **Data Aggregation**: Intelligent handling of remote data 

## API Endpoints

- `GET /users`: Returns the top 5 most engaging users based on comment counts
- `GET /posts?type=popular`: Returns posts with the highest number of comments
- `GET /posts?type=latest`: Returns the 5 most recent posts (by ID)
- `GET /health`: Health check endpoint

## Setup

1. Install dependencies:
   ```
   npm install
   ```

2. Start the development server:
   ```
   npm run dev
   ```

3. Build for production:
   ```
   npm run build
   ```

## Implementation Details

- **Caching Strategy**: In-memory storage with TTL (5 minutes)
- **API Cost Minimization**: Only fetch from remote API when cache is stale
- **Data Freshness**: Automatic invalidation of stale data

## Technologies

- TypeScript
- Express.js
- Axios
- CORS
- Helmet (Security) 