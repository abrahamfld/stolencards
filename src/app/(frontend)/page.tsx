import Head from "next/head";
import "./styles.css";

import { Topbar } from "./components/Topbar";
import { Footer } from "./components/Footer";
import { CardGridSection } from "./components/sections/CardGridSection";
import { HeroSection } from "./components/sections/HeroSection";
import Link from "next/link";


export default function Home() {
  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <Topbar />
      <Head>
        <title>StolenCards | Buy CC, Dumps, Fullz </title>
      </Head>

      {/* Navbar */}
      <nav className="bg-black p-4 flex justify-between items-center">
        <Link href="/">
          <h1 className="text-xl font-bold cursor-pointer">StolenCards.cc</h1>
        </Link>
        <div className="flex space-x-4">
          <Link href="#cards" className="hover:text-yellow-400">
            Shop
          </Link>
          <Link href="#reviews" className="hover:text-yellow-400">
            Reviews
          </Link>
          <Link href="#faq" className="hover:text-yellow-400">
            FAQ
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <HeroSection />

      {/* CardGridSection */}
      <CardGridSection />

      {/* Fake Testimonials */}
      <section id="reviews" className="p-8 bg-gray-800">
        <h2 className="text-3xl font-bold mb-8 text-center">
          Trusted by Hackers
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[
            {
              name: "DarkH4x0r",
              review: "Bought 5 cards, all worked perfectly!",
            },
            { name: "AnonGhost", review: "Legit seller, fast delivery." },
          ].map((testimonial, index) => (
            <div key={index} className="bg-gray-700 p-6 rounded-lg">
              <p className="italic mb-2">"{testimonial.review}"</p>
              <p className="font-bold text-yellow-400">— {testimonial.name}</p>
            </div>
          ))}
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="p-8">
        <h2 className="text-3xl font-bold mb-8 text-center">FAQ</h2>
        <div className="space-y-4 max-w-2xl mx-auto">
          {[
            {
              question: "Is this legal?",
              answer: "We operate in a gray area. Use at your own risk.",
            },
            {
              question: "How do I receive the cards?",
              answer: "We send via encrypted channels after payment.",
            },
          ].map((item, index) => (
            <div key={index} className="bg-gray-800 p-4 rounded-lg">
              <h3 className="font-bold mb-2">{item.question}</h3>
              <p>{item.answer}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-black p-6 text-center">
        <p>© 2024 EliteCards.cc | Tor Hidden Service: elitecards.onion</p>
      </footer>
      <Footer />
    </div>
  );
}
