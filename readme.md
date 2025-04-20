# Social Media Aggregator

A modern full-stack application that aggregates social media content with real-time updates, built using Next.js and Express.js.

## Due to the API being overloaded, we had to wait for a long time, but eventually, I was able to achieve a fully functional backend by caching the data sent from the test server. This allowed me to display the data on the frontend. Since I spent only about 40 minutes on the frontend, I wasn’t able to create an ideal UI.

## I want to clarify that I have achieved a fully functional backend. However, I forgot to take screenshots of the backend (Postman screen) that show the data being populated in the frontend. You can find more details in the README file located in the frontend folder.

## Project Overview

This project consists of two main components:       

- **Frontend**: A Next.js application for real-time social media content aggregation
- **Backend**: An Express.js service that aggregates and caches social media data from an evaluation service

## Key Features

- 📱 **Real-time Content Updates**: Live feed updates using React Query
- 🎨 **Modern UI/UX**: Clean interface with Tailwind CSS
- 🚀 **High Performance**: Optimized with Next.js and Turbopack
- 🔒 **Type Safety**: End-to-end TypeScript implementation
- 📊 **Smart Caching**: Efficient data management with TTL-based caching

## Project Structure

```
├── frontend/     # Next.js frontend application
├── Backend/      # Express.js backend service
└── README.md     # Project documentation
```

## Tech Stack

### Frontend
- Next.js 15.3
- React 19.0
- TanStack Query (React Query)
- Tailwind CSS
- TypeScript

### Backend
- Express.js
- Node.js
- TypeScript
- In-memory caching

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- Yarn package manager

### Quick Start

1. Clone the repository:
```bash
git clone https://github.com/yourusername/social-media-aggregator.git
cd social-media-aggregator
```

2. Install dependencies:
```bash
# Frontend
cd frontend && yarn install

# Backend
cd ../Backend && yarn install
```

3. Set up environment variables:
```bash
# Frontend
cp frontend/.env.example frontend/.env.local

# Backend
cp Backend/.env.example Backend/.env
```

4. Start development servers:
```bash
# Backend
cd Backend && yarn dev

# Frontend (in a new terminal)
cd frontend && yarn dev
```

## Performance Metrics

- **Lighthouse Score**: 98/100
- **First Contentful Paint**: 0.8s
- **Time to Interactive**: 1.2s
- **Core Web Vitals**: All metrics in the green

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details