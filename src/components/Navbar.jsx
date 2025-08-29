import React, { useState, useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import ThemeToggle from './ThemeToggle';

const Navbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navbarRef = useRef(null);
  const mobileMenuRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      const scrolled = window.scrollY > 16;
      
      if (navbarRef.current) {
        if (scrolled) {
          navbarRef.current.classList.add('nav-scrolled');
        } else {
          navbarRef.current.classList.remove('nav-scrolled');
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    // Animate navbar links on mount
    const ctx = gsap.context(() => {
      gsap.fromTo('.nav-link', 
        { opacity: 0, y: -20 },
        { 
          opacity: 1, 
          y: 0, 
          duration: 0.6, 
          stagger: 0.1,
          ease: "power2.out"
        }
      );
    }, navbarRef);

    return () => ctx.revert();
  }, []);

  useEffect(() => {
    if (!mobileMenuRef.current) return;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    if (mobileMenuOpen) {
      gsap.fromTo(mobileMenuRef.current,
        { opacity: 0, x: '100%' },
        { opacity: 1, x: '0%', duration: 0.4, ease: "power2.out" }
      );
    } else {
      gsap.to(mobileMenuRef.current, {
        opacity: 0,
        x: '100%',
        duration: 0.3,
        ease: "power2.in"
      });
    }
  }, [mobileMenuOpen]);

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
    setMobileMenuOpen(false);
  };

  const handleLogin = (type) => {
    alert(`${type} login functionality coming soon!`);
  };

  return (
    <nav 
      ref={navbarRef}
      className="fixed top-0 left-0 right-0 z-50 transition-all duration-300 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-700"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16 lg:h-20">
          {/* Logo */}
          <div className="flex-shrink-0">
            <img 
              src="https://res.cloudinary.com/dgus6y6lm/image/upload/v1756502505/bhavanilogo_jjef0a.jpg"
              alt="Bhavani Chit Funds Logo"
              className="h-12 lg:h-16 w-auto object-contain"
            />
          </div>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-8">
            <a 
              href="#home" 
              onClick={(e) => { e.preventDefault(); scrollToSection('home'); }}
              className="nav-link text-gray-700 hover:text-violet-600 transition-colors duration-200 dark:text-gray-300 dark:hover:text-violet-400"
            >
              Home
            </a>
            <a 
              href="#schemes" 
              onClick={(e) => { e.preventDefault(); scrollToSection('schemes'); }}
              className="nav-link text-gray-700 hover:text-violet-600 transition-colors duration-200 dark:text-gray-300 dark:hover:text-violet-400"
            >
              Schemes
            </a>
            <a 
              href="#how-it-works" 
              onClick={(e) => { e.preventDefault(); scrollToSection('how-it-works'); }}
              className="nav-link text-gray-700 hover:text-violet-600 transition-colors duration-200 dark:text-gray-300 dark:hover:text-violet-400"
            >
              How It Works
            </a>
            <a 
              href="#features" 
              onClick={(e) => { e.preventDefault(); scrollToSection('features'); }}
              className="nav-link text-gray-700 hover:text-violet-600 transition-colors duration-200 dark:text-gray-300 dark:hover:text-violet-400"
            >
              Features
            </a>
            <a 
              href="#reports" 
              onClick={(e) => { e.preventDefault(); scrollToSection('reports'); }}
              className="nav-link text-gray-700 hover:text-violet-600 transition-colors duration-200 dark:text-gray-300 dark:hover:text-violet-400"
            >
              Reports
            </a>
            <a 
              href="#contact" 
              onClick={(e) => { e.preventDefault(); scrollToSection('contact'); }}
              className="nav-link text-gray-700 hover:text-violet-600 transition-colors duration-200 dark:text-gray-300 dark:hover:text-violet-400"
            >
              Contact
            </a>
          </div>

          {/* Desktop Buttons */}
          <div className="hidden lg:flex items-center space-x-4">
            <ThemeToggle />
            <button
              onClick={() => handleLogin('Client')}
              className="px-5 py-2.5 text-sm font-medium text-violet-600 border border-violet-600 rounded-xl hover:bg-violet-600 hover:text-white transition-all duration-200 shadow-sm hover:shadow-md dark:text-violet-400 dark:border-violet-400 dark:hover:bg-violet-400 dark:hover:text-gray-900"
            >
              Client Login
            </button>
            <button
              onClick={() => handleLogin('Admin')}
              className="px-5 py-2.5 text-sm font-medium text-white bg-violet-600 rounded-xl hover:bg-violet-700 transition-all duration-200 shadow-sm hover:shadow-md dark:bg-violet-500 dark:hover:bg-violet-600"
            >
              Admin Login
            </button>
          </div>

          {/* Mobile menu button */}
          <div className="lg:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="text-gray-700 hover:text-violet-600 transition-colors duration-200 dark:text-gray-300 dark:hover:text-violet-400"
              aria-label="Toggle mobile menu"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {mobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <>
          {/* Backdrop */}
          <div 
            className="lg:hidden fixed inset-0 top-16 bg-black/50 z-40 mobile-menu-backdrop"
            onClick={() => setMobileMenuOpen(false)}
          />
          
          {/* Mobile Menu */}
          <div 
            ref={mobileMenuRef}
            className="lg:hidden fixed left-0 right-0 top-16 bottom-0 bg-white dark:bg-gray-900 z-50 shadow-2xl border-t border-gray-200 dark:border-gray-700 mobile-menu-overlay"
            style={{ 
              backgroundColor: 'var(--tw-bg-opacity, 1)',
              '--tw-bg-opacity': '1',
              zIndex: 9999,
              height: 'calc(100vh - 4rem)'
            }}
          >
            <div className="flex flex-col h-full w-full">
              <div className="flex-1 px-4 py-8 space-y-6">
                <a 
                  href="#home" 
                  onClick={(e) => { e.preventDefault(); scrollToSection('home'); }}
                  className="block text-lg font-medium text-gray-700 hover:text-violet-600 transition-colors duration-200 dark:text-gray-300 dark:hover:text-violet-400 py-3 px-4 rounded-lg hover:bg-violet-50 dark:hover:bg-violet-900/20"
                >
                  Home
                </a>
                <a 
                  href="#schemes" 
                  onClick={(e) => { e.preventDefault(); scrollToSection('schemes'); }}
                  className="block text-lg font-medium text-gray-700 hover:text-violet-600 transition-colors duration-200 dark:text-gray-300 dark:hover:text-violet-400 py-3 px-4 rounded-lg hover:bg-violet-50 dark:hover:bg-violet-900/20"
                >
                  Schemes
                </a>
                <a 
                  href="#how-it-works" 
                  onClick={(e) => { e.preventDefault(); scrollToSection('how-it-works'); }}
                  className="block text-lg font-medium text-gray-700 hover:text-violet-600 transition-colors duration-200 dark:text-gray-300 dark:hover:text-violet-400 py-3 px-4 rounded-lg hover:bg-violet-50 dark:hover:bg-violet-900/20"
                >
                  How It Works
                </a>
                <a 
                  href="#features" 
                  onClick={(e) => { e.preventDefault(); scrollToSection('features'); }}
                  className="block text-lg font-medium text-gray-700 hover:text-violet-600 transition-colors duration-200 dark:text-gray-300 dark:hover:text-violet-400 py-3 px-4 rounded-lg hover:bg-violet-50 dark:hover:bg-violet-900/20"
                >
                  Features
                </a>
                <a 
                  href="#reports" 
                  onClick={(e) => { e.preventDefault(); scrollToSection('reports'); }}
                  className="block text-lg font-medium text-gray-700 hover:text-violet-600 transition-colors duration-200 dark:text-gray-300 dark:hover:text-violet-400 py-3 px-4 rounded-lg hover:bg-violet-50 dark:hover:bg-violet-900/20"
                >
                  Reports
                </a>
                <a 
                  href="#contact" 
                  onClick={(e) => { e.preventDefault(); scrollToSection('contact'); }}
                  className="block text-lg font-medium text-gray-700 hover:text-violet-600 transition-colors duration-200 dark:text-gray-300 dark:hover:text-violet-400 py-3 px-4 rounded-lg hover:bg-violet-50 dark:hover:bg-violet-900/20"
                >
                  Contact
                </a>
              </div>
              
              <div className="px-4 py-8 space-y-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
                <div className="flex justify-center">
                  <ThemeToggle />
                </div>
                <button
                  onClick={() => handleLogin('Client')}
                  className="w-full px-5 py-3 text-sm font-medium text-violet-600 border border-violet-600 rounded-xl hover:bg-violet-600 hover:text-white transition-all duration-200 dark:text-violet-400 dark:border-violet-400 dark:hover:bg-violet-400 dark:hover:text-gray-900 hover:shadow-md"
                >
                  Client Login
                </button>
                <button
                  onClick={() => handleLogin('Admin')}
                  className="w-full px-5 py-3 text-sm font-medium text-white bg-violet-600 rounded-xl hover:bg-violet-700 transition-all duration-200 dark:bg-violet-500 dark:hover:bg-violet-600 hover:shadow-md"
                >
                  Admin Login
                </button>
              </div>
            </div>
          </div>
        </>
      )}

      <style jsx>{`
        .nav-scrolled {
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
        }
        
        .dark .nav-scrolled {
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.3), 0 2px 4px -1px rgba(0, 0, 0, 0.2);
        }
      `}</style>
    </nav>
  );
};

export default Navbar;
