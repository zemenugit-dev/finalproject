
import express, { Application } from 'express';
import cors from 'cors';

import inspectionsRouter from './modules/inspections/inspections.routes';
import usersRouter from './modules/users/users.routes';
import transportersRouter from './modules/transporters/transporters.routes';
import authRouter from './modules/auth/auth.routes';
import farmersRouter from './modules/farmers/farmers.routes';
import buyersRouter from './modules/buyers/buyers.routes';
import marketsRouter from './modules/markets/markets.routes';
import productRoutes from './modules/products/products.routes';
import ordersRouter from './modules/orders/orders.routes';
import ussdRouter from './modules/ussd/ussd.routes';
import trackingRouter from './modules/tracking/tracking.routes';
import reportsRouter from './modules/reports/reports.routes';
import auditRouter from './modules/audit/audit.routes';
import routesRouter from './routes/routes.routes';

import {
  getCategories,
  createCategory
} from './modules/categories/categories.controller';

const app: Application = express();

// Middleware
app.use(cors());
app.use(express.json());

// API routes
app.use('/api/inspections', inspectionsRouter);
app.use('/api/products', productRoutes);
app.use('/api/auth', authRouter);
app.use('/api/markets', marketsRouter);
app.use('/api/buyers', buyersRouter);
app.use('/api/farmers', farmersRouter);
app.use('/api/transporters', transportersRouter);
app.use('/api/users', usersRouter);
app.use('/api/orders', ordersRouter);
app.use('/api/ussd', ussdRouter);
app.use('/api/tracking', trackingRouter);
app.use('/api/reports', reportsRouter);
app.use('/api/audit', auditRouter);
app.use('/api/routes', routesRouter);


// Category routes
app.get('/api/categories', getCategories);
app.post('/api/categories', createCategory);

export default app;
