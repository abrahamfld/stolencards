// app/my-purchases/page.tsx
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Topbar } from "../components/Topbar";
import { Footer } from "../components/Footer";

type PurchasedCard = {
  id: number;
  type: string;
  number: string;
  expiry: string;
  cvv: number;
  balance: number;
  price: number;
  country: string;
  ownerName: string;
  purchasedBy: {
    id: number;
    username: string;
  };
  createdAt: string;
  updatedAt: string;
};

export default function MyPurchasesPage() {
  const [cards, setCards] = useState<PurchasedCard[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [revealedCards, setRevealedCards] = useState<Record<number, boolean>>(
    {}
  );
  const [copiedCardId, setCopiedCardId] = useState<number | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // First check if user is logged in
        const userRes = await fetch("/api/users/me");
        if (!userRes.ok) {
          setIsLoggedIn(false);
          setLoading(false);
          return;
        }

        const userData = await userRes.json();
        if (!userData?.user?.id) {
          setIsLoggedIn(false);
          setLoading(false);
          return;
        }

        setIsLoggedIn(true);
        
        // Then fetch user's purchased cards
        const cardsRes = await fetch(
          `/api/purchased-cards?where[purchasedBy][equals]=${userData.user.id}`
        );

        if (!cardsRes.ok) throw new Error("Failed to fetch purchased cards");

        const cardsData = await cardsRes.json();
        setCards(cardsData.docs || []);

        // Initialize revealed state for all cards as false
        const initialRevealedState = cardsData.docs?.reduce(
          (acc: Record<number, boolean>, card: PurchasedCard) => {
            acc[card.id] = false;
            return acc;
          },
          {}
        ) || {};
        setRevealedCards(initialRevealedState);
      } catch (err) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError("An unknown error occurred");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const toggleRevealCard = (cardId: number) => {
    if (!isLoggedIn) {
      setShowLoginPrompt(true);
      return;
    }
    setRevealedCards((prev) => ({
      ...prev,
      [cardId]: !prev[cardId],
    }));
  };

  const copyToClipboard = (text: string, cardId: number) => {
    if (!isLoggedIn) {
      setShowLoginPrompt(true);
      return;
    }
    navigator.clipboard.writeText(text);
    setCopiedCardId(cardId);
    setTimeout(() => setCopiedCardId(null), 2000);
  };

  const formatCardNumber = (number: string, reveal: boolean) => {
    if (reveal) {
      return number.replace(/(\d{4})(?=\d)/g, "$1 ");
    }
    return `•••• •••• •••• ${number.slice(-4)}`;
  };

  const formatExpiry = (expiry: string, reveal: boolean) => {
    if (reveal) return expiry;
    return `••/••`;
  };

  const formatCVV = (cvv: number, reveal: boolean) => {
    if (reveal) return cvv.toString();
    return "•••";
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

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
      <>
        <Topbar />
        <div className="min-h-screen bg-gray-900 flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-500"></div>
        </div>
        <Footer />
      </>
    );
  }

  if (error) {
    return (
      <>
        <Topbar />
        <div className="min-h-screen bg-gray-900 flex items-center justify-center">
          <div className="text-red-500 p-4 border border-red-700 rounded-lg">
            Error: {error}
            <Link href="/" className="mt-4 block text-red-300 hover:text-white">
              ← Return to homepage
            </Link>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Topbar />
      <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-gray-100 p-4 md:p-8">
        <div className="max-w-6xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-red-500 to-amber-600">
              My Purchased Cards
            </h1>
            {isLoggedIn && (
              <p className="text-gray-400 mt-2">
                {cards.length} card{cards.length !== 1 ? "s" : ""} purchased
              </p>
            )}
          </div>

          {/* Login Prompt Modal */}
          {showLoginPrompt && (
            <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4">
              <div className="bg-gray-800 rounded-lg p-6 max-w-md w-full border border-red-800/50">
                <h3 className="text-xl font-bold text-red-400 mb-4">
                  Login Required
                </h3>
                <p className="text-gray-300 mb-6">
                  You need to be logged in to view your purchased cards.
                </p>
                <div className="flex flex-col space-y-3">
                  <Link
                    href="/login"
                    className="w-full py-3 px-4 rounded-lg font-bold bg-red-600 hover:bg-red-700 text-center transition-colors">
                    Login
                  </Link>
    
                  <button
                    onClick={() => setShowLoginPrompt(false)}
                    className="w-full py-3 px-4 rounded-lg font-bold text-gray-300 hover:text-white underline">
                    Continue Browsing
                  </button>
                </div>
              </div>
            </div>
          )}

          {!isLoggedIn ? (
            <div className="bg-gray-800/50 rounded-xl p-8 text-center border border-gray-700">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-12 w-12 mx-auto text-gray-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                />
              </svg>
              <h3 className="mt-4 text-xl font-medium text-gray-300">
                Please log in to view your purchases
              </h3>
              <p className="mt-2 text-gray-400">
                Your purchased cards will be available after logging in
              </p>
              <button
                onClick={() => setShowLoginPrompt(true)}
                className="mt-6 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700">
                Login Now
              </button>
            </div>
          ) : cards.length === 0 ? (
            <div className="bg-gray-800/50 rounded-xl p-8 text-center border border-gray-700">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-12 w-12 mx-auto text-gray-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                />
              </svg>
              <h3 className="mt-4 text-xl font-medium text-gray-300">
                No cards purchased yet
              </h3>
              <p className="mt-2 text-gray-400">
                Your purchased cards will appear here once you make a purchase
              </p>
              <Link
                href="/cards"
                className="mt-6 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700">
                Browse Cards
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
                      Purchased: {formatDate(card.createdAt)}
                    </span>
                  </div>

                  <div className="my-4">
                    <h3 className="text-xl font-bold font-mono">
                      {formatCardNumber(card.number, revealedCards[card.id])}
                    </h3>
                    <p className="text-gray-400 text-sm mt-1">
                      {card.ownerName}
                    </p>
                  </div>

                  <div className="grid grid-cols-3 gap-4 mt-4">
                    <div>
                      <p className="text-xs text-gray-400">Expires</p>
                      <p className="font-mono">
                        {formatExpiry(card.expiry, revealedCards[card.id])}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-400">CVV</p>
                      <p className="font-mono">
                        {formatCVV(card.cvv, revealedCards[card.id])}
                      </p>
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
                      <p className="text-xs text-gray-400">Paid</p>
                      <p className="text-lg font-bold text-amber-400">
                        ${card.price.toLocaleString()}
                      </p>
                    </div>
                  </div>

                  <div className="mt-6 pt-4 border-t border-gray-700 flex justify-between items-center">
                    <button
                      onClick={() => copyToClipboard(card.number, card.id)}
                      className="text-sm flex items-center gap-1 text-red-400 hover:text-red-300">
                      {copiedCardId === card.id ? (
                        <>
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-4 w-4"
                            viewBox="0 0 20 20"
                            fill="currentColor">
                            <path
                              fillRule="evenodd"
                              d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                              clipRule="evenodd"
                            />
                          </svg>
                          Copied!
                        </>
                      ) : (
                        <>
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-4 w-4"
                            viewBox="0 0 20 20"
                            fill="currentColor">
                            <path d="M8 3a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1z" />
                            <path d="M6 3a2 2 0 00-2 2v11a2 2 0 002 2h8a2 2 0 002-2V5a2 2 0 00-2-2 3 3 0 01-3 3H9a3 3 0 01-3-3z" />
                          </svg>
                          Copy
                        </>
                      )}
                    </button>
                    <button
                      onClick={() => toggleRevealCard(card.id)}
                      className="text-sm flex items-center gap-1 text-gray-300 hover:text-white">
                      {revealedCards[card.id] ? (
                        <>
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-4 w-4"
                            viewBox="0 0 20 20"
                            fill="currentColor">
                            <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                            <path
                              fillRule="evenodd"
                              d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z"
                              clipRule="evenodd"
                            />
                          </svg>
                          Hide
                        </>
                      ) : (
                        <>
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-4 w-4"
                            viewBox="0 0 20 20"
                            fill="currentColor">
                            <path
                              fillRule="evenodd"
                              d="M3.707 2.293a1 1 0 00-1.414 1.414l14 14a1 1 0 001.414-1.414l-1.473-1.473A10.014 10.014 0 0019.542 10C18.268 5.943 14.478 3 10 3a9.958 9.958 0 00-4.512 1.074l-1.78-1.781zm4.261 4.26l1.514 1.515a2.003 2.003 0 012.45 2.45l1.514 1.514a4 4 0 00-5.478-5.478z"
                              clipRule="evenodd"
                            />
                            <path d="M12.454 16.697L9.75 13.992a4 4 0 01-3.742-3.741L2.335 6.578A9.98 9.98 0 00.458 10c1.274 4.057 5.065 7 9.542 7 .847 0 1.669-.105 2.454-.303z" />
                          </svg>
                          Reveal
                        </>
                      )}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
}