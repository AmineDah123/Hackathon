require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');

// Configs and Middlewares
const corsOptions = require('./config/cors');
const { globalLimiter } = require('./config/rateLimit');
const errorHandler = require('./middlewares/errorHandler');

// Routes
const statusRoutes = require('./routes/statusRoutes');
const groupRoutes = require('./routes/groupRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors(corsOptions));
app.options(/.*/, cors(corsOptions)); // Handle preflight for all routes
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Apply global limiter to ALL routes
app.use(globalLimiter);

// Register Routes
app.use('/api/status', statusRoutes);
app.use('/api/groups', groupRoutes);

// Global Error Handler
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Hackathon API running on http://localhost:${PORT}`);
});