import express, { Express } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import userRoutes from './routes/users';
import postRoutes from './routes/posts';

const app: Express = express();

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use("/users", userRoutes);
app.use("/posts", postRoutes);

// Health check route
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'UP' });
});

export default app; 