import path from "path";
import express from "express";
import dotenv from "dotenv";
import cors from "cors";
dotenv.config();
import cookieParser from "cookie-parser";
import { notFound, errorHandler } from "./middleware/errorMiddleware.js";
import connectDB from "./config/db.js";
const port = process.env.PORT;
import userRoutes from "./routes/userRoutes.js";
import userStatusRoutes from "./routes/userStatusRoutes.js";
import UserMealPlanRoutes from "./routes/UserMealPlanRoutes.js";
import analyticsRoutes from "./routes/analytics.js";
import notificationRoutes from "./routes/notifications.js";
import { register } from "./metrics/index.js";
import { httpRequestDuration } from './metrics/index.js';
import swaggerUi from 'swagger-ui-express';
import swaggerJsdoc from 'swagger-jsdoc';
import SwaggerOptions from './utils/swagger.js';

connectDB();

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const frontendUrls = [
  'http://localhost:3000',         // Local dev
  'https://frontend.localhost',    // Docker/Traefik
  'https://app.fitnics.space',     // Production
  'https://fitnics.space',
  'http://localhost:9000',         // Swagger UI local
  'https://backend.fitnics.space'  // Swagger UI production
];

const corsOptions = {
  origin: frontendUrls,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: [
    'Content-Type',
    'Authorization',
    'Cache-Control',
    'Expires',
    'Pragma',
    'auth_token'
  ],
};

app.use(cors(corsOptions));
app.options('*', cors(corsOptions));
app.use(cookieParser());

app.use((req, res, next) => {
  const end = httpRequestDuration.startTimer();

  res.on('finish', () => {
    end({
      method: req.method,
      route: req.route?.path || req.path,
      code: res.statusCode,
    });
  });

  next();
});

app.use("/api/users", userRoutes);
app.use("/api/user", userStatusRoutes);
app.use("/api/user", UserMealPlanRoutes);
app.use("/api/analytics", analyticsRoutes);
app.use("/api/notifications", notificationRoutes);

app.get("/", (req, res) => res.send("Server is ready"));

app.get('/metrics', async (_req, res) => {
  res.setHeader('Content-Type', register.contentType);
  res.send(await register.metrics());
});

const specs = swaggerJsdoc(SwaggerOptions);

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));

app.use(notFound);
app.use(errorHandler);

app.listen(port, () => console.log(`Server started on port ${port}`));

export default app;
