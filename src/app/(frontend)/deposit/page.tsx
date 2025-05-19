'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Topbar } from '../components/Topbar';
import { Footer } from '../components/Footer';


type User = {
  id: number;
  username: string;
  walletBalance: number;
  btcWalletAddress: string;
  xmrWalletAddress: string;
};

type DepositMethod = 'btc' | 'xmr';

export default function DepositPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [method, setMethod] = useState<DepositMethod>('btc');
  const [copied, setCopied] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch user data
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch('/api/users/me');
        const data = await res.json();
        setUser(data.user);
      } catch (err) {
        console.error('Failed to fetch user data:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUser();
  }, []);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-500"></div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <p className="text-red-500">Failed to load user data</p>
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
              Deposit Funds
            </h1>
            <p className="text-gray-400 mt-1">Current balance: ${user.walletBalance.toFixed(2)}</p>
          </div>

          <div className="bg-gray-800/50 rounded-xl p-6 mb-6 border border-red-800/30">
            <div className="mb-6">
              <label className="block text-gray-300 mb-2">Deposit Method</label>
              <div className="flex gap-4">
                <button
                  type="button"
                  onClick={() => setMethod('btc')}
                  className={`py-2 px-4 rounded-lg font-medium transition-colors ${
                    method === 'btc' ? 'bg-red-600' : 'bg-gray-700 hover:bg-gray-600'
                  }`}
                >
                  Bitcoin (BTC)
                </button>
                <button
                  type="button"
                  onClick={() => setMethod('xmr')}
                  className={`py-2 px-4 rounded-lg font-medium transition-colors ${
                    method === 'xmr' ? 'bg-red-600' : 'bg-gray-700 hover:bg-gray-600'
                  }`}
                >
                  Monero (XMR)
                </button>
              </div>
            </div>

            <div className="mb-6">
              <label className="block text-gray-300 mb-2">Send {method.toUpperCase()} to:</label>
              <div className="bg-gray-900 p-4 rounded-lg relative">
                <code className="text-sm break-all">
                  {method === 'btc' ? user.btcWalletAddress : user.xmrWalletAddress}
                </code>
                <button
                  type="button"
                  onClick={() => copyToClipboard(method === 'btc' ? user.btcWalletAddress : user.xmrWalletAddress)}
                  className="absolute right-2 top-2 bg-gray-700 hover:bg-gray-600 p-1 rounded"
                  title="Copy to clipboard"
                >
                  {copied ? (
                    <span className="text-xs text-green-400">Copied!</span>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            <div className="bg-gray-900/50 p-4 rounded-lg border border-gray-700">
              <h3 className="text-lg font-bold text-red-400 mb-2">Important Notes:</h3>
              <ul className="space-y-2 text-sm text-gray-300">
                <li className="flex items-start gap-2">
                  <span className="text-red-400">•</span>
                  <span>Minimum deposit: $10.00 USD equivalent</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-400">•</span>
                  <span>Send only {method.toUpperCase()} to this address</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-400">•</span>
                  <span>Funds will be credited after 3 network confirmations</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-400">•</span>
                  <span>Processing time: 15-30 minutes typically</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-400">•</span>
                  <span>Double-check the address before sending</span>
                </li>
              </ul>
            </div>
          </div>

          <div className="bg-gray-800/30 rounded-xl p-6 border border-gray-700/50">
            <h3 className="text-xl font-bold text-red-400 mb-3">How to Deposit</h3>
            <ol className="space-y-4 text-gray-300">
              <li className="flex items-start gap-3">
                <span className="bg-red-600 rounded-full w-6 h-6 flex items-center justify-center flex-shrink-0">1</span>
                <div>
                  <p className="font-medium">Copy the {method.toUpperCase()} address above</p>
                  <p className="text-sm text-gray-400 mt-1">Click the copy icon to copy the address to your clipboard</p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <span className="bg-red-600 rounded-full w-6 h-6 flex items-center justify-center flex-shrink-0">2</span>
                <div>
                  <p className="font-medium">Send your {method.toUpperCase()} from your wallet</p>
                  <p className="text-sm text-gray-400 mt-1">Send at least $10.00 USD equivalent</p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <span className="bg-red-600 rounded-full w-6 h-6 flex items-center justify-center flex-shrink-0">3</span>
                <div>
                  <p className="font-medium">Wait for confirmations</p>
                  <p className="text-sm text-gray-400 mt-1">Your balance will update automatically after 3 network confirmations</p>
                </div>
              </li>
            </ol>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}