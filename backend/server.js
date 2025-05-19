const express = require('express');
const dotenv = require('dotenv');
const path = require('path');
const connectDB = require('./config/db');
const authRoutes = require('./routes/auth');
const agentRoutes = require('./routes/agent');
const listRoutes = require('./routes/lists');
const cors = require('cors');

dotenv.config({ path: path.resolve(__dirname, '.env') });

const requiredEnv = ['MONGO_URI', 'JWT_SECRET', 'ADMIN_SECRET'];
const missingEnv = requiredEnv.filter((env) => !process.env[env]);
if (missingEnv.length > 0) {
  console.error(`Error: Missing environment variables: ${missingEnv.join(', ')}`);
  process.exit(1);
}

connectDB();

const app = express();
app.use(cors({
  origin: [
        "https://task-distributer.onrender.com", // Correct frontend URL
        "http://localhost:5173", // Local dev
        "http://localhost:3000", // For serve -s dist
        "http://localhost:4173" // For npm run preview
        ],
  methods: "GET, POST, PUT, DELETE, PATCH, HEAD",
  credentials: true
}));
app.use(express.json());
app.use('/api/auth', authRoutes);
app.use('/api/agents', agentRoutes);
app.use('/api/lists', listRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
