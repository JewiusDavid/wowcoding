import React from 'react';

export const Footer: React.FC = () => {
  return (
    <footer className="border-t border-[#E2A9F0]/20 bg-[#3E1F4D] py-16 px-4 md:px-8 font-mono text-xs text-[#E8E2D0]/80 relative z-10">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
        
        {/* Event Identity */}
        <div>
          <div className="flex items-center gap-3 mb-2">
            <span className="font-script text-3xl text-white">Wow Coding...</span>
            <span className="text-[#E2A9F0]/40">·</span>
            <span className="text-xs text-[#E2A9F0] uppercase font-semibold">Code Your Way from Ehh! to Wowww!</span>
          </div>
          <p className="text-[#E8E2D0]/70 text-[11px] max-w-md leading-relaxed">
            Presented by the Department of CSE AIML, Jeppiaar Engineering College (An Autonomous Institution). Rajiv Gandhi Salai, Semmancheri, Chennai.
          </p>
        </div>

        {/* Quick Nav Anchors */}
        <div className="flex flex-wrap gap-6 text-[11px] tracking-wider uppercase text-[#E8E2D0]">
          <a href="#about" className="hover:text-[#E2A9F0] transition-colors">
            ABOUT
          </a>
          <a href="#instructions" className="hover:text-[#E2A9F0] transition-colors">
            INSTRUCTIONS
          </a>
          <a href="#time" className="hover:text-[#E2A9F0] transition-colors">
            TIME
          </a>
          <a href="#location" className="hover:text-[#E2A9F0] transition-colors">
            LOCATION
          </a>
          <a href="#register" className="hover:text-[#E2A9F0] transition-colors">
            REGISTER
          </a>
        </div>

      </div>

      {/* Prominent Women's Day Line in Footer */}
      <div className="max-w-6xl mx-auto mt-10 pt-6 border-t border-[#E2A9F0]/15 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
        <div className="font-mono text-sm font-bold tracking-[0.25em] text-[#E2A9F0] uppercase">
          ★ HAPPY WOMEN&rsquo;S DAY ★
        </div>

        <div className="text-[11px] text-[#E8E2D0]/60">
          © 2026 WOW CODING · DEPARTMENT OF CSE AIML · JEPPIAAR ENGINEERING COLLEGE
        </div>
      </div>
    </footer>
  );
};
