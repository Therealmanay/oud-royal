'use client'

import { useState } from 'react'

export default function MobileMenu() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className="md:hidden">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="text-white p-2"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute top-16 left-0 right-0 bg-dark-brown text-white p-4">
          <nav className="space-y-4">
            <a href="/" className="block hover:text-gold">Home</a>
            <a href="/boutique" className="block hover:text-gold">Boutique</a>
            <a href="/panier" className="block hover:text-gold">Cart</a>
          </nav>
        </div>
      )}
    </div>
  )
}
