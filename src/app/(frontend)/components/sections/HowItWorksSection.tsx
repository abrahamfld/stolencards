'use client';

export const HowItWorksSection = () => {
  return (
    <section className="relative bg-black py-24 border-t border-red-800/30">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-16 bg-clip-text text-transparent bg-gradient-to-r from-red-500 to-amber-600">
          Resource Acquisition & Distribution Protocol
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-20">
          {/* POS Acquisition */}
          <div className="bg-gradient-to-br from-gray-900 to-black p-8 rounded-xl border border-red-800/30">
            <div className="flex items-center gap-4 mb-6">
              <div className="p-3 bg-red-500/20 rounded-lg">
                <svg className="w-8 h-8 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-red-400">Retail Terminal Extraction</h3>
            </div>
            <p className="text-gray-400 mb-4">
              Specialized collection devices temporarily interface with payment authorization systems
              during transaction verification phases.
            </p>
            <div className="text-sm font-mono text-red-300/70 space-y-2">
              <p># MEMORY SCRAPING TECHNIQUES</p>
              <p># WIRELESS SNIFFING PROTOCOLS</p>
              <p># FIRMWARE-LEVEL PERSISTENCE</p>
            </div>
          </div>

          {/* ATM Collection */}
          <div className="bg-gradient-to-br from-gray-900 to-black p-8 rounded-xl border border-red-800/30">
            <div className="flex items-center gap-4 mb-6">
              <div className="p-3 bg-amber-500/20 rounded-lg">
                <svg className="w-8 h-8 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-amber-400">Automated Collection Nodes</h3>
            </div>
            <p className="text-gray-400 mb-4">
              Modified transaction interfaces with secondary data capture capabilities,
              operating within standard service maintenance windows.
            </p>
            <div className="text-sm font-mono text-amber-300/70 space-y-2">
              <p># DEEP-INSERT MECHANISMS</p>
              <p># NFC REPLAY VECTORS</p>
              <p># TRACK-2 BUFFER OVERFLOWS</p>
            </div>
          </div>
        </div>

        {/* Data Processing Flow */}
        <div className="bg-gradient-to-br from-black to-gray-900 p-8 rounded-xl border border-red-800/30 relative">
          <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-red-500 px-4 py-1 rounded-full text-xs font-bold">
            DATA PROCESSING PIPELINE
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="mb-2 text-red-400 font-mono text-sm">RAW CAPTURE</div>
              <div className="h-1 bg-gradient-to-r from-red-600 to-transparent"></div>
            </div>
            <div className="text-center">
              <div className="mb-2 text-amber-400 font-mono text-sm">FILTERING</div>
              <div className="h-1 bg-gradient-to-r from-red-500 to-amber-500"></div>
            </div>
            <div className="text-center">
              <div className="mb-2 text-green-400 font-mono text-sm">VALIDATION</div>
              <div className="h-1 bg-gradient-to-r from-amber-500 to-green-500"></div>
            </div>
            <div className="text-center">
              <div className="mb-2 text-white font-mono text-sm">DISTRIBUTION</div>
              <div className="h-1 bg-gradient-to-r from-green-500 to-transparent"></div>
            </div>
          </div>

          <div className="mt-8 grid grid-cols-1 md:grid-cols-4 gap-6 text-gray-400 text-sm">
            <div>
              <span className="block mb-1 text-red-400">1.</span>
              Initial data harvesting from various collection points
            </div>
            <div>
              <span className="block mb-1 text-amber-400">2.</span>
              Signal isolation and noise reduction protocols
            </div>
            <div>
              <span className="block mb-1 text-green-400">3.</span>
              Automated balance verification & geographic sorting
            </div>
            <div>
              <span className="block mb-1 text-white">4.</span>
              Secure delivery through encrypted channels
            </div>
          </div>
        </div>

        {/* Legal Disclaimer */}
        <div className="mt-12 text-center text-xs text-red-400/50 max-w-3xl mx-auto">
          * This educational overview demonstrates hypothetical data security vulnerabilities. 
          All referenced techniques are presented for academic study of payment system security.
          Actual implementation violates numerous international laws. We do not condone 
          or participate in any illegal activities.
        </div>
      </div>

      {/* Animated Background Elements */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute top-1/3 left-1/4 w-48 h-48 bg-red-500 rounded-full filter blur-3xl opacity-5 animate-pulse"></div>
        <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-amber-500 rounded-full filter blur-3xl opacity-5 animate-pulse animation-delay-2000"></div>
      </div>
    </section>
  );
};