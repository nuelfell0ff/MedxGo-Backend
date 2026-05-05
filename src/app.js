import express from 'express';
import authRoutes from './routes/authRoutes.js'
import restaurantRoutes from './routes/restaurantRoutes.js';
import menuRoutes from './routes/menuRoutes.js';
import orderRoutes from './routes/orderRoutes.js';
import paymentRoutes from './routes/paymentRoutes.js';

const app = express();

// middleware
app.use(express.json());
app.use('/api/auth', authRoutes);
app.use('/api/restaurants', restaurantRoutes);
app.use('/api/menu', menuRoutes);
app.use('/api/orders', orderRoutes);
app.use("/api/payment", paymentRoutes);

// test route
app.get('/', (req, res) => {
  res.send('API is running...');
});

export default app;