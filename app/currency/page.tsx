'use client';

import React, { useState, useEffect } from 'react';
import MainLayout from '../../components/layout/MainLayout';

interface CurrencyRate {
  code: string;
  name: string;
  symbol: string;
  rateToUSD: number;
  lastUpdated: string;
  change24h: number;
  flag: string;
}

interface Conversion {
  from: string;
  to: string;
  amount: number;
  result: number;
  rate: number;
  timestamp: string;
}

export default function CurrencyPage() {
  const [currencies, setCurrencies] = useState<CurrencyRate[]>([]);
  const [fromCurrency, setFromCurrency] = useState('USD');
  const [toCurrency, setToCurrency] = useState('BHD');
  const [amount, setAmount] = useState('1000');
  const [recentConversions, setRecentConversions] = useState<Conversion[]>([]);

  useEffect(() => {
    // Initialize currency rates
    const rates: CurrencyRate[] = [
      {
        code: 'USD',
        name: 'US Dollar',
        symbol: '$',
        rateToUSD: 1.000,
        lastUpdated: new Date().toISOString(),
        change24h: 0,
        flag: '🇺🇸'
      },
      {
        code: 'BHD',
        name: 'Bahraini Dinar',
        symbol: 'BD',
        rateToUSD: 0.377, // Pegged rate
        lastUpdated: new Date().toISOString(),
        change24h: 0, // Pegged, no change
        flag: '🇧🇭'
      },
      {
        code: 'EUR',
        name: 'Euro',
        symbol: '€',
        rateToUSD: 1.085,
        lastUpdated: new Date().toISOString(),
        change24h: 0.23,
        flag: '🇪🇺'
      },
      {
        code: 'GBP',
        name: 'British Pound',
        symbol: '£',
        rateToUSD: 1.265,
        lastUpdated: new Date().toISOString(),
        change24h: -0.15,
        flag: '🇬🇧'
      },
      {
        code: 'INR',
        name: 'Indian Rupee',
        symbol: '₹',
        rateToUSD: 0.012,
        lastUpdated: new Date().toISOString(),
        change24h: 0.08,
        flag: '🇮🇳'
      },
      {
        code: 'AED',
        name: 'UAE Dirham',
        symbol: 'AED',
        rateToUSD: 0.272, // Pegged
        lastUpdated: new Date().toISOString(),
        change24h: 0,
        flag: '🇦🇪'
      },
      {
        code: 'SAR',
        name: 'Saudi Riyal',
        symbol: 'SAR',
        rateToUSD: 0.267, // Pegged
        lastUpdated: new Date().toISOString(),
        change24h: 0,
        flag: '🇸🇦'
      },
      {
        code: 'KWD',
        name: 'Kuwaiti Dinar',
        symbol: 'KD',
        rateToUSD: 3.250,
        lastUpdated: new Date().toISOString(),
        change24h: 0.05,
        flag: '🇰🇼'
      }
    ];
    setCurrencies(rates);

    // Load recent conversions from localStorage
    const saved = localStorage.getItem('recentConversions');
    if (saved) {
      setRecentConversions(JSON.parse(saved));
    }
  }, []);

  const convert = (from: string, to: string, amt: number): number => {
    const fromRate = currencies.find(c => c.code === from)?.rateToUSD || 1;
    const toRate = currencies.find(c => c.code === to)?.rateToUSD || 1;
    return (amt * fromRate) / toRate;
  };

  const handleConvert = () => {
    const amt = parseFloat(amount);
    if (isNaN(amt)) return;

    const result = convert(fromCurrency, toCurrency, amt);
    const fromRate = currencies.find(c => c.code === fromCurrency)?.rateToUSD || 1;
    const toRate = currencies.find(c => c.code === toCurrency)?.rateToUSD || 1;

    const conversion: Conversion = {
      from: fromCurrency,
      to: toCurrency,
      amount: amt,
      result: result,
      rate: fromRate / toRate,
      timestamp: new Date().toISOString()
    };

    const updated = [conversion, ...recentConversions.slice(0, 9)];
    setRecentConversions(updated);
    localStorage.setItem('recentConversions', JSON.stringify(updated));
    
    // Also store as last conversion for quick access
    localStorage.setItem('lastCurrencyConversion', JSON.stringify(conversion));
  };
  
  const applyToQuote = (conversion: Conversion) => {
    // Store conversion for use in quotations
    localStorage.setItem('quoteCurrencyConversion', JSON.stringify(conversion));
    alert(`Conversion applied!\n${conversion.from} ${conversion.amount.toLocaleString()} = ${conversion.to} ${conversion.result.toFixed(2)}\n\nNavigating to Quotations...`);
    setTimeout(() => {
      window.location.href = '/quotations';
    }, 1500);
  };

  const swapCurrencies = () => {
    setFromCurrency(toCurrency);
    setToCurrency(fromCurrency);
  };

  const getConversionResult = () => {
    const amt = parseFloat(amount);
    if (isNaN(amt)) return null;
    return convert(fromCurrency, toCurrency, amt);
  };

  const formatCurrency = (value: number, currencyCode: string): string => {
    const currency = currencies.find(c => c.code === currencyCode);
    return `${currency?.symbol || ''}${value.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  return (
    <MainLayout>
      <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
        <div style={{ marginBottom: '30px' }}>
          <h1 style={{ fontSize: '32px', fontWeight: 'bold', marginBottom: '5px' }}>
            Multi-Currency Exchange
          </h1>
          <p style={{ color: '#6c757d', fontSize: '14px' }}>
            Real-time currency conversion for international trading
          </p>
        </div>

        {/* Currency Converter */}
        <div style={{
          backgroundColor: 'white',
          borderRadius: '12px',
          padding: '30px',
          marginBottom: '30px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
        }}>
          <h2 style={{ fontSize: '20px', fontWeight: '600', marginBottom: '25px' }}>
            Currency Converter
          </h2>

          <div style={{ display: 'flex', gap: '20px', alignItems: 'flex-end', flexWrap: 'wrap' }}>
            <div style={{ flex: 1, minWidth: '200px' }}>
              <label style={{ display: 'block', fontSize: '13px', marginBottom: '8px', color: '#495057' }}>
                Amount
              </label>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                style={{
                  width: '100%',
                  padding: '12px',
                  border: '2px solid #e9ecef',
                  borderRadius: '8px',
                  fontSize: '18px',
                  fontWeight: '500'
                }}
              />
            </div>

            <div style={{ flex: 1, minWidth: '150px' }}>
              <label style={{ display: 'block', fontSize: '13px', marginBottom: '8px', color: '#495057' }}>
                From
              </label>
              <select
                value={fromCurrency}
                onChange={(e) => setFromCurrency(e.target.value)}
                style={{
                  width: '100%',
                  padding: '12px',
                  border: '2px solid #e9ecef',
                  borderRadius: '8px',
                  fontSize: '16px',
                  cursor: 'pointer'
                }}
              >
                {currencies.map(curr => (
                  <option key={curr.code} value={curr.code}>
                    {curr.flag} {curr.code} - {curr.name}
                  </option>
                ))}
              </select>
            </div>

            <button
              onClick={swapCurrencies}
              style={{
                padding: '12px',
                backgroundColor: '#f8f9fa',
                border: '1px solid #dee2e6',
                borderRadius: '8px',
                cursor: 'pointer',
                fontSize: '20px'
              }}
              title="Swap currencies"
            >
              ⇄
            </button>

            <div style={{ flex: 1, minWidth: '150px' }}>
              <label style={{ display: 'block', fontSize: '13px', marginBottom: '8px', color: '#495057' }}>
                To
              </label>
              <select
                value={toCurrency}
                onChange={(e) => setToCurrency(e.target.value)}
                style={{
                  width: '100%',
                  padding: '12px',
                  border: '2px solid #e9ecef',
                  borderRadius: '8px',
                  fontSize: '16px',
                  cursor: 'pointer'
                }}
              >
                {currencies.map(curr => (
                  <option key={curr.code} value={curr.code}>
                    {curr.flag} {curr.code} - {curr.name}
                  </option>
                ))}
              </select>
            </div>

            <button
              onClick={handleConvert}
              style={{
                padding: '12px 24px',
                backgroundColor: '#28a745',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                fontSize: '16px',
                fontWeight: '500',
                cursor: 'pointer'
              }}
            >
              Convert
            </button>
          </div>

          {/* Conversion Result */}
          {getConversionResult() !== null && (
            <div style={{
              marginTop: '30px',
              padding: '20px',
              backgroundColor: '#e7f5ff',
              borderRadius: '8px',
              border: '1px solid #74c0fc'
            }}>
              <div style={{ textAlign: 'center' }}>
                <p style={{ fontSize: '14px', color: '#1864ab', marginBottom: '10px' }}>
                  Conversion Result
                </p>
                <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#1864ab' }}>
                  {formatCurrency(parseFloat(amount), fromCurrency)}
                  <span style={{ margin: '0 15px', fontSize: '24px', color: '#495057' }}>→</span>
                  {formatCurrency(getConversionResult()!, toCurrency)}
                </div>
                <p style={{ fontSize: '14px', color: '#1971c2', marginTop: '10px' }}>
                  Rate: 1 {fromCurrency} = {(convert(fromCurrency, toCurrency, 1)).toFixed(4)} {toCurrency}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Exchange Rates Grid */}
        <div style={{
          backgroundColor: 'white',
          borderRadius: '12px',
          padding: '20px',
          marginBottom: '30px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
        }}>
          <h2 style={{ fontSize: '20px', fontWeight: '600', marginBottom: '20px' }}>
            Current Exchange Rates (vs USD)
          </h2>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
            gap: '15px'
          }}>
            {currencies.filter(c => c.code !== 'USD').map(currency => (
              <div key={currency.code} style={{
                padding: '15px',
                border: '1px solid #e9ecef',
                borderRadius: '8px',
                backgroundColor: currency.change24h === 0 ? '#f8f9fa' : 'white'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <span style={{ fontSize: '24px' }}>{currency.flag}</span>
                    <div>
                      <p style={{ fontSize: '16px', fontWeight: '600', margin: 0 }}>
                        {currency.code}
                      </p>
                      <p style={{ fontSize: '12px', color: '#6c757d', margin: 0 }}>
                        {currency.name}
                      </p>
                    </div>
                  </div>
                  {currency.change24h === 0 ? (
                    <span style={{
                      padding: '3px 8px',
                      backgroundColor: '#e9ecef',
                      color: '#495057',
                      borderRadius: '4px',
                      fontSize: '11px'
                    }}>
                      PEGGED
                    </span>
                  ) : (
                    <span style={{
                      padding: '3px 8px',
                      backgroundColor: currency.change24h > 0 ? '#d4edda' : '#f8d7da',
                      color: currency.change24h > 0 ? '#155724' : '#721c24',
                      borderRadius: '4px',
                      fontSize: '11px'
                    }}>
                      {currency.change24h > 0 ? '↑' : '↓'} {Math.abs(currency.change24h)}%
                    </span>
                  )}
                </div>
                <div style={{ fontSize: '20px', fontWeight: 'bold' }}>
                  {currency.symbol}1 = ${(1 / currency.rateToUSD).toFixed(4)}
                </div>
                <div style={{ fontSize: '12px', color: '#6c757d', marginTop: '5px' }}>
                  1 USD = {currency.symbol}{(1 / (1 / currency.rateToUSD)).toFixed(4)}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Conversions */}
        {recentConversions.length > 0 && (
          <div style={{
            backgroundColor: 'white',
            borderRadius: '12px',
            padding: '20px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
          }}>
            <h2 style={{ fontSize: '20px', fontWeight: '600', marginBottom: '20px' }}>
              Recent Conversions
            </h2>

            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ borderBottom: '2px solid #e9ecef' }}>
                    <th style={{ padding: '12px', textAlign: 'left', fontSize: '12px', fontWeight: '600' }}>From</th>
                    <th style={{ padding: '12px', textAlign: 'left', fontSize: '12px', fontWeight: '600' }}>To</th>
                    <th style={{ padding: '12px', textAlign: 'left', fontSize: '12px', fontWeight: '600' }}>Rate</th>
                    <th style={{ padding: '12px', textAlign: 'left', fontSize: '12px', fontWeight: '600' }}>Time</th>
                    <th style={{ padding: '12px', textAlign: 'left', fontSize: '12px', fontWeight: '600' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {recentConversions.slice(0, 5).map((conv, idx) => (
                    <tr key={idx} style={{ borderBottom: '1px solid #f8f9fa' }}>
                      <td style={{ padding: '12px', fontSize: '14px' }}>
                        {formatCurrency(conv.amount, conv.from)} {conv.from}
                      </td>
                      <td style={{ padding: '12px', fontSize: '14px', fontWeight: '500' }}>
                        {formatCurrency(conv.result, conv.to)} {conv.to}
                      </td>
                      <td style={{ padding: '12px', fontSize: '14px' }}>
                        {conv.rate.toFixed(4)}
                      </td>
                      <td style={{ padding: '12px', fontSize: '12px', color: '#6c757d' }}>
                        {new Date(conv.timestamp).toLocaleTimeString()}
                      </td>
                      <td style={{ padding: '12px' }}>
                        <button
                          onClick={() => applyToQuote(conv)}
                          style={{
                            padding: '4px 12px',
                            backgroundColor: '#007bff',
                            color: 'white',
                            border: 'none',
                            borderRadius: '4px',
                            fontSize: '11px',
                            cursor: 'pointer'
                          }}
                        >
                          Apply to Quote
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Important Notice */}
        <div style={{
          marginTop: '20px',
          padding: '15px',
          backgroundColor: '#fff3cd',
          borderRadius: '8px',
          border: '1px solid #ffeeba'
        }}>
          <p style={{ fontSize: '13px', color: '#856404', margin: 0 }}>
            <strong>📌 Important:</strong> BHD, AED, and SAR are pegged to USD at fixed rates. 
            EUR, GBP, INR, and KWD rates fluctuate daily. 
            For large transactions, always verify current market rates.
          </p>
        </div>
      </div>
    </MainLayout>
  );
}