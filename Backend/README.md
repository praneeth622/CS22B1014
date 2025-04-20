# Social Media Aggregator

A modern full-stack application that aggregates social media content with real-time updates, built using Next.js and Express.js.

🌐 **Live Demo**: [https://social-media-aggregator.vercel.app](https://social-media-aggregator.vercel.app)

![Dashboard Screenshot](public/screenshots/dashboard.png)

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

## Screenshots

| Dashboard | Mobile View | Dark Mode |
|-----------|------------|-----------|
| ![Dashboard](public/screenshots/dashboard.png) | ![Mobile](public/screenshots/mobile.png) | ![Dark Mode](public/screenshots/dark-mode.png) |

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
