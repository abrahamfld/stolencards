'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';

type CreditCard = {
  id: string;
  type: string;
  number: string;
  expiry: string;
  cvv: number;
  balance: number;
  price: number;
  country: string;
  ownerName: string;
};

export const CardGridSection = () => {
  const [cards, setCards] = useState<CreditCard[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const cardsPerPage = 9;
  const gridRef = useRef<HTMLDivElement>(null);

  const fetchCards = async (page: number) => {
    try {
      setLoading(true);
      const response = await fetch(
        `/api/credit-cards?page=${page}&limit=${cardsPerPage}`
      );
      const data = await response.json();
      setCards(data.docs);
      setTotalPages(Math.ceil(data.totalDocs / cardsPerPage));
      
      // Scroll to grid after load
      if (gridRef.current) {
        gridRef.current.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }
    } catch (error) {
      console.error('Error fetching cards:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCards(currentPage);
  }, []); // Initial load

  const handlePageChange = async (page: number) => {
    if (page === currentPage) return;
    
    setCurrentPage(page);
    await fetchCards(page);
    
    // Remove focus from clicked button
    if (document.activeElement instanceof HTMLElement) {
      document.activeElement.blur();
    }
  };

  if (loading) {
    return (
      <div className="py-20 flex justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-500"></div>
      </div>
    );
  }

  return (
    <section className="py-16 bg-gradient-to-b from-gray-900 to-black" ref={gridRef}>
        <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-red-500 to-amber-600">
              Premium Cards
            </span>
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Curated selection of high-value financial instruments with global clearance
          </p>
        </div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {cards.map((card) => (
            <div key={card.id} className="bg-gray-800/50 hover:bg-gray-800/70 transition-all rounded-xl overflow-hidden border border-red-800/30 hover:border-red-500/50 shadow-xl hover:shadow-red-500/20">
              <div className="p-6">
                {/* Card Header */}
                <div className="flex justify-between items-start mb-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                    card.type === 'VISA' ? 'bg-blue-500/20 text-blue-400' :
                    card.type === 'MasterCard' ? 'bg-red-500/20 text-red-400' :
                    'bg-green-500/20 text-green-400'
                  }`}>
                    {card.type}
                  </span>
                  <span className="bg-clip-text text-transparent bg-gradient-to-r from-red-400 to-amber-500 font-bold">
                    ${card.balance.toLocaleString()}
                  </span>
                </div>

                {/* Card Preview */}
                <div className="bg-gradient-to-br from-gray-900 to-black rounded-lg p-4 mb-6 border border-red-800/30">
                  <div className="flex justify-between items-center mb-6">
                    <span className="text-xl font-bold text-red-400">{card.type}</span>
                    <div className="flex space-x-2">
                      <div className={`w-8 h-5 rounded-sm ${
                        card.type === 'VISA' ? 'bg-blue-500' :
                        card.type === 'MasterCard' ? 'bg-red-500' :
                        'bg-green-500'
                      }`}></div>
                      <div className="w-8 h-5 bg-gray-800 rounded-sm"></div>
                    </div>
                  </div>
                  <div className="text-gray-400 text-sm mb-1">Card Number</div>
                  <div className="text-white text-lg font-mono tracking-widest mb-6">
                    •••• •••• •••• {card.number.slice(-4)}
                  </div>
                  <div className="flex justify-between text-red-300">
                    <div>
                      <div className="text-gray-400 text-sm mb-1">Holder</div>
                      <div className="text-white">{card.ownerName}</div>
                    </div>
                    <div>
                      <div className="text-gray-400 text-sm mb-1">Expires</div>
                      <div className="text-white">{card.expiry}</div>
                    </div>
                  </div>
                </div>

                {/* Card Details */}
                <div className="flex justify-between items-center">
                  <div>
                    <div className="text-gray-400 text-sm">Origin</div>
                    <div className="text-white font-medium">{card.country}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-gray-400 text-sm">Acquisition Cost</div>
                    <div className="bg-clip-text text-transparent bg-gradient-to-r from-red-500 to-amber-600 font-bold text-xl">
                      ${card.price}
                    </div>
                  </div>
                </div>
              </div>

              {/* Buy Button */}
              <Link 
                href={`/cards/${card.id}`}
                className="block w-full py-3 bg-gradient-to-r from-red-600 to-amber-600 hover:from-red-700 hover:to-amber-700 text-center text-white font-bold transition-all"
              >
                BUY
              </Link>
            </div>
          ))}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center mt-8">
            <nav className="flex items-center space-x-2">
              <button
                onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className="px-4 py-2 border border-red-800/50 rounded-md text-gray-300 hover:bg-red-900/30 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous
              </button>
              
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                let pageNum;
                if (totalPages <= 5) {
                  pageNum = i + 1;
                } else if (currentPage <= 3) {
                  pageNum = i + 1;
                } else if (currentPage >= totalPages - 2) {
                  pageNum = totalPages - 4 + i;
                } else {
                  pageNum = currentPage - 2 + i;
                }

                return (
                  <button
                    key={pageNum}
                    onClick={() => handlePageChange(pageNum)}
                    className={`px-4 py-2 rounded-md ${
                      currentPage === pageNum
                        ? 'bg-red-600 text-white'
                        : 'text-gray-300 hover:bg-red-900/30'
                    }`}
                  >
                    {pageNum}
                  </button>
                );
              })}

              <button
                onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages}
                className="px-4 py-2 border border-red-800/50 rounded-md text-gray-300 hover:bg-red-900/30 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
              </button>
            </nav>
          </div>
        )}
      </div>
    </section>
  );
};