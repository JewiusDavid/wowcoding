import React from 'react';
import { EVENT_CONFIG } from '../config/eventConfig.ts';

export const Location: React.FC = () => {
  return (
    <section id="location" className="py-24 px-4 md:px-8 max-w-6xl mx-auto border-t border-[#E2A9F0]/20 relative">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-4">
        <div>
          <span className="text-xs font-mono tracking-widest text-[#E2A9F0] uppercase block mb-2">
            04 · THE VENUE
          </span>
          <h2 className="font-display text-4xl sm:text-5xl md:text-6xl text-white tracking-tight uppercase">
            CAMPUS LOCATION
          </h2>
        </div>
        <p className="font-mono text-xs sm:text-sm text-[#E8E2D0]/70 max-w-md">
          {EVENT_CONFIG.venueName}, {EVENT_CONFIG.institution}, Rajiv Gandhi Salai (OMR), Chennai.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch font-mono">
        
        {/* Left Information Card in Octagonal Shape (NO rounded borders) */}
        <div className="lg:col-span-5 flex flex-col justify-between space-y-6">
          
          <div className="shape-octagon p-8 bg-[#3E1F4D]/90 border-l-4 border-l-[#E2A9F0] border-y border-r border-[#E2A9F0]/30 relative shadow-xl">
            <span className="text-[10px] text-[#E2A9F0] tracking-widest uppercase block mb-1">
              HOST CAMPUS &amp; VENUE
            </span>
            <h3 className="font-display text-2xl sm:text-3xl text-white uppercase tracking-tight mb-2">
              {EVENT_CONFIG.institution}
            </h3>
            <p className="text-xs text-[#E8E2D0]/80 leading-relaxed mb-4">
              Autonomous Institution · Accredited with &lsquo;A&rsquo; Grade by NAAC · Celebrating 25+ Years of Academic Excellence.
            </p>
            <div className="shape-octagon-sm p-4 bg-[#5E3070]/80 border-t border-t-[#E2A9F0]/40 text-xs text-white">
              <span className="block text-[10px] text-[#E2A9F0] uppercase mb-1">SPECIFIC LAB VENUE</span>
              <strong className="text-white block text-sm">{EVENT_CONFIG.venueName}</strong>
              <span className="text-[#E8E2D0]/70 block mt-1">{EVENT_CONFIG.venueAddress}</span>
            </div>
          </div>

          <div className="shape-octagon p-6 bg-[#4A2260]/85 border-l-4 border-l-[#B01FD6] border-y border-r border-[#B01FD6]/30 space-y-4 text-xs">
            <div className="flex items-start gap-3">
              <span className="text-lg text-[#E2A9F0]">★</span>
              <div>
                <strong className="text-white block">OMR IT Expressway Access</strong>
                <p className="text-[#E8E2D0]/70 text-[11px] mt-0.5">
                  Direct connectivity along the Rajiv Gandhi Salai corridor. Frequent bus services connect from Guindy, Tambaram, Adyar, and Sholinganallur.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <span className="text-lg text-[#E2A9F0]">★</span>
              <div>
                <strong className="text-white block">Campus Check-In</strong>
                <p className="text-[#E8E2D0]/70 text-[11px] mt-0.5">
                  Present your college ID card and registration confirmation pass at Campus Gate 1 for priority access to the CSE AIML Lab Wing.
                </p>
              </div>
            </div>
          </div>

          <a
            href="https://maps.google.com/?q=Jeppiaar+Engineering+College+Chennai"
            target="_blank"
            rel="noopener noreferrer"
            className="shape-hexagon-btn w-full py-4 bg-[#E8E2D0] hover:bg-white text-[#3E1F4D] text-xs font-bold tracking-wider uppercase text-center block transition-colors shadow-lg cursor-pointer"
          >
            OPEN IN GOOGLE MAPS ↗
          </a>

        </div>

        {/* Right Embedded Google Map in Octagonal Container */}
        <div className="lg:col-span-7 shape-octagon bg-[#3E1F4D] border-l-4 border-l-[#B01FD6] border-y border-r border-[#E2A9F0]/30 overflow-hidden min-h-[380px] lg:min-h-[460px] relative shadow-2xl">
          <iframe
            title="Jeppiaar Engineering College Location Map"
            src="https://maps.google.com/maps?q=Jeppiaar+Engineering+College,+Rajiv+Gandhi+Salai,+Semmancheri,+Chennai,+Tamil+Nadu+600119&t=&z=15&ie=UTF8&iwloc=&output=embed"
            className="w-full h-full min-h-[380px] lg:min-h-[460px] border-0 opacity-90 hover:opacity-100 transition-opacity"
            loading="lazy"
            allowFullScreen
          />
          <div className="absolute bottom-3 left-3 bg-[#3E1F4D]/90 backdrop-blur-md px-3 py-1.5 border border-[#E2A9F0]/30 text-[10px] text-white pointer-events-none">
            GEO: 12.8711° N, 80.2224° E · SEMMANCHERI, CHENNAI
          </div>
        </div>

      </div>

    </section>
  );
};
