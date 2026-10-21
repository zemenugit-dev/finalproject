
import React, { useEffect, useState } from "react";
import {
  fetchMarketPrices,
  type MarketPrice,
} from "./marketPricesApi";
import PriceTrendChart from "../../components/PriceTrendChart";
import type { PriceTrend } from "../../components/PriceTrendChart";
const MarketPricesPage: React.FC = () => {
  const [prices, setPrices] = useState<MarketPrice[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    let cancelled = false;

    async function loadMarketPrices() {
      setLoading(true);
      setError("");

      try {
        const data = await fetchMarketPrices();

        if (!cancelled) {
          setPrices(data);
        }
      } catch (err) {
        console.error("Failed to load market prices:", err);

        if (!cancelled) {
          setError(
            err instanceof Error
              ? err.message
              : "Unable to load market prices. Please try again."
          );
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    void loadMarketPrices();

    return () => {
      cancelled = true;
    };
  }, [reloadKey]);

  // Convert the existing API data into the chart's format.
  const chartData: PriceTrend[] = prices
    .map((item) => ({
      date: String(item.date),
      price: Number(item.pricePerKg),
    }))
    .filter(
      (item) =>
        item.date.length > 0 &&
        Number.isFinite(item.price) &&
        item.price >= 0
    )
    .sort((a, b) => a.date.localeCompare(b.date));

  const cellStyle: React.CSSProperties = {
    padding: "12px",
    borderBottom: "1px solid #e5e7eb",
    textAlign: "left",
  };

  return (
    <section
      style={{
        padding: "24px",
        maxWidth: "1200px",
        margin: "0 auto",
        fontFamily: "Arial, sans-serif",
        color: "#1f2937",
      }}
    >
      <h2>Smart Agricultural Market Prices</h2>

      <p>
        View agricultural market prices across regions of Ethiopia.
      </p>

      {loading && (
        <p role="status">Loading market prices...</p>
      )}

      {!loading && error && (
        <div
          role="alert"
          style={{
            padding: "16px",
            backgroundColor: "#fef2f2",
            color: "#991b1b",
            borderRadius: "8px",
            marginTop: "16px",
          }}
        >
          <p>
            <strong>Unable to load market prices.</strong>
          </p>
          <p>{error}</p>

          <button
            type="button"
            onClick={() => setReloadKey((key) => key + 1)}
            style={{
              padding: "10px 16px",
              border: "none",
              borderRadius: "6px",
              backgroundColor: "#166534",
              color: "white",
              cursor: "pointer",
            }}
          >
            Try Again
          </button>
        </div>
      )}

      {!loading && !error && prices.length === 0 && (
        <p>
          No market prices are available yet.
          Prices will appear here when data is available.
        </p>
      )}

      {!loading && !error && prices.length > 0 && (
        <>
          {/* Market price trend chart */}
          <div style={{ marginTop: "24px", marginBottom: "28px" }}>
            <PriceTrendChart
              data={chartData}
              title="Agricultural Market Price Trends"
            />
          </div>

          {/* Existing market prices table */}
          <div style={{ overflowX: "auto", marginTop: "20px" }}>
            <table
              style={{
                width: "100%",
                borderCollapse: "collapse",
                backgroundColor: "white",
              }}
            >
              <thead>
                <tr style={{ backgroundColor: "#ecfdf5" }}>
                  <th style={cellStyle}>Crop Name</th>
                  <th style={cellStyle}>Region</th>
                  <th style={cellStyle}>Price per Kg (ETB)</th>
                  <th style={cellStyle}>Date</th>
                </tr>
              </thead>

              <tbody>
                {prices.map((item) => (
                  <tr key={item.id}>
                    <td style={cellStyle}>{item.cropName}</td>
                    <td style={cellStyle}>{item.region}</td>
                    <td style={cellStyle}>
                      {item.pricePerKg} ETB
                    </td>
                    <td style={cellStyle}>{item.date}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </section>
  );
};

export default MarketPricesPage;
