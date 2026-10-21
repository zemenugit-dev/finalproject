import React from 'react';
import MarketPricesPage from './features/market-prices/MarketPricesPage';

function App() {
  return (
    <div>
      <header style={{ backgroundColor: '#2c3e50', color: 'white', padding: '15px', textAlign: 'center' }}>
        <h1>SASM-IS: Smart Agricultural Supply Market Information System</h1>
      </header>
      <main>
        <MarketPricesPage />
      </main>
    </div>
  );
}

export default App;