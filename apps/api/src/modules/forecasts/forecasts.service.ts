import { ForecastsRepository } from './forecasts.repository';
import { ForecastQuery } from './forecasts.schema';
type HistoricalObservation = {
    price: number | string;
    recorded_at: string;
};
export class ForecastsService {
    private forecastsRepository: ForecastsRepository;
    constructor() {
        this.forecastsRepository = new ForecastsRepository();
    }
    async getForecasts(filters: ForecastQuery) {
        const prices =
            await this.forecastsRepository.findCurrentPrices(filters);
        return prices.map((row) => {
            const currentPrice = Number(row.current_price);
            const observations: HistoricalObservation[] = Array.isArray(
                row.historical_observations
            )
                ? row.historical_observations
                    .map((item: HistoricalObservation) => ({
                        price: Number(item.price),
                        recorded_at: item.recorded_at,
                    }))
                    .filter(
                        (item: HistoricalObservation) =>
                            Number.isFinite(item.price) &&
                            Number.isFinite(Date.parse(item.recorded_at))
                    )
                : [];
            let forecastPrice = currentPrice;
            let method = 'naive_baseline';
            let confidence = 'low';
            let historicalDataAvailable = false;
            let message =
                'The latest current price is used as the baseline because ' +
                'there are not enough observations spanning multiple days.';
            const uniqueDays = new Set(
                observations.map((item) =>
                    new Date(item.recorded_at).toISOString().slice(0, 10)
                )
            );
            if (observations.length >= 2 && uniqueDays.size >= 2) {
                const firstTime = Date.parse(observations[0].recorded_at);
                const lastTime = Date.parse(
                    observations[observations.length - 1].recorded_at
                );
                const elapsedDays =
                    (lastTime - firstTime) / (1000 * 60 * 60 * 24);
                if (elapsedDays > 0) {
                    const firstPrice = Number(observations[0].price);
                    const lastPrice = Number(
                        observations[observations.length - 1].price
                    );
                    const dailyChange =
                        (lastPrice - firstPrice) / elapsedDays;
                    const prediction =
                        currentPrice + dailyChange * filters.days;
                    if (Number.isFinite(prediction)) {
                        forecastPrice = Math.max(
                            0,
                            Math.round(prediction * 100) / 100
                        );
                        method = 'timestamp_linear_trend';
                        historicalDataAvailable = true;
                        confidence = uniqueDays.size >= 7 ? 'medium' : 'low';
                        message =
                            'Experimental estimate based on observed price ' +
                            'changes over elapsed time. More historical data ' +
                            'and validation are needed for reliable use.';
                    }
                }
            }
            return {
                product_id: row.product_id,
                product_name: row.product_name,
                market_id: row.market_id,
                market_name: row.market_name,
                current_price: currentPrice,
                forecast_price: forecastPrice,
                forecast_days: filters.days,
                method,
                confidence,
                historical_data_available: historicalDataAvailable,
                historical_observations: observations.length,
                message,
                last_updated: row.updated_at,
            };
        });
    }
}

