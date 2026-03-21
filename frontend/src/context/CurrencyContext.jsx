import React, { createContext, useContext, useState, useEffect } from 'react';

const CurrencyContext = createContext();

export const CurrencyProvider = ({ children }) => {
  const [currency, setCurrency] = useState(() => {
    const saved = localStorage.getItem('currency');
    return saved || 'INR';
  });

  const exchangeRate = 83; // 1 USD = 83 INR (Mock)

  useEffect(() => {
    localStorage.setItem('currency', currency);
  }, [currency]);

  const formatPrice = (priceInINR) => {
    if (currency === 'USD') {
      return `$${(priceInINR / exchangeRate).toFixed(2)}`;
    }
    return `₹${priceInINR}`;
  };

  const convertPrice = (priceInINR) => {
    if (currency === 'USD') {
      return (priceInINR / exchangeRate).toFixed(2);
    }
    return priceInINR;
  };

  return (
    <CurrencyContext.Provider value={{ currency, setCurrency, formatPrice, convertPrice, exchangeRate }}>
      {children}
    </CurrencyContext.Provider>
  );
};

export const useCurrency = () => useContext(CurrencyContext);
