"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Topbar } from "../components/Topbar";
import { Footer } from "../components/Footer";
import Link from "next/link";

type User = {
  id: number;
  username: string;
  walletBalance: number;
  btcWalletAddress: string;
  xmrWalletAddress: string;
};

type Tab = "deposit" | "withdraw";
type CryptoMethod = "btc" | "xmr";

export default function WalletPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [activeTab, setActiveTab] = useState<Tab>("deposit");
  const [cryptoMethod, setCryptoMethod] = useState<CryptoMethod>("btc");
  const [withdrawAmount, setWithdrawAmount] = useState("");
  const [withdrawAddress, setWithdrawAddress] = useState("");
  const [copied, setCopied] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);

  // Fetch user data
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch("/api/users/me");
        if (!res.ok) {
          setIsLoading(false);
          return;
        }
        const data = await res.json();
        if (!data?.user?.id) {
          setIsLoading(false);
          return;
        }
        setUser(data.user);
      } catch (err) {
        console.error("Failed to fetch user data:", err);
        setError("Failed to load user data");
      } finally {
        setIsLoading(false);
      }
    };

    fetchUser();
  }, []);

  const copyToClipboard = (text: string) => {
    if (!user) {
      setShowLoginPrompt(true);
      return;
    }
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleWithdraw = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      setShowLoginPrompt(true);
      return;
    }

    setError("");
    setSuccess("");

    if (
      !withdrawAmount ||
      isNaN(Number(withdrawAmount)) ||
      Number(withdrawAmount) <= 0
    ) {
      setError("Please enter a valid amount");
      return;
    }

    if (Number(withdrawAmount) < 10) {
      setError("Minimum withdrawal amount is $10");
      return;
    }

    if (!withdrawAddress) {
      setError("Please enter a withdrawal address");
      return;
    }

    if (user.walletBalance <= 0) {
      setError(
        "Your wallet balance is $0. Please deposit funds before withdrawing."
      );
      return;
    }

    if (Number(withdrawAmount) > user.walletBalance) {
      setError(
        `Insufficient funds. Your current balance is $${user.walletBalance.toFixed(2)}`
      );
      return;
    }

    try {
      setIsLoading(true);

      // Simulate API call delay
      await new Promise((resolve) => setTimeout(resolve, 1500));

      const transactionId = `TX${Math.floor(Math.random() * 1000000)
        .toString()
        .padStart(6, "0")}`;
      setSuccess(`
        Success! $${Number(withdrawAmount).toFixed(2)} has been sent to your ${cryptoMethod.toUpperCase()} wallet.
        Transaction ID: ${transactionId}
        Estimated delivery: 14 minutes
      `);

      setWithdrawAmount("");
      setWithdrawAddress("");
      setTimeout(() => setSuccess(""), 10000);
    } catch (err) {
      setError("Withdrawal failed. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading && !user) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-500"></div>
      </div>
    );
  }

  return (
    <>
      <Topbar />
      <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-gray-100 p-4 md:p-8">
        <div className="max-w-3xl mx-auto">
          {/* Login Prompt Modal */}
          {showLoginPrompt && (
            <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4">
              <div className="bg-gray-800 rounded-lg p-6 max-w-md w-full border border-red-800/50">
                <h3 className="text-xl font-bold text-red-400 mb-4">
                  Login Required
                </h3>
                <p className="text-gray-300 mb-6">
                  You need to be logged in to access wallet features.
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

          {!user ? (
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
                Please log in to access your wallet
              </h3>
              <p className="mt-2 text-gray-400">
                Your wallet features will be available after logging in
              </p>
              <button
                onClick={() => setShowLoginPrompt(true)}
                className="mt-6 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700">
                Login Now
              </button>
            </div>
          ) : (
            <>
              <div className="mb-6 border-b border-red-800/50 pb-4">
                <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-red-500 to-amber-600">
                  Wallet Management
                </h1>
                <div className="mt-4 flex items-center justify-between">
                  <div>
                    <p className="text-gray-400">Current balance</p>
                    <p className="text-2xl font-bold">
                      ${user.walletBalance.toFixed(2)}
                    </p>
                  </div>
                  <div className="flex gap-2 bg-gray-800 rounded-lg p-1">
                    <button
                      onClick={() => setActiveTab("deposit")}
                      className={`py-2 px-4 rounded-md transition-colors ${
                        activeTab === "deposit"
                          ? "bg-red-600"
                          : "hover:bg-gray-700"
                      }`}>
                      Deposit
                    </button>
                    <button
                      onClick={() => setActiveTab("withdraw")}
                      className={`py-2 px-4 rounded-md transition-colors ${
                        activeTab === "withdraw"
                          ? "bg-red-600"
                          : "hover:bg-gray-700"
                      }`}>
                      Withdraw
                    </button>
                  </div>
                </div>
              </div>

              {error && (
                <div className="mb-4 p-3 bg-red-900/30 border border-red-700 rounded-lg text-red-300">
                  {error}
                </div>
              )}

              {success && (
                <div className="mb-4 p-3 bg-green-900/30 border border-green-700 rounded-lg text-green-300 flex items-start gap-2">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 mt-0.5 flex-shrink-0"
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
                  <span className="whitespace-pre-line">{success.trim()}</span>
                </div>
              )}

              {activeTab === "deposit" ? (
                <div className="bg-gray-800/50 rounded-xl p-6 mb-6 border border-red-800/30">
                  <div className="mb-6">
                    <label className="block text-gray-300 mb-2">
                      Deposit Method
                    </label>
                    <div className="flex gap-4">
                      <button
                        type="button"
                        onClick={() => setCryptoMethod("btc")}
                        className={`py-2 px-4 rounded-lg font-medium transition-colors ${
                          cryptoMethod === "btc"
                            ? "bg-red-600"
                            : "bg-gray-700 hover:bg-gray-600"
                        }`}>
                        Bitcoin (BTC)
                      </button>
                      <button
                        type="button"
                        onClick={() => setCryptoMethod("xmr")}
                        className={`py-2 px-4 rounded-lg font-medium transition-colors ${
                          cryptoMethod === "xmr"
                            ? "bg-red-600"
                            : "bg-gray-700 hover:bg-gray-600"
                        }`}>
                        Monero (XMR)
                      </button>
                    </div>
                  </div>

                  <div className="mb-6">
                    <label className="block text-gray-300 mb-2">
                      Send {cryptoMethod.toUpperCase()} to:
                    </label>
                    <div className="bg-gray-900 p-4 rounded-lg relative">
                      <code className="text-sm break-all">
                        {cryptoMethod === "btc"
                          ? user.btcWalletAddress
                          : user.xmrWalletAddress}
                      </code>
                      <button
                        type="button"
                        onClick={() =>
                          copyToClipboard(
                            cryptoMethod === "btc"
                              ? user.btcWalletAddress
                              : user.xmrWalletAddress
                          )
                        }
                        className="absolute right-2 top-2 bg-gray-700 hover:bg-gray-600 p-1 rounded"
                        title="Copy to clipboard">
                        {copied ? (
                          <span className="text-xs text-green-400">
                            Copied!
                          </span>
                        ) : (
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
                              d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3"
                            />
                          </svg>
                        )}
                      </button>
                    </div>
                  </div>

                  <div className="bg-gray-900/50 p-4 rounded-lg border border-gray-700">
                    <h3 className="text-lg font-bold text-red-400 mb-2">
                      Deposit Instructions:
                    </h3>
                    <ul className="space-y-2 text-sm text-gray-300">
                      <li className="flex items-start gap-2">
                        <span className="text-red-400">•</span>
                        <span>Minimum deposit: $10.00 USD equivalent</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-red-400">•</span>
                        <span>
                          Send only {cryptoMethod.toUpperCase()} to this address
                        </span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-red-400">•</span>
                        <span>
                          Funds will be credited after 3 network confirmations
                        </span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-red-400">•</span>
                        <span>Processing time: 15-30 minutes typically</span>
                      </li>
                    </ul>
                  </div>
                </div>
              ) : (
                <div className="bg-gray-800/50 rounded-xl p-6 mb-6 border border-red-800/30">
                  <form onSubmit={handleWithdraw}>
                    <div className="mb-6">
                      <label
                        htmlFor="withdrawAmount"
                        className="block text-gray-300 mb-2">
                        Amount (USD)
                      </label>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                          $
                        </span>
                        <input
                          id="withdrawAmount"
                          type="number"
                          value={withdrawAmount}
                          onChange={(e) => setWithdrawAmount(e.target.value)}
                          className="w-full bg-gray-700 border border-gray-600 rounded-lg py-3 pl-8 pr-4 focus:outline-none focus:ring-2 focus:ring-red-500"
                          placeholder="100.00"
                          step="0.01"
                          min="10"
                        />
                      </div>
                      <p className="text-sm text-gray-400 mt-1">
                        Minimum withdrawal: $10.00
                      </p>
                    </div>

                    <div className="mb-6">
                      <label
                        htmlFor="withdrawAddress"
                        className="block text-gray-300 mb-2">
                        {cryptoMethod.toUpperCase()} Address
                      </label>
                      <input
                        id="withdrawAddress"
                        type="text"
                        value={withdrawAddress}
                        onChange={(e) => setWithdrawAddress(e.target.value)}
                        className="w-full bg-gray-700 border border-gray-600 rounded-lg py-3 px-4 focus:outline-none focus:ring-2 focus:ring-red-500"
                        placeholder={`Enter your ${cryptoMethod.toUpperCase()} address`}
                      />
                    </div>

                    <div className="mb-6">
                      <label className="block text-gray-300 mb-2">
                        Withdrawal Method
                      </label>
                      <div className="flex gap-4">
                        <button
                          type="button"
                          onClick={() => setCryptoMethod("btc")}
                          className={`py-2 px-4 rounded-lg font-medium transition-colors ${
                            cryptoMethod === "btc"
                              ? "bg-red-600"
                              : "bg-gray-700 hover:bg-gray-600"
                          }`}>
                          Bitcoin (BTC)
                        </button>
                        <button
                          type="button"
                          onClick={() => setCryptoMethod("xmr")}
                          className={`py-2 px-4 rounded-lg font-medium transition-colors ${
                            cryptoMethod === "xmr"
                              ? "bg-red-600"
                              : "bg-gray-700 hover:bg-gray-600"
                          }`}>
                          Monero (XMR)
                        </button>
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={isLoading || user.walletBalance <= 0}
                      className={`w-full py-3 px-4 rounded-lg font-bold flex items-center justify-center gap-2 transition-colors ${
                        isLoading
                          ? "bg-gray-600 cursor-not-allowed"
                          : user.walletBalance <= 0
                            ? "bg-gray-600 cursor-not-allowed"
                            : "bg-red-600 hover:bg-red-700"
                      }`}>
                      {isLoading ? (
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
                              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Processing...
                        </>
                      ) : user.walletBalance <= 0 ? (
                        "No funds available"
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
                              d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4"
                            />
                          </svg>
                          Request Withdrawal
                        </>
                      )}
                    </button>
                  </form>

                  <div className="mt-6 bg-gray-900/50 p-4 rounded-lg border border-gray-700">
                    <h3 className="text-lg font-bold text-red-400 mb-2">
                      Withdrawal Information:
                    </h3>
                    <ul className="space-y-2 text-sm text-gray-300">
                      <li className="flex items-start gap-2">
                        <span className="text-red-400">•</span>
                        <span>Processing time: 14 minutes</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-red-400">•</span>
                        <span>
                          Network fees will be deducted from the withdrawal
                          amount
                        </span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-red-400">•</span>
                        <span>
                          Double-check the withdrawal address before submitting
                        </span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-red-400">•</span>
                        <span>Minimum withdrawal: $10.00</span>
                      </li>
                    </ul>
                  </div>
                </div>
              )}

              <div className="bg-gray-800/30 rounded-xl p-6 border border-gray-700/50">
                <h3 className="text-xl font-bold text-red-400 mb-3">
                  Recent Transactions
                </h3>
                <div className="text-center py-8 text-gray-500">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-12 w-12 mx-auto mb-3"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  <p>No recent transactions</p>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
}
