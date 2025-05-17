'use client'

import { useState, useEffect } from 'react';

type Transaction = {
  id: string;
  type: 'deposit' | 'withdrawal' | 'purchase';
  amount: number;
  currency: string;
  status: 'pending' | 'completed' | 'failed';
  timestamp: string;
  read: boolean;
};

export const Topbar = () => {
  const [currentTime, setCurrentTime] = useState('');
  const [btcPrice, setBtcPrice] = useState('$63,248.42');
  const [walletBalance, setWalletBalance] = useState(0);
  const [showNotifications, setShowNotifications] = useState(false);
  const [transactions, setTransactions] = useState<Transaction[]>([
    {
      id: '1',
      type: 'deposit',
      amount: 1500,
      currency: 'BTC',
      status: 'completed',
      timestamp: '2024-05-18T10:30:00Z',
      read: false
    },
    {
      id: '2',
      type: 'purchase',
      amount: 200,
      currency: 'USD',
      status: 'pending',
      timestamp: '2024-05-18T09:45:00Z',
      read: false
    },
    {
      id: '3',
      type: 'withdrawal',
      amount: 0.5,
      currency: 'BTC',
      status: 'completed',
      timestamp: '2024-05-17T15:20:00Z',
      read: true
    }
  ]);

  const unreadCount = transactions.filter(t => !t.read).length;

  useEffect(() => {
    const fetchWalletBalance = async () => {
      try {
        const response = await fetch('/api/users/6');
        const data = await response.json();
        setWalletBalance(data.walletBalance);
      } catch (error) {
        console.error('Error fetching wallet balance:', error);
      }
    };

    const updateTime = () => {
      setCurrentTime(new Date().toLocaleTimeString([], { 
        hour: '2-digit', 
        minute: '2-digit' 
      }));
    };

    const updateBtcPrice = () => {
      setBtcPrice(`$${(63248.42 + (Math.random() * 1000 - 500)).toFixed(2)}`);
    };

    fetchWalletBalance();
    updateTime();
    updateBtcPrice();

    const timeInterval = setInterval(updateTime, 60000);
    const priceInterval = setInterval(updateBtcPrice, 30000);

    return () => {
      clearInterval(timeInterval);
      clearInterval(priceInterval);
    };
  }, []);

  const markAsRead = (id: string) => {
    setTransactions(transactions.map(t => 
      t.id === id ? { ...t, read: true } : t
    ));
  };

  const getTransactionIcon = (type: string) => {
    switch(type) {
      case 'deposit': return '⬇️';
      case 'withdrawal': return '⬆️';
      case 'purchase': return '💳';
      default: return 'ℹ️';
    }
  };

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'completed': return 'text-green-400';
      case 'pending': return 'text-amber-400';
      case 'failed': return 'text-red-400';
      default: return 'text-gray-400';
    }
  };

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    return `${date.toLocaleDateString()} ${date.toLocaleTimeString()}`;
  };

  return (
    <div className="bg-gradient-to-r from-gray-800 to-gray-900 text-xs text-gray-300 py-2 px-4 border-b border-gray-700 relative">
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
          <div className="flex items-center space-x-1">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            <span>${walletBalance.toLocaleString()}</span>
          </div>

          <div className="relative">
            <button 
              className="text-gray-300 hover:text-amber-400 relative"
              onClick={() => setShowNotifications(!showNotifications)}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
              
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-xs rounded-full h-4 w-4 flex items-center justify-center">
                  {unreadCount}
                </span>
              )}
            </button>

            {showNotifications && (
              <div className="absolute right-0 mt-2 w-80 bg-gray-800 rounded-lg shadow-xl border border-gray-700 z-50">
                <div className="p-3 text-sm font-bold border-b border-gray-700 bg-gray-900/50">
                  Recent Transaction
                  <span className="text-gray-400 font-normal ml-2">
                    ({transactions.length} records)
                  </span>
                </div>
                
                <div className="max-h-96 overflow-y-auto">
                  {transactions.map(transaction => (
                    <div 
                      key={transaction.id}
                      className={`p-3 hover:bg-gray-700/50 cursor-pointer border-b border-gray-700 last:border-0 ${
                        !transaction.read ? 'bg-gray-900/30' : ''
                      }`}
                      onClick={() => markAsRead(transaction.id)}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <span className="text-xl">
                            {getTransactionIcon(transaction.type)}
                          </span>
                          <div>
                            <div className="capitalize font-medium">
                              {transaction.type}
                            </div>
                            <div className={`text-xs ${getStatusColor(transaction.status)}`}>
                              {transaction.status}
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-mono">
                            {transaction.amount.toLocaleString()} {transaction.currency}
                          </div>
                          <div className="text-xs text-gray-400 mt-1">
                            {formatTimestamp(transaction.timestamp)}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <span className="inline-flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 text-amber-400 mr-1" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M4 4a2 2 0 00-2 2v4a2 2 0 002 2V6h10a2 2 0 00-2-2H4zm2 6a2 2 0 012-2h8a2 2 0 012 2v4a2 2 0 01-2 2H8a2 2 0 01-2-2v-4zm6 4a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
            </svg>
            BTC: {btcPrice}
          </span>
        </div>
      </div>
    </div>
  );
};