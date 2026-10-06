import React from 'react';

interface HeroProps {
  onRegisterClick: () => void;
  isRegistrationOpen: boolean;
}

export const Hero: React.FC<HeroProps> = ({ onRegisterClick, isRegistrationOpen }) => {
  return (
    <section id="hero" className="relative min-h-[92vh] flex flex-col justify-between pt-28 pb-16 px-4 md:px-8 max-w-6xl mx-auto overflow-hidden">
      
      {/* Background depth radial gradient */}
      <div 
        className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] max-w-full opacity-35 pointer-events-none blur-[140px] -z-10"
        style={{
          background: 'radial-gradient(circle, #B01FD6 0%, #5E3070 50%, #3E1F4D 100%)'
        }}
      />

      <div className="grid grid-cols-12 gap-4 items-center relative z-10 w-full">
        
        {/* Left Edge: Poster Notebook Octagonal Spiral Motif */}
        <div className="col-span-1 hidden md:flex flex-col items-center">
          <div className="spiral-holes-strip">
            {Array.from({ length: 9 }).map((_, i) => (
              <span key={i} className="spiral-hole" aria-hidden="true" />
            ))}
          </div>
        </div>

        {/* Center / Hero Content */}
        <div className="col-span-12 md:col-span-8 flex flex-col items-start text-left md:pl-4">
          
          {/* Institutional Header Lead-in */}
          <div className="flex items-center gap-2 mb-4 text-xs font-mono tracking-widest text-[#E2A9F0] uppercase">
            <span className="w-2.5 h-2.5 rotate-45 bg-[#B01FD6]" />
            <span>JEPPIAAR ENGINEERING COLLEGE</span>
            <span className="text-[#E2A9F0]/40">·</span>
            <span>AUTONOMOUS INSTITUTION</span>
          </div>

          {/* Hero Main Heading: "Wow Coding..." in poster script with trailing dots in magenta */}
          <div className="relative my-2">
            <h1 className="font-script text-6xl sm:text-7xl md:text-8xl lg:text-9xl text-white font-normal leading-tight drop-shadow-[0_4px_25px_rgba(62,31,77,0.7)] select-none">
              Wow Coding<span className="text-[#B01FD6] font-display ml-1">...</span>
            </h1>
          </div>

          {/* Subtitle: "Code Your Way from Ehh! to Wowww!" in orchid */}
          <p className="font-mono text-lg sm:text-2xl md:text-3xl text-[#E2A9F0] font-semibold tracking-wide mb-6">
            Code Your Way from <span className="text-white/80 line-through decoration-[#B01FD6] decoration-2">Ehh!</span> to <span className="text-white font-bold underline decoration-[#E2A9F0] decoration-wavy">Wowww!</span>
          </p>

          <p className="max-w-xl text-xs sm:text-sm font-mono text-[#E8E2D0]/90 leading-relaxed mb-8">
            An elite 3-level competitive debugging arena! Take broken, bug-ridden, crashing code (&ldquo;Ehh!&rdquo;), diagnose the underlying faults, and refactor it into clean, flawless, and optimal runtime functional code (&ldquo;Wowww!&rdquo;). With each level, the toughness escalates.
          </p>

          {/* Hexagonal Buttons (Zero rounded corners) */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 w-full sm:w-auto">
            <button
              onClick={onRegisterClick}
              className="shape-hexagon-btn px-9 py-4 bg-[#B01FD6] hover:bg-[#C46DE0] text-white font-mono font-bold tracking-wider text-sm sm:text-base shadow-[0_0_25px_rgba(176,31,214,0.5)] transition-all duration-200 hover:scale-[1.02] cursor-pointer flex items-center justify-center gap-3 uppercase"
            >
              <svg className="w-5 h-5 fill-white text-white" viewBox="0 0 24 24">
                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
              </svg>
              <span>{isRegistrationOpen ? 'REGISTER FOR BATTLE · FREE' : 'VIEW REGISTRATION STATUS'}</span>
            </button>

            <a
              href="#instructions"
              className="shape-hexagon-btn px-8 py-4 bg-[#3E1F4D] hover:bg-[#4A2260] border-y border-[#E2A9F0]/40 text-[#E8E2D0] hover:text-white font-mono text-xs sm:text-sm tracking-wider uppercase transition-colors text-center cursor-pointer"
            >
              VIEW 3 LEVELS
            </a>
          </div>

          {/* 3 Escalating Levels Teaser in Octagon Cards */}
          <div className="mt-10 pt-6 border-t border-[#E2A9F0]/20 w-full grid grid-cols-1 sm:grid-cols-3 gap-3 font-mono text-xs">
            <div className="shape-octagon p-4 bg-[#3E1F4D]/90 border-l-4 border-l-[#E2A9F0] border-y border-r border-[#E2A9F0]/20">
              <div className="flex items-center justify-between text-[10px] text-[#E2A9F0]/80 uppercase mb-1">
                <span>LEVEL 01</span>
                <span className="text-white/60">ENTRY</span>
              </div>
              <strong className="text-white block text-xs">Syntax &amp; Logic Bugs</strong>
              <span className="text-[10px] text-[#E8E2D0]/60 block mt-0.5">Basic debugging &amp; compile fixes</span>
            </div>

            <div className="shape-octagon p-4 bg-[#3E1F4D]/90 border-l-4 border-l-[#C46DE0] border-y border-r border-[#E2A9F0]/20">
              <div className="flex items-center justify-between text-[10px] text-[#E2A9F0] uppercase mb-1">
                <span>LEVEL 02</span>
                <span className="text-[#E2A9F0]">TOUGHER</span>
              </div>
              <strong className="text-white block text-xs">Runtime Bottlenecks</strong>
              <span className="text-[10px] text-[#E8E2D0]/60 block mt-0.5">TLE elimination &amp; refactoring</span>
            </div>

            <div className="shape-octagon p-4 bg-[#4A2260]/95 border-l-4 border-l-[#B01FD6] border-y border-r border-[#B01FD6]/50 shadow-[0_0_15px_rgba(176,31,214,0.3)]">
              <div className="flex items-center justify-between text-[10px] text-[#E2A9F0] uppercase mb-1">
                <span>LEVEL 03</span>
                <span className="text-red-300 font-bold">HARDEST</span>
              </div>
              <strong className="text-white block text-xs">Optimal Scale Mastery</strong>
              <span className="text-[10px] text-[#E8E2D0]/60 block mt-0.5">Extreme Big-O stress survival</span>
            </div>
          </div>

        </div>

        {/* Right Slot: The poster's signature Cream Badge in Hexagonal Cut Shape (NO rounded borders) */}
        <div className="col-span-12 md:col-span-3 flex justify-start md:justify-end mt-6 md:mt-0">
          <div className="shape-octagon bg-[#E8E2D0] text-[#3E1F4D] py-5 px-8 shadow-2xl flex flex-col items-start md:items-end transform hover:-translate-x-1 transition-transform border-l-4 border-[#B01FD6]">
            <span className="font-display text-2xl sm:text-3xl font-black text-[#5E3070] tracking-tight">
              CSE AIML
            </span>
            <span className="font-script text-3xl sm:text-4xl text-[#B01FD6] -mt-2">
              Presents
            </span>
          </div>
        </div>

      </div>

      {/* Bottom Hero Anchor: "Happy Women's Day" in wide spaced poster lettering */}
      <div className="mt-14 pt-8 text-center border-t border-[#E2A9F0]/20 relative z-10">
        <h2 className="font-mono text-sm sm:text-lg md:text-xl font-bold uppercase tracking-[0.35em] text-[#E2A9F0] drop-shadow-[0_2px_8px_rgba(62,31,77,0.8)]">
          H A P P Y &nbsp; W O M E N &rsquo; S &nbsp; D A Y
        </h2>
        <span className="text-[11px] font-mono text-[#E8E2D0]/60 tracking-widest mt-1 block">
          A CELEBRATION OF BRILLIANCE, CREATIVITY & CODE
        </span>
      </div>

    </section>
  );
};
