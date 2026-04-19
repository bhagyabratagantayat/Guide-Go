import React, { createContext, useContext, useState, useEffect } from 'react';

const CurrencyContext = createContext();

export const CurrencyProvider = ({ children }) => {
  const [currency, setCurrency] = useState(() => {
    return localStorage.getItem('guidego_currency') || 'INR';
  });

  useEffect(() => {
    localStorage.setItem('guidego_currency', currency);
  }, [currency]);

  // Using a simplified conversion rate for demo (1 USD = 84 INR)
  const formatPrice = (inrAmount) => {
    if (currency === 'USD') {
      const converted = (inrAmount / 84).toFixed(2);
      return `$${converted}`;
    }
    return `₹${inrAmount}`;
  };

  const convertPrice = (inrAmount) => {
    return currency === 'USD' ? (inrAmount / 84).toFixed(2) : inrAmount;
  };

  return (
    <CurrencyContext.Provider value={{ currency, setCurrency, formatPrice, convertPrice }}>
      {children}
    </CurrencyContext.Provider>
  );
};

export const useCurrency = () => useContext(CurrencyContext);
