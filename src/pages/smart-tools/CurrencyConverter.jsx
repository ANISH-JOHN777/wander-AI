import { useTripContext } from '../../context/TripContext';
import { Navigate, Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { ArrowLeftRight, TrendingUp, DollarSign } from 'lucide-react';
import './CurrencyConverter.css';

// Mock exchange rates (in a real app, these would come from an API)
const EXCHANGE_RATES = {
    INR: { USD: 0.012, EUR: 0.011, GBP: 0.0095, JPY: 1.79, AUD: 0.018, CAD: 0.016, SGD: 0.016, AED: 0.044, INR: 1 },
    USD: { INR: 83.12, EUR: 0.92, GBP: 0.79, JPY: 149.50, AUD: 1.52, CAD: 1.36, SGD: 1.35, AED: 3.67, USD: 1 },
    EUR: { INR: 90.45, USD: 1.09, GBP: 0.86, JPY: 162.80, AUD: 1.66, CAD: 1.48, SGD: 1.47, AED: 4.00, EUR: 1 },
    GBP: { INR: 105.26, USD: 1.27, EUR: 1.16, JPY: 189.50, AUD: 1.93, CAD: 1.72, SGD: 1.71, AED: 4.65, GBP: 1 },
};

const CURRENCIES = [
    { code: 'INR', name: 'Indian Rupee', symbol: '₹' },
    { code: 'USD', name: 'US Dollar', symbol: '$' },
    { code: 'EUR', name: 'Euro', symbol: '€' },
    { code: 'GBP', name: 'British Pound', symbol: '£' },
    { code: 'JPY', name: 'Japanese Yen', symbol: '¥' },
    { code: 'AUD', name: 'Australian Dollar', symbol: 'A$' },
    { code: 'CAD', name: 'Canadian Dollar', symbol: 'C$' },
    { code: 'SGD', name: 'Singapore Dollar', symbol: 'S$' },
    { code: 'AED', name: 'UAE Dirham', symbol: 'د.إ' },
];

const CurrencyConverter = () => {
    const { activeTrip } = useTripContext();
    const [amount, setAmount] = useState(1000);
    const [fromCurrency, setFromCurrency] = useState('INR');
    const [toCurrency, setToCurrency] = useState('USD');
    const [convertedAmount, setConvertedAmount] = useState(0);
    const [exchangeRate, setExchangeRate] = useState(0);

    useEffect(() => {
        const rate = EXCHANGE_RATES[fromCurrency]?.[toCurrency] || 0;
        setExchangeRate(rate);
        setConvertedAmount(amount * rate);
    }, [amount, fromCurrency, toCurrency]);

    const swapCurrencies = () => {
        setFromCurrency(toCurrency);
        setToCurrency(fromCurrency);
    };

    const getSymbol = (code) => {
        return CURRENCIES.find(c => c.code === code)?.symbol || code;
    };

    if (!activeTrip) {
        return <Navigate to="/trip-creator" replace />;
    }

    return (
        <div className="currency-converter-page">
            <div className="module-header">
                <div>
                    <h1><DollarSign size={32} /> Currency Converter</h1>
                    <p className="module-subtitle">Convert currency for {activeTrip.destination}</p>
                </div>
                <Link to="/smart-tools" className="btn btn-secondary">
                    Back to Smart Tools
                </Link>
            </div>

            <div className="search-criteria">
                <h3>Trip Information</h3>
                <div className="criteria-grid">
                    <div className="criteria-item">
                        <span className="criteria-label">Destination:</span>
                        <span className="criteria-value">{activeTrip.destination}</span>
                    </div>
                    <div className="criteria-item">
                        <span className="criteria-label">Trip Duration:</span>
                        <span className="criteria-value">
                            {activeTrip.startDate} to {activeTrip.endDate}
                        </span>
                    </div>
                    <div className="criteria-item">
                        <span className="criteria-label">Travelers:</span>
                        <span className="criteria-value">{activeTrip.travelers || 1}</span>
                    </div>
                </div>
            </div>

            <div className="converter-container">
                <div className="converter-card">
                    <h3>Convert Currency</h3>

                    <div className="converter-inputs">
                        <div className="currency-input-group">
                            <label>From</label>
                            <div className="input-row">
                                <input
                                    type="number"
                                    value={amount}
                                    onChange={(e) => setAmount(parseFloat(e.target.value) || 0)}
                                    className="amount-input"
                                    min="0"
                                    step="0.01"
                                />
                                <select
                                    value={fromCurrency}
                                    onChange={(e) => setFromCurrency(e.target.value)}
                                    className="currency-select"
                                >
                                    {CURRENCIES.map(currency => (
                                        <option key={currency.code} value={currency.code}>
                                            {currency.code} - {currency.name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        <button className="swap-button" onClick={swapCurrencies}>
                            <ArrowLeftRight size={24} />
                        </button>

                        <div className="currency-input-group">
                            <label>To</label>
                            <div className="input-row">
                                <input
                                    type="number"
                                    value={convertedAmount.toFixed(2)}
                                    readOnly
                                    className="amount-input converted"
                                />
                                <select
                                    value={toCurrency}
                                    onChange={(e) => setToCurrency(e.target.value)}
                                    className="currency-select"
                                >
                                    {CURRENCIES.map(currency => (
                                        <option key={currency.code} value={currency.code}>
                                            {currency.code} - {currency.name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>
                    </div>

                    <div className="exchange-rate-display">
                        <TrendingUp size={20} />
                        <span>
                            1 {fromCurrency} = {exchangeRate.toFixed(4)} {toCurrency}
                        </span>
                    </div>

                    <div className="conversion-result">
                        <div className="result-text">
                            {getSymbol(fromCurrency)}{amount.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} =
                            {getSymbol(toCurrency)}{convertedAmount.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </div>
                    </div>
                </div>

                <div className="quick-conversions">
                    <h3>Quick Conversions</h3>
                    <div className="quick-conversion-grid">
                        {[100, 500, 1000, 5000, 10000].map(value => {
                            const converted = value * exchangeRate;
                            return (
                                <div key={value} className="quick-conversion-card" onClick={() => setAmount(value)}>
                                    <div className="quick-amount">{getSymbol(fromCurrency)}{value.toLocaleString('en-IN')}</div>
                                    <div className="quick-equals">=</div>
                                    <div className="quick-converted">{getSymbol(toCurrency)}{converted.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CurrencyConverter;
