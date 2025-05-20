"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { Topbar } from "../../components/Topbar";
import { Footer } from "../../components/Footer";

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

type User = {
  id: number;
  username: string;
  walletBalance: number;
  btcWalletAddress: string;
  xmrWalletAddress: string;
};

type PageParams = {
  id: string;
};

export default function CardCheckoutPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;
  const [card, setCard] = useState<CreditCard | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [timer, setTimer] = useState(900);
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [error, setError] = useState("");
  const [showPaymentDetails, setShowPaymentDetails] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);

  const storageKey = `pendingPayment_${id}`;

  // Restore persisted state
  useEffect(() => {
    const stored = localStorage.getItem(storageKey);
    if (stored) {
      const parsed = JSON.parse(stored);
      const now = Date.now();
      const elapsed = Math.floor((now - parsed.timestamp) / 1000);
      const remainingTime = parsed.timer - elapsed;

      if (remainingTime > 0) {
        setShowPaymentDetails(true);
        setTimer(remainingTime);
      } else {
        localStorage.removeItem(storageKey);
      }
    }
  }, [id, storageKey]);

  // Fetch card and user
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        setNotFound(false);

        // Fetch card data (available to all users)
        const cardRes = await fetch(`/api/credit-cards/${id}`);
        if (!cardRes.ok) {
          if (cardRes.status === 404) {
            setNotFound(true);
            return;
          }
          throw new Error("Failed to fetch card");
        }
        const cardData = await cardRes.json();
        setCard(cardData);

        // Try to fetch user data (optional for logged-in users)
        try {
          const userRes = await fetch("/api/users/me");
          if (userRes.ok) {
            const userData = await userRes.json();
            setUser(userData.user);
            setIsLoggedIn(true);
          }
        } catch (userError) {
          console.log("User not logged in - showing public view");
          setIsLoggedIn(false);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        setError("Failed to load data. Please try again.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [id, router]);

  // Countdown timer
  useEffect(() => {
    if (!showPaymentDetails) return;

    const interval = setInterval(() => {
      setTimer((prev) => {
        const next = prev > 0 ? prev - 1 : 0;
        if (next === 0) {
          localStorage.removeItem(storageKey);
          setShowPaymentDetails(false);
        }
        return next;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [showPaymentDetails, storageKey]);

  // Format time as MM:SS
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const recordPurchase = async () => {
    if (!card || !user) return;
    try {
      const purchaseData = {
        type: card.type,
        number: card.number,
        expiry: card.expiry,
        cvv: card.cvv,
        balance: card.balance,
        price: card.price,
        country: card.country,
        ownerName: card.ownerName,
        purchasedBy: user.id,
      };

      const response = await fetch("/api/purchased-cards", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(purchaseData),
      });

      if (!response.ok) throw new Error("Failed to record purchase");
      return await response.json();
    } catch (err) {
      console.error("Error recording purchase:", err);
      throw err;
    }
  };

  const handleWalletPayment = async () => {
    if (!user || !card) {
      setShowLoginPrompt(true);
      return;
    }

    if (user.walletBalance < card.price) {
      setError("Insufficient funds in your wallet");
      localStorage.setItem(
        storageKey,
        JSON.stringify({ timer, timestamp: Date.now() })
      );
      return;
    }

    setIsProcessing(true);
    setError("");

    try {
      const updatedBalance = user.walletBalance - card.price;
      const updateRes = await fetch(`/api/users/${user.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ walletBalance: updatedBalance }),
      });

      if (!updateRes.ok) throw new Error("Failed to update wallet balance");

      await recordPurchase();

      setUser({ ...user, walletBalance: updatedBalance });
      setPaymentSuccess(true);
      localStorage.removeItem(storageKey);
    } catch (err) {
      console.error("Payment error:", err);
      setError("Payment failed. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  const handlePayButtonClick = () => {
    if (!isLoggedIn) {
      setShowLoginPrompt(true);
      return;
    }
    setShowPaymentDetails(true);
    localStorage.setItem(
      storageKey,
      JSON.stringify({ timer: 900, timestamp: Date.now() })
    );
  };

  const cancelPayment = () => {
    setShowPaymentDetails(false);
    setTimer(900);
    localStorage.removeItem(storageKey);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-500"></div>
      </div>
    );
  }

  if (notFound) {
    return (
      <>
        <Topbar />
        <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-gray-100 p-4 md:p-8 flex items-center justify-center">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-red-500 to-amber-600 mb-4">
              Card Not Found
            </h1>
            <p className="text-gray-300 mb-6">
              The card you're looking for doesn't exist or may have been
              purchased.
            </p>
            <Link
              href="/cards"
              className="inline-block bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-6 rounded-lg transition-colors">
              Browse Available Cards
            </Link>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  if (!card) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <p className="text-red-500">Failed to load card data</p>
      </div>
    );
  }

  return (
    <>
      <Topbar />
      <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-gray-100 p-4 md:p-8">
        <div className="max-w-3xl mx-auto">
          <div className="mb-6 border-b border-red-800/50 pb-4">
            <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-red-500 to-amber-600">
              Secure Checkout
            </h1>
            {showPaymentDetails && (
              <p className="text-red-400 mt-1 flex items-center gap-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  fill="currentColor"
                  viewBox="0 0 20 20">
                  <path d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.414-1.415L11 9.586V6z" />
                </svg>
                Time remaining: {formatTime(timer)}
              </p>
            )}
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-900/30 border border-red-700 rounded-lg text-red-300">
              {error}
            </div>
          )}

          <div className="bg-gray-800/50 rounded-xl p-6 mb-6 border border-red-800/30">
            <div className="flex justify-between items-start mb-3">
              <div>
                <h2 className="text-xl font-bold">
                  {card.type} •••• {card.number.slice(-4)}
                </h2>
                <p className="text-gray-400">
                  Balance: ${card.balance.toLocaleString()}
                </p>
              </div>
              <span className="text-2xl font-bold text-red-400">
                ${card.price.toFixed(2)}
              </span>
            </div>
            <p className="text-sm text-gray-300">
              Country: {card.country} • Expires: {card.expiry}
            </p>
          </div>

          {/* Login Prompt Modal */}
          {showLoginPrompt && (
            <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4">
              <div className="bg-gray-800 rounded-lg p-6 max-w-md w-full border border-red-800/50">
                <h3 className="text-xl font-bold text-red-400 mb-4">
                  Login Required
                </h3>
                <p className="text-gray-300 mb-6">
                  You need to be logged in to complete this purchase. Please
                  login or register to continue.
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

          {/* Initial Pay button */}
          {!showPaymentDetails ? (
            <button
              onClick={handlePayButtonClick}
              className="w-full py-3 px-4 rounded-lg font-bold bg-red-600 hover:bg-red-700 transition-colors flex items-center justify-center gap-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
              {isLoggedIn ? "Pay" : "Purchase Card"}
            </button>
          ) : (
            // Payment Section
            <div className="space-y-4 mt-6">
              <h3 className="text-xl font-bold text-red-400">Payment Method</h3>

              {isLoggedIn ? (
                <>
                  <div
                    className={`p-4 rounded-md ${
                      user && user.walletBalance < card.price
                        ? "bg-red-900/20 border border-red-600"
                        : "bg-gray-900"
                    }`}>
                    <p className="text-gray-300 mb-1">
                      Your Wallet Balance: $
                      {user ? user.walletBalance.toFixed(2) : "0.00"}
                    </p>
                    {user && user.walletBalance < card.price && (
                      <p className="text-sm text-red-300">
                        You need ${(card.price - user.walletBalance).toFixed(2)}{" "}
                        more to complete this purchase.
                      </p>
                    )}
                  </div>

                  {user && user.walletBalance < card.price ? (
                    <>
                      <Link
                        href="/deposit"
                        className="w-full inline-flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-4 rounded-lg transition-colors">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor">
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 8v4m0 0v4m0-4h4m-4 0H8m13 0a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                        Deposit Funds Now
                      </Link>
                      <button
                        onClick={cancelPayment}
                        className="w-full mt-3 text-sm text-gray-300 hover:text-white underline">
                        Cancel Payment
                      </button>
                    </>
                  ) : paymentSuccess ? (
                    <div className="p-4 bg-green-900/30 rounded-lg border border-green-700/50">
                      <p className="text-green-300 font-bold">
                        Payment successful! Your card will be delivered shortly.
                      </p>
                      <Link
                        href="/my-purchases"
                        className="mt-4 block text-center bg-blue-600 hover:bg-blue-700 py-2 rounded-lg font-bold">
                        View Your Purchased Cards
                      </Link>
                    </div>
                  ) : (
                    <button
                      onClick={handleWalletPayment}
                      disabled={isProcessing}
                      className={`w-full py-3 px-4 rounded-lg font-bold flex items-center justify-center gap-2 transition-colors ${
                        isProcessing
                          ? "bg-gray-600 cursor-not-allowed"
                          : "bg-red-600 hover:bg-red-700"
                      }`}>
                      {isProcessing ? (
                        <>
                          <svg
                            className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24">
                            <circle
                              className="opacity-25"
                              cx="12"
                              cy="12"
                              r="10"
                              stroke="currentColor"
                              strokeWidth="4"></circle>
                            <path
                              className="opacity-75"
                              fill="currentColor"
                              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
                          </svg>
                          Processing...
                        </>
                      ) : (
                        <>
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor">
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M5 13l4 4L19 7"
                            />
                          </svg>
                          Confirm Payment (${card.price.toFixed(2)})
                        </>
                      )}
                    </button>
                  )}
                </>
              ) : (
                <div className="p-4 bg-gray-800 rounded-lg border border-gray-700">
                  <p className="text-gray-300 mb-4">
                    You need to be logged in to complete this purchase.
                  </p>
                  <Link
                    href="/login"
                    className="w-full block text-center bg-red-600 hover:bg-red-700 py-3 rounded-lg font-bold">
                    Login Now
                  </Link>
                  <button
                    onClick={cancelPayment}
                    className="w-full mt-3 text-sm text-gray-300 hover:text-white underline">
                    Cancel Payment
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
}
