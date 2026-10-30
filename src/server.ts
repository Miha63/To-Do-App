import express from "express";
import cors from "cors";
import swaggerUi from "swagger-ui-express";

import todoRoutes from "./routes/todoRoutes";
import { logger } from "./middleware/logger";
import { errorHandler } from "./middleware/errorHandler";
import { swaggerSpec } from "./swagger";

const app = express();

const PORT = 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(logger);

// Swagger
app.use(
    "/api-docs",
    swaggerUi.serve,
    swaggerUi.setup(swaggerSpec)
);

// Routes
app.use("/api/todos", todoRoutes);

// 404
app.use((req, res) => {
    res.status(404).json({
        error: "Route not found"
    });
});

// Global error handler
app.use(errorHandler);

// Start server
app.listen(PORT, () => {
    console.log(
        `Server is running on http://localhost:${PORT}`
    );

    console.log(
        `Swagger: http://localhost:${PORT}/api-docs`
    );
});