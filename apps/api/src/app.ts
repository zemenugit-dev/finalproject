import ordersRouter from './modules/orders/orders.routes';
import inspectionsRouter from './modules/inspections/inspections.routes';
import ordersRouter from './modules/orders/orders.routes';
import usersRouter from './modules/users/users.routes';


import ordersRouter from './modules/orders/orders.routes';
import transportersRouter from './modules/transporters/transporters.routes';
import ordersRouter from './modules/orders/orders.routes';
import authRouter from './modules/auth/auth.routes';
import ordersRouter from './modules/orders/orders.routes';
import farmersRouter from './modules/farmers/farmers.routes';
import ordersRouter from './modules/orders/orders.routes';
import buyersRouter from './modules/buyers/buyers.routes';
import ordersRouter from './modules/orders/orders.routes';
import marketsRouter from './modules/markets/markets.routes';
import ordersRouter from './modules/orders/orders.routes';
import express, { Application } from 'express';
import ordersRouter from './modules/orders/orders.routes';
import cors from 'cors';
import ordersRouter from './modules/orders/orders.routes';
import productRoutes from './modules/products/products.routes';
import ordersRouter from './modules/orders/orders.routes';
import { getCategories, createCategory } from './modules/categories/categories.controller';

const app: Application = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use('/api/inspections', inspectionsRouter);

// API Routes
app.use('/api/products', productRoutes);
app.use('/api/auth', authRouter);

// Categories direct routes
app.get('/api/categories', getCategories);
app.post('/api/categories', createCategory);
app.use('/api/markets', marketsRouter);
app.use('/api/buyers', buyersRouter);
app.use('/api/farmers', farmersRouter);
app.use('/api/transporters', transportersRouter);
// API Routes
app.use('/api/users', usersRouter);

app.use('/api/orders', ordersRouter);

export default app;




