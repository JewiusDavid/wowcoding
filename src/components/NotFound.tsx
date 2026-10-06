import React from 'react';

export const NotFound: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#5E3070] flex flex-col items-center justify-center px-4 text-center font-mono selection:bg-[#B01FD6]/40 selection:text-white relative z-10">
      <div className="shape-octagon p-8 sm:p-12 border-l-4 border-l-[#B01FD6] border-y border-r border-[#E2A9F0]/30 bg-[#3E1F4D]/95 max-w-lg w-full shadow-2xl relative overflow-hidden">
        
        <div className="shape-octagon-badge w-16 h-16 mx-auto mb-6 flex items-center justify-center border border-[#E2A9F0]/40 text-[#E2A9F0] bg-[#5E3070]/60 text-2xl">
          ★
        </div>

        <span className="text-xs text-[#E2A9F0] uppercase tracking-widest block mb-1">
          ERROR 404
        </span>

        <h1 className="font-display text-4xl sm:text-5xl text-white uppercase tracking-tight mb-4">
          PAGE NOT FOUND
        </h1>

        <p className="text-xs text-[#E8E2D0]/80 leading-relaxed mb-8">
          The requested coordinate does not exist.
        </p>

        <a
          href="/"
          className="shape-hexagon-btn inline-block px-9 py-4 bg-[#B01FD6] hover:bg-[#C46DE0] text-white text-xs uppercase font-bold tracking-wider transition-colors cursor-pointer shadow-lg"
        >
          RETURN TO WOW CODING
        </a>
      </div>
    </div>
  );
};
