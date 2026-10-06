import React, { useState, useEffect } from 'react';

/**
 * PLACEHOLDER FOR MANUAL PNG LOGO INSERTION:
 * Save your logo file as `logo.png` inside the `/public` directory (i.e. `/public/logo.png`).
 * It will immediately be loaded and rendered transparently in the center slot below!
 */
const LOGO_SRC = '/logo.png';

export const Navbar: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [hasImageLoaded, setHasImageLoaded] = useState(false);
  const [hasImageError, setHasImageError] = useState(false);
  const [isScrolledDown, setIsScrolledDown] = useState(false);
  const [isHoveredDown, setIsHoveredDown] = useState(false);
  const [isNavbarHovered, setIsNavbarHovered] = useState(false);

  // Detect scroll down
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolledDown(window.scrollY > 40);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Detect mouse hovering down into the page body vs top navbar
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      // If mouse is below 80px from top, cursor has hovered down into the content
      setIsHoveredDown(e.clientY > 80);
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const scrollTo = (id: string) => {
    setMobileMenuOpen(false);
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Shrink to center logo only when cursor has hovered down (or scrolled down) and is NOT hovering over navbar
  const shouldShrink = (isScrolledDown || isHoveredDown) && !isNavbarHovered;

  return (
    <header className="fixed top-0 left-0 right-0 z-50 pointer-events-none pt-2 sm:pt-3 px-3 sm:px-6 transition-all duration-300">
      <div className="max-w-5xl mx-auto flex items-center justify-center">
        
        {/* Navbar Container:
            - When NOT hovered by cursor: transparent background & border.
            - When hovered by cursor: frosted purple backdrop.
            - When shouldShrink is true: shrinks to center (w-12 h-12) showing only the miniaturized logo.
        */}
        <div
          onMouseEnter={() => setIsNavbarHovered(true)}
          onMouseLeave={() => setIsNavbarHovered(false)}
          className={`pointer-events-auto transition-all duration-300 ease-out relative flex items-center justify-center ${
            shouldShrink
              ? 'shape-octagon w-12 h-12 sm:w-14 sm:h-14 p-1 ' +
                (isNavbarHovered
                  ? 'bg-[#3E1F4D]/95 backdrop-blur-xl border border-[#E2A9F0]/60 shadow-[0_8px_30px_rgba(62,31,77,0.85)]'
                  : 'bg-transparent border border-transparent shadow-none')
              : 'shape-octagon w-full h-14 sm:h-16 px-4 sm:px-6 ' +
                (isNavbarHovered
                  ? 'bg-[#3E1F4D]/90 backdrop-blur-md border border-[#E2A9F0]/30 shadow-2xl'
                  : 'bg-transparent border border-transparent shadow-none')
          }`}
        >
          {/* Symmetrical 3-Column Layout ensuring dead-center alignment:
              Col 1: Left Nav Links (flex-1, justify-end)
              Col 2: Logo Slot (shrink-0, exact center)
              Col 3: Right Nav Links (flex-1, justify-start)
          */}
          <div className="w-full h-full flex items-center justify-between">
            
            {/* 1. Left Navigation Links (ABOUT · INSTRUCTIONS) */}
            <nav
              className={`hidden md:flex flex-1 items-center justify-end gap-5 lg:gap-7 pr-6 lg:pr-8 text-xs font-mono tracking-widest text-[#E8E2D0] transition-all duration-300 ${
                shouldShrink
                  ? 'opacity-0 w-0 overflow-hidden pointer-events-none -translate-x-4'
                  : 'opacity-100 translate-x-0'
              }`}
            >
              <button
                onClick={() => scrollTo('about')}
                className="hover:text-[#E2A9F0] hover:underline underline-offset-8 transition-colors cursor-pointer uppercase py-1 whitespace-nowrap text-[11px] lg:text-xs"
              >
                ABOUT
              </button>
              <span className="text-[#E2A9F0]/40 select-none text-[10px]" aria-hidden="true">★</span>
              <button
                onClick={() => scrollTo('instructions')}
                className="hover:text-[#E2A9F0] hover:underline underline-offset-8 transition-colors cursor-pointer uppercase py-1 whitespace-nowrap text-[11px] lg:text-xs"
              >
                INSTRUCTIONS
              </button>
            </nav>

            {/* Mobile Left Spacer to guarantee exact centering on mobile screens */}
            <div className={`md:hidden flex-1 flex items-center justify-start ${shouldShrink ? 'hidden' : 'block'}`}>
              <div className="w-7 h-7 pointer-events-none" aria-hidden="true" />
            </div>

            {/* 2. Dead-Center Transparent & Miniaturized Logo Slot */}
            <div className="shrink-0 flex items-center justify-center z-10 pointer-events-auto">
              <a
                href="#hero"
                onClick={(e) => {
                  e.preventDefault();
                  scrollTo('hero');
                }}
                className="group block relative p-0.5 shape-octagon-badge bg-transparent hover:border-[#E2A9F0] transition-all duration-300"
                title="Click to scroll to top (Place logo.png in /public to insert custom PNG logo)"
              >
                {/* Miniaturized, Transparent Octagon Container */}
                <div
                  className={`w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 aspect-square shape-octagon-badge bg-transparent overflow-hidden flex items-center justify-center transition-colors ${
                    isNavbarHovered
                      ? 'border border-[#E2A9F0]/60 group-hover:border-[#E2A9F0]'
                      : 'border border-[#E2A9F0]/30'
                  }`}
                >
                  {/* Transparent Custom PNG logo */}
                  <img
                    src={LOGO_SRC}
                    alt="College Logo"
                    onLoad={() => {
                      setHasImageLoaded(true);
                      setHasImageError(false);
                    }}
                    onError={() => {
                      setHasImageLoaded(false);
                      setHasImageError(true);
                    }}
                    className={`w-full h-full object-contain p-0.5 bg-transparent group-hover:scale-110 transition-transform duration-300 ${
                      hasImageLoaded ? 'block' : 'hidden'
                    }`}
                  />

                  {/* Clean, Transparent, Miniaturized placeholder while awaiting manual PNG file */}
                  {(!hasImageLoaded || hasImageError) && (
                    <div className="w-full h-full flex flex-col items-center justify-center p-0.5 text-center bg-transparent text-[#E2A9F0] select-none">
                      <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#E2A9F0]/90 group-hover:scale-110 transition-transform" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                        <rect x="3" y="3" width="18" height="18" rx="0" strokeDasharray="2 2" />
                        <circle cx="8.5" cy="8.5" r="1.5" fill="currentColor" />
                        <polyline points="21 15 16 10 5 21" />
                      </svg>
                      <span className="text-[6px] sm:text-[7px] font-mono font-bold tracking-tighter text-[#E8E2D0]/90 leading-none uppercase mt-0.5">
                        PNG
                      </span>
                    </div>
                  )}
                </div>
              </a>
            </div>

            {/* 3. Right Navigation Links (LOCATION · REGISTER) */}
            <nav
              className={`hidden md:flex flex-1 items-center justify-start gap-5 lg:gap-7 pl-6 lg:pr-8 text-xs font-mono tracking-widest text-[#E8E2D0] transition-all duration-300 ${
                shouldShrink
                  ? 'opacity-0 w-0 overflow-hidden pointer-events-none translate-x-4'
                  : 'opacity-100 translate-x-0'
              }`}
            >
              <button
                onClick={() => scrollTo('location')}
                className="hover:text-[#E2A9F0] hover:underline underline-offset-8 transition-colors cursor-pointer uppercase py-1 whitespace-nowrap text-[11px] lg:text-xs"
              >
                LOCATION
              </button>
              <span className="text-[#E2A9F0]/40 select-none text-[10px]" aria-hidden="true">★</span>
              <button
                onClick={() => scrollTo('register')}
                className="shape-hexagon-btn px-4 sm:px-5 py-1.5 sm:py-2 bg-[#B01FD6] hover:bg-[#C46DE0] text-white font-semibold transition-all cursor-pointer shadow-[0_0_12px_rgba(176,31,214,0.4)] uppercase whitespace-nowrap text-[11px] lg:text-xs"
              >
                REGISTER
              </button>
            </nav>

            {/* Mobile Hamburger Menu Toggle Button */}
            <div className={`md:hidden flex-1 flex items-center justify-end ${shouldShrink ? 'hidden' : 'block'}`}>
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-1.5 text-[#E8E2D0] hover:text-[#E2A9F0] focus:outline-none cursor-pointer"
                aria-label="Toggle Navigation Menu"
                aria-expanded={mobileMenuOpen}
              >
                {mobileMenuOpen ? (
                  /* Close X Icon */
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                ) : (
                  /* Standard Hamburger 3 Bars Icon */
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                )}
              </button>
            </div>

          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu in Octagon Shape */}
      {mobileMenuOpen && !shouldShrink && (
        <div className="shape-octagon pointer-events-auto max-w-xs mx-auto mt-2 md:hidden bg-[#3E1F4D]/98 border border-[#E2A9F0]/30 px-5 py-5 space-y-3 font-mono text-xs tracking-wider shadow-2xl animate-fadeIn">
          <button
            onClick={() => scrollTo('about')}
            className="block w-full text-left py-2 text-[#E8E2D0] hover:text-[#E2A9F0] border-b border-white/5 uppercase"
          >
            ABOUT
          </button>
          <button
            onClick={() => scrollTo('instructions')}
            className="block w-full text-left py-2 text-[#E8E2D0] hover:text-[#E2A9F0] border-b border-white/5 uppercase"
          >
            INSTRUCTIONS
          </button>
          <button
            onClick={() => scrollTo('location')}
            className="block w-full text-left py-2 text-[#E8E2D0] hover:text-[#E2A9F0] border-b border-white/5 uppercase"
          >
            LOCATION
          </button>
          <button
            onClick={() => scrollTo('register')}
            className="shape-hexagon-btn block w-full py-2.5 text-center bg-[#B01FD6] text-white font-bold uppercase mt-3 shadow-[0_0_15px_rgba(176,31,214,0.4)]"
          >
            REGISTER NOW
          </button>
        </div>
      )}
    </header>
  );
};
