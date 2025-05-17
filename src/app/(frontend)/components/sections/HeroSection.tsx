'use client';

export const HeroSection = () => {
  return (
    <section className="relative bg-gradient-to-b from-gray-900 to-black border-b border-red-800/30">
      <div className="container mx-auto px-4 py-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Text Content */}
          <div className="text-center lg:text-left">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-red-500 to-amber-600">
                Stolen
              </span>{' '}
              CreditCards
            </h1>
            
            <p className="text-lg text-gray-300 mb-8 max-w-xl mx-auto lg:mx-0">
              These cards are extracted from compromised payment channels, 
              From ATM and POS Machines .<br/>
               Proceed at your own risk . 
            </p>


            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <button className="px-8 py-4 bg-gradient-to-r from-red-600 to-amber-600 hover:from-red-700 hover:to-amber-700 text-white font-bold rounded-xl transition-all shadow-lg hover:shadow-red-500/30 flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                Browse Cards
              </button>
            </div>

            {/* Trust Badges - Underground Edition */}
            <div className="mt-12 flex flex-wrap justify-center lg:justify-start gap-6">
              <div className="flex items-center gap-2 text-gray-300">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <span>24/7 Cryptocurrency Support</span>
              </div>
              <div className="flex items-center gap-2 text-gray-300">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                </svg>
                <span>Verified by Underground Community</span>
              </div>
            </div>
          </div>

          {/* Warning Card */}
          <div className="relative z-10">
            <div className="relative bg-black/50 backdrop-blur-sm border border-red-800/50 rounded-2xl p-6 shadow-2xl transform hover:scale-[1.02] transition-all duration-300">
              <div className="bg-gradient-to-br from-gray-900 to-black rounded-xl overflow-hidden border border-red-800/30">
                <div className="p-6">
                  <div className="flex justify-between items-center mb-8">
                    <span className="text-2xl font-bold text-red-500">[REDACTED]</span>
                    <div className="flex space-x-2">
                      <div className="w-10 h-6 bg-red-600 rounded-sm"></div>
                      <div className="w-10 h-6 bg-gray-800 rounded-sm"></div>
                    </div>
                  </div>
                  
                  <div className="bg-gray-800/50 p-4 rounded-lg mb-6">
                    <div className="text-gray-400 text-sm mb-1">Asset Identifier</div>
                    <div className="text-white text-xl font-mono tracking-widest">•••• •••• •••• 4242</div>
                  </div>

                  <div className="space-y-4 text-sm">
                    <div className="flex justify-between text-red-400">
                      <span>Untraceable Transactions</span>
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M12.316 3.051a1 1 0 01.633 1.265l-4 12a1 1 0 11-1.898-.632l4-12a1 1 0 011.265-.633zM5.707 6.293a1 1 0 010 1.414L3.414 10l2.293 2.293a1 1 0 11-1.414 1.414l-3-3a1 1 0 010-1.414l3-3a1 1 0 011.414 0zm8.586 0a1 1 0 011.414 0l3 3a1 1 0 010 1.414l-3 3a1 1 0 11-1.414-1.414L16.586 10l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div className="flex justify-between text-green-400">
                      <span>Global ATM Access</span>
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
                      </svg>
                    </div>
                  </div>
                </div>
                <div className="bg-gradient-to-r from-red-600 to-amber-600 h-1"></div>
              </div>
            </div>

            {/* Disclaimer Text */}
            <div className="mt-6 text-center text-xs text-red-400/70 max-w-sm mx-auto">
              * Digital assets are provided as-is. Users assume all responsibility.
              Not available in prohibited jurisdictions. Cryptocurrency only.
            </div>
          </div>
        </div>
      </div>

      {/* Animated Warning Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-72 h-72 bg-red-500 rounded-full filter blur-3xl opacity-5 animate-blob"></div>
        <div className="absolute top-1/2 right-0 w-96 h-96 bg-amber-500 rounded-full filter blur-3xl opacity-5 animate-blob animation-delay-3000"></div>
      </div>
    </section>
  );
};