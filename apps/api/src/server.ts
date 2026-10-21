import app from './app';
import pool from './config/database';
import { Request, Response } from 'express';

// á‹¨áˆžáŒáˆ áˆ«á‹á‰¶á‰½ áˆ›áˆµáˆ˜áŒ« (Imports)
import marketPricesRouter from './modules/markets/markets.routes';
import buyersRouter from './modules/buyers/buyers.routes';
import categoriesRouter from './modules/categories/categories.routes'; // á‹¨ categories áˆ«á‹á‰µ
import farmersRouter from './modules/farmers/farmers.routes';
import forecastsRouter from './modules/forecasts/forecasts.routes';
import inspectionsRouter from './modules/inspections/inspections.routes';



// á‹¨á‹³á‰³á‰¤á‹ áŒáŠ•áŠ™áŠá‰µ áˆ˜áˆžáŠ¨áˆªá‹« áˆ«á‹á‰µ (Test Route)
app.get('/api/test', async (req: Request, res: Response) => {
    try {
        const result = await pool.query('SELECT NOW()');
        res.json({ 
            message: 'SASM-IS Backend is connected to PostgreSQL!', 
            serverTime: result.rows[0].now 
        });
    } catch (err: unknown) {
        if (err instanceof Error) {
            console.error(err.message);
            res.status(500).send('Server Database Error: ' + err.message);
        } else {
            console.error('Unknown error', err);
            res.status(500).send('Server Database Error');
        }
    }
});

// á‹¨áˆžáŒáˆ áˆ«á‹á‰¶á‰½ áˆ›áŒˆáŠ“áŠ› (Routes Integration)
app.use('/api/market-prices', marketPricesRouter);
app.use('/api/buyers', buyersRouter);
app.use('/api/categories', categoriesRouter); // áŠ¥á‹šáˆ… áŒ‹áˆ­ á‹¨ categories áˆ«á‹á‰µ á‰°á‹«á‹­á‹Ÿáˆ
app.use('/api/farmers', farmersRouter);
app.use('/api/forecasts', forecastsRouter);
app.use('/api/inspections', inspectionsRouter);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
