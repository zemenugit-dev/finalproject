// Market Prices API service
const API_BASE_URL = 'http://localhost:5000/api';

export interface MarketPrice {
  id: string;
  cropName: string;
  region: string;
  pricePerKg: number;
  date: string;
}

export async function fetchMarketPrices(): Promise<MarketPrice[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/market-prices`);
    if (!response.ok) {
      throw new Error('Failed to fetch market prices');
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching market prices:', error);
    // ለሙከራ የሚሆን (Fallback) ዴታ
    return [
      { id: '1', cropName: 'Teff (White)', region: 'Amhara', pricePerKg: 65.00, date: '2026-10-20' },
      { id: '2', cropName: 'Maize', region: 'Oromia', pricePerKg: 32.50, date: '2026-10-20' },
      { id: '3', cropName: 'Wheat', region: 'Sidama', pricePerKg: 45.00, date: '2026-10-20' }
    ];
  }
}