'use client'

import { useState, useEffect } from 'react';

export const Topbar = () => {
  const [currentTime, setCurrentTime] = useState('');
  const [btcPrice, setBtcPrice] = useState('$63,248.42');

  useEffect(() => {
    // Update time every minute
    const updateTime = () => {
      setCurrentTime(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
    };
    updateTime();
    const interval = setInterval(updateTime, 60000);

    // Simulate BTC price changes
    const priceInterval = setInterval(() => {
      setBtcPrice(`$${(63248.42 + (Math.random() * 1000 - 500)).toFixed(2)}`);
    }, 30000);

    return () => {
      clearInterval(interval);
      clearInterval(priceInterval);
    };
  }, []);

  return (
    <div className="bg-gradient-to-r from-gray-800 to-gray-900 text-xs text-gray-300 py-2 px-4 border-b border-gray-700">
      <div className="container mx-auto flex justify-between items-center">
        <div className="flex items-center space-x-4">
          <span className="hidden sm:inline-flex items-center">
            <span className="w-2 h-2 bg-green-400 rounded-full mr-2"></span>
            <span>24/7 Support</span>
          </span>
          <span className="hidden md:inline-flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 text-amber-400 mr-1" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
            </svg>
            {currentTime || 'Loading...'} UTC
          </span>
        </div>

        <div className="flex items-center space-x-6">
          <span className="inline-flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 text-amber-400 mr-1" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M4 4a2 2 0 00-2 2v4a2 2 0 002 2V6h10a2 2 0 00-2-2H4zm2 6a2 2 0 012-2h8a2 2 0 012 2v4a2 2 0 01-2 2H8a2 2 0 01-2-2v-4zm6 4a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
            </svg>
            BTC: {btcPrice}
          </span>
          <span className="hidden sm:inline-flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 text-amber-400 mr-1" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
            </svg>
            Global Delivery
          </span>
          <a href="#live-chat" className="text-amber-400 hover:text-amber-300 font-medium flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z" clipRule="evenodd" />
            </svg>
            Live Chat
          </a>
        </div>
      </div>
    </div>
  );
};