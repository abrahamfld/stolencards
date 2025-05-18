'use client';

import { use, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Topbar } from '../../components/Topbar';
import { Footer } from '../../components/Footer';

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

export default function CardCheckoutPage({ params }: { params: Promise<PageParams> }) {
  const router = useRouter();
  const { id } = use(params);
  const [card, setCard] = useState<CreditCard | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [timer, setTimer] = useState(900);
  const [paymentMethod, setPaymentMethod] = useState<'btc' | 'xmr' | 'wallet'>('wallet');
  const [copied, setCopied] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch card data
        const cardRes = await fetch(`/api/credit-cards/${id}`);
        const cardData = await cardRes.json();
        setCard(cardData);

        // Fetch user data
        const userRes = await fetch('/api/users/me');
        const userData = await userRes.json();
        setUser(userData.user);
      } catch (error) {
        console.error('Error fetching data:', error);
        router.push('/');
      }
    };

    fetchData();
  }, [id, router]);

  useEffect(() => {
    const countdown = setInterval(() => {
      setTimer((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(countdown);
  }, []);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
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
        purchasedBy: user.id
      };

      const response = await fetch('/api/purchased-cards', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(purchaseData),
      });

      if (!response.ok) {
        throw new Error('Failed to record purchase');
      }

      const data = await response.json();
      return data;
    } catch (err) {
      console.error('Error recording purchase:', err);
      throw err;
    }
  };

  const handleWalletPayment = async () => {
    if (!user || !card) return;
    
    if (user.walletBalance < card.price) {
      setError('Insufficient funds in your wallet');
      return;
    }

    setIsProcessing(true);
    setError('');

    try {
      // Deduct from user's wallet
      const updatedBalance = user.walletBalance - card.price;
      const updateRes = await fetch(`/api/users/${user.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ walletBalance: updatedBalance }),
      });

      if (!updateRes.ok) {
        throw new Error('Failed to update wallet balance');
      }

      // Record the purchase
      await recordPurchase();

      // Update local user state
      setUser({ ...user, walletBalance: updatedBalance });
      setPaymentSuccess(true);
      
    } catch (err) {
      console.error('Payment error:', err);
      setError('Payment failed. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  if (!card || !user) {
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
        <div className="max-w-4xl mx-auto">
          <div className="mb-8 border-b border-red-800/50 pb-4">
            <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-red-500 to-amber-600">
              Secure Checkout
            </h1>
            <div className="flex items-center gap-2 mt-2 text-red-400">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.414-1.415L11 9.586V6z" clipRule="evenodd" />
              </svg>
              <span>Time remaining: {formatTime(timer)}</span>
            </div>
          </div>

          <div className="bg-gray-800/50 rounded-xl p-6 mb-8 border border-red-800/30">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h2 className="text-xl font-bold">{card.type} •••• {card.number.slice(-4)}</h2>
                <p className="text-gray-400">Balance: ${card.balance.toLocaleString()}</p>
              </div>
              <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-red-500 to-amber-600">
                ${card.price}
              </span>
            </div>
            <div className="flex gap-4 text-sm text-gray-300">
              <div>
                <span className="block text-gray-400">Country</span>
                {card.country}
              </div>
              <div>
                <span className="block text-gray-400">Expires</span>
                {card.expiry}
              </div>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="space-y-6">
              <h3 className="text-xl font-bold text-red-400">Payment Methods</h3>
              <div className="space-y-4">
                <div 
                  className={`p-4 rounded-lg border cursor-pointer transition-all ${
                    paymentMethod === 'wallet' ? 'border-red-500 bg-red-900/20' : 'border-gray-700 hover:border-red-500/50'
                  }`}
                  onClick={() => setPaymentMethod('wallet')}
                >
                  <div className="flex items-center gap-3">
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                    <div>
                      <span className="font-bold">Wallet Balance</span>
                      <p className="text-sm text-gray-400">${user.walletBalance.toFixed(2)} available</p>
                    </div>
                  </div>
                </div>
                <div 
                  className={`p-4 rounded-lg border cursor-pointer transition-all ${
                    paymentMethod === 'btc' ? 'border-red-500 bg-red-900/20' : 'border-gray-700 hover:border-red-500/50'
                  }`}
                  onClick={() => setPaymentMethod('btc')}
                >
                  <div className="flex items-center gap-3">
                    <img src="/bitcoin-logo.png" className="w-8 h-8" alt="Bitcoin" />
                    <span className="font-bold">Bitcoin (BTC)</span>
                  </div>
                </div>
                <div 
                  className={`p-4 rounded-lg border cursor-pointer transition-all ${
                    paymentMethod === 'xmr' ? 'border-red-500 bg-red-900/20' : 'border-gray-700 hover:border-red-500/50'
                }`}
                  onClick={() => setPaymentMethod('xmr')}
                >
                  <div className="flex items-center gap-3">
                    <img src="/monero-logo.png" className="w-8 h-8" alt="Monero" />
                    <span className="font-bold">Monero (XMR)</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-gray-800/50 p-6 rounded-xl border border-red-800/30">
              {paymentMethod === 'wallet' ? (
                <div className="space-y-6">
                  <h3 className="text-xl font-bold text-red-400">Wallet Payment</h3>
                  <div className="space-y-4">
                    <div>
                      <span className="block text-gray-400 mb-1">Your wallet balance:</span>
                      <div className="p-2 bg-gray-900 rounded-md">
                        ${user.walletBalance.toFixed(2)}
                      </div>
                    </div>
                    <div>
                      <span className="block text-gray-400 mb-1">Amount to pay:</span>
                      <div className="p-2 bg-gray-900 rounded-md">
                        ${card.price.toFixed(2)}
                      </div>
                    </div>
                    {error && (
                      <div className="text-red-400 text-sm">{error}</div>
                    )}
                    {paymentSuccess ? (
                      <div className="bg-green-900/30 p-4 rounded-lg border border-green-700/50">
                        <div className="flex items-center gap-2">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                          </svg>
                          <span>Payment successful! Your card details will be delivered shortly.</span>
                        </div>
                      </div>
                    ) : (
                      <button
                        onClick={handleWalletPayment}
                        disabled={isProcessing || user.walletBalance < card.price}
                        className={`w-full py-3 px-4 rounded-lg font-bold transition-colors ${
                          isProcessing 
                            ? 'bg-gray-600 cursor-not-allowed'
                            : user.walletBalance >= card.price
                              ? 'bg-red-600 hover:bg-red-700'
                              : 'bg-gray-700 cursor-not-allowed'
                        }`}
                      >
                        {isProcessing ? 'Processing...' : 'Pay with Wallet'}
                      </button>
                    )}
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <h3 className="text-xl font-bold text-red-400">Payment Instructions</h3>
                  <div>
                    <span className="block text-gray-400 mb-1">Send exact amount:</span>
                    <div className="flex items-center gap-2">
                      <code className="p-2 bg-gray-900 rounded-md">{card.price} USD</code>
                      <button 
                        onClick={() => copyToClipboard(card.price.toString())}
                        className="text-red-400 hover:text-red-300 transition-colors"
                      >
                        {copied ? '✓ Copied' : 'Copy'}
                      </button>
                    </div>
                  </div>
                  <div>
                    <span className="block text-gray-400 mb-1">To wallet address:</span>
                    <div className="flex items-center gap-2">
                      <code className="p-2 bg-gray-900 rounded-md break-all">
                        {paymentMethod === 'btc' ? user.btcWalletAddress : user.xmrWalletAddress}
                      </code>
                      <button 
                        onClick={() => copyToClipboard(paymentMethod === 'btc' ? user.btcWalletAddress : user.xmrWalletAddress)}
                        className="text-red-400 hover:text-red-300 transition-colors"
                      >
                        {copied ? '✓ Copied' : 'Copy'}
                      </button>
                    </div>
                  </div>
                  <div className="mt-6">
                    <div className="bg-gray-900 p-4 rounded-lg">
                      <img 
                        src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${paymentMethod === 'btc' ? 'bitcoin' : 'monero'}:${paymentMethod === 'btc' ? user.btcWalletAddress : user.xmrWalletAddress}?amount=${card.price}`}
                        alt={`${paymentMethod.toUpperCase()} QR Code`}
                        className="w-32 h-32 mx-auto"
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="mt-8 text-sm text-gray-400 border-t border-red-800/30 pt-4">
            <p>• Transaction will be automatically confirmed after payment verification</p>
            <p>• Funds will be frozen if payment isn't completed within time limit</p>
            <p>• All transactions are final and irreversible</p>
          </div>

          <div className="mt-8 bg-gray-800/50 p-4 rounded-lg border border-red-800/30">
            <div className="flex items-center gap-2 text-red-400 mb-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span>End-to-End Encrypted Support Chat</span>
            </div>
            <div className="space-y-2 mt-4">
              <div className="bg-gray-900 p-3 rounded-lg">
                <span className="text-red-400">System:</span> {paymentSuccess 
                  ? 'Payment verified. Card details will be delivered shortly.' 
                  : paymentMethod === 'wallet'
                    ? 'Ready to process wallet payment.'
                    : 'Payment will be verified after 3 network confirmations.'}
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}