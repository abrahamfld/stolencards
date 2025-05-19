"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";

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
    } catch (error) {
      console.error("Error fetching cards:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCards(currentPage);
  }, []);

  const handlePageChange = async (page: number) => {
    if (page === currentPage) return;
    setCurrentPage(page);
    await fetchCards(page);
    if (document.activeElement instanceof HTMLElement) {
      document.activeElement.blur();
    }
  };

  const formatCardNumber = (number: string) => {
    return `•••• •••• •••• ${number.slice(-4)}`;
  };

  const formatCVV = () => "•••";

  const getCardTypeColor = (type: string) => {
    switch (type.toLowerCase()) {
      case "visa":
        return "bg-blue-600";
      case "mastercard":
        return "bg-red-600";
      case "amex":
        return "bg-green-600";
      case "discover":
        return "bg-purple-600";
      default:
        return "bg-gray-600";
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
    <section
      className="py-16 bg-gradient-to-b from-gray-900 to-black"
      ref={gridRef}>
      <div className="container mx-auto px-4">
        <section className="py-20 text-center">
          <h1 className="text-4xl font-bold mb-4">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-red-500 to-amber-600">
              Buy Premium
            </span>{" "}
            <span className="text-white">Stolen Cards</span>
          </h1>
          <p className="text-gray-400 text-xl mb-8">
            High Balance | Fresh Dumps | 100% Valid
          </p>
        </section>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {cards.map((card) => (
            <div
              key={card.id}
              className="bg-gray-800/50 rounded-xl p-6 border border-gray-700 hover:border-red-500/50 transition-colors relative overflow-hidden">
              <div className="flex justify-between items-start mb-2">
                <span
                  className={`text-xs font-semibold px-2 py-1 rounded ${getCardTypeColor(card.type)}`}>
                  {card.type.toUpperCase()}
                </span>
                <span className="text-xs text-gray-400">
                  Balance: ${card.balance.toLocaleString()}
                </span>
              </div>

              <div className="my-4">
                <h3 className="text-xl font-bold font-mono">
                  {formatCardNumber(card.number)}
                </h3>
                <p className="text-gray-400 text-sm mt-1">{card.ownerName}</p>
              </div>

              <div className="grid grid-cols-3 gap-4 mt-4">
                <div>
                  <p className="text-xs text-gray-400">Expires</p>
                  <p className="font-mono">{card.expiry}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-400">CVV</p>
                  <p className="font-mono">{formatCVV()}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-400">Country</p>
                  <p>{card.country}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mt-4">
                <div>
                  <p className="text-xs text-gray-400">Balance</p>
                  <p className="text-xl font-bold text-green-400">
                    ${card.balance.toLocaleString()}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-400">Price</p>
                  <p className="text-lg font-bold text-amber-400">
                    ${card.price.toLocaleString()}
                  </p>
                </div>
              </div>

              <Link
                href={`/cards/${card.id}`}
                className="block w-full mt-6 py-3 bg-gradient-to-r from-red-600 to-amber-600 hover:from-red-700 hover:to-amber-700 text-center text-white font-bold transition-all rounded-md">
                BUY NOW
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
                className="px-4 py-2 border border-red-800/50 rounded-md text-gray-300 hover:bg-red-900/30 disabled:opacity-50 disabled:cursor-not-allowed">
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
                        ? "bg-red-600 text-white"
                        : "text-gray-300 hover:bg-red-900/30"
                    }`}>
                    {pageNum}
                  </button>
                );
              })}

              <button
                onClick={() =>
                  handlePageChange(Math.min(totalPages, currentPage + 1))
                }
                disabled={currentPage === totalPages}
                className="px-4 py-2 border border-red-800/50 rounded-md text-gray-300 hover:bg-red-900/30 disabled:opacity-50 disabled:cursor-not-allowed">
                Next
              </button>
            </nav>
          </div>
        )}
      </div>
    </section>
  );
};
