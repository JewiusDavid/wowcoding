import React from 'react';

export const About: React.FC = () => {
  return (
    <section id="about" className="py-24 px-4 md:px-8 max-w-6xl mx-auto border-t border-[#E2A9F0]/20 relative">
      
      {/* Editorial Section Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-4">
        <div>
          <span className="text-xs font-mono tracking-widest text-[#E2A9F0] uppercase block mb-2">
            01 · THE MISSION
          </span>
          <h2 className="font-display text-4xl sm:text-5xl md:text-6xl text-white tracking-tight uppercase">
            DEBUG &amp; OPTIMIZE
          </h2>
        </div>
        <p className="font-mono text-xs sm:text-sm text-[#E8E2D0]/70 max-w-md">
          A high-intensity debugging challenge where participants isolate bugs, eradicate errors, and engineer optimal runtime solutions.
        </p>
      </div>

      {/* Main Grid with Notebook Motif */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Core Narrative Card in Octagonal Cut Shape (NO rounded borders) */}
        <div className="lg:col-span-7 shape-octagon bg-[#3E1F4D]/90 p-6 sm:p-10 border-l-4 border-l-[#E2A9F0] border-y border-r border-[#E2A9F0]/25 shadow-2xl relative overflow-hidden flex gap-6">
          
          {/* Notebook spiral hole strip on left of card */}
          <div className="hidden sm:flex flex-col items-center">
            <div className="spiral-holes-strip">
              {Array.from({ length: 8 }).map((_, i) => (
                <span key={i} className="spiral-hole" aria-hidden="true" />
              ))}
            </div>
          </div>

          <div className="space-y-5 font-mono text-xs sm:text-sm text-[#E8E2D0]/90 leading-relaxed flex-1">
            <p>
              In software engineering, true mastery isn&rsquo;t just writing lines of code from scratch — it is the razor-sharp ability to diagnose cryptic defects, trace memory leaks, and convert broken code into <span className="text-white font-bold">optimal, high-performance, functional systems</span>.
            </p>

            <p>
              At <strong className="text-white">Wow Coding...</strong>, competitors are thrust into intentional chaos. You are provided with faulty, error-ridden programs that crash, produce wrong outputs, or choke under heavy inputs — the frustrating <span className="text-[#E2A9F0] font-semibold not-italic">&ldquo;Ehh!&rdquo;</span> state.
            </p>

            <p>
              Your objective across <strong className="text-white">3 progressively tougher levels</strong>:
            </p>
            <ol className="list-decimal list-inside space-y-1 text-white/90 pl-2">
              <li><strong className="text-[#E2A9F0]">Deconstruct &amp; Debug:</strong> Trace the compilation errors, semantic mistakes, and boundary oversights.</li>
              <li><strong className="text-[#E2A9F0]">Fix &amp; Validate:</strong> Restore complete functional correctness across standard and hidden test cases.</li>
              <li><strong className="text-[#E2A9F0]">Optimize Runtime:</strong> Refactor data structures and algorithmic flow to ensure blazing execution speed under stress inputs (&ldquo;Wowww!&rdquo;).</li>
            </ol>

            <p>
              With each succeeding level, the toughness increases dramatically — transitioning from simple logic flaws to intricate memory bottlenecks and high-dimensional algorithmic hurdles.
            </p>

            <div className="pt-4 border-t border-[#E2A9F0]/20 flex flex-wrap gap-6 text-xs text-[#E8E2D0]/80">
              <div>
                <span className="text-[#E2A9F0]/60 block text-[10px]">ORGANIZER</span>
                <span className="text-white font-semibold">CSE (AI &amp; ML) Department</span>
              </div>
              <div>
                <span className="text-[#E2A9F0]/60 block text-[10px]">CAMPUS</span>
                <span className="text-white font-semibold">Jeppiaar Engineering College</span>
              </div>
              <div>
                <span className="text-[#E2A9F0]/60 block text-[10px]">STRUCTURE</span>
                <span className="text-[#E2A9F0] font-semibold">3 Levels · Ascending Toughness</span>
              </div>
            </div>
          </div>

        </div>

        {/* Feature Cards in Octagonal Shapes (Zero rounded corners) */}
        <div className="lg:col-span-5 grid grid-cols-1 gap-4 font-mono">
          
          <div className="shape-octagon p-6 bg-[#E8E2D0] text-[#3E1F4D] shadow-xl border-l-4 border-l-[#B01FD6]">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-[#B01FD6] text-lg">★</span>
              <span className="text-xs uppercase font-bold text-[#B01FD6] tracking-wider">PHASE 1 · DIAGNOSIS</span>
            </div>
            <h3 className="font-display text-2xl text-[#3E1F4D] uppercase tracking-tight mb-2">
              Zero Tolerance for Bugs
            </h3>
            <p className="text-xs text-[#3E1F4D]/80 leading-relaxed">
              Trace stack traces, resolve off-by-one errors, null pointers, and incorrect loop invariants to make the program functional.
            </p>
          </div>

          <div className="shape-octagon p-6 bg-[#3E1F4D]/90 border-l-4 border-l-[#E2A9F0] border-y border-r border-[#E2A9F0]/30">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-[#E2A9F0] text-lg">★</span>
              <span className="text-xs uppercase font-bold text-[#E2A9F0] tracking-wider">PHASE 2 · OPTIMIZATION</span>
            </div>
            <h3 className="font-display text-2xl text-white uppercase tracking-tight mb-2">
              Optimal Runtime Execution
            </h3>
            <p className="text-xs text-[#E8E2D0]/80 leading-relaxed">
              Eliminate redundant computations, leverage hash lookups, memoization, and two-pointer structures to crush the execution clock.
            </p>
          </div>

          <div className="shape-octagon p-6 bg-[#4A2260]/95 border-l-4 border-l-[#B01FD6] border-y border-r border-[#B01FD6]/40">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-[#B01FD6] text-lg">★</span>
              <span className="text-xs uppercase font-bold text-[#E2A9F0] tracking-wider">PHASE 3 · SCALE STRESS</span>
            </div>
            <h3 className="font-display text-2xl text-white uppercase tracking-tight mb-2">
              Toughness Escalation
            </h3>
            <p className="text-xs text-[#E8E2D0]/80 leading-relaxed">
              Each level multiplies input volumes and complexity depth. Level 3 demands true algorithmic intuition to avoid timeout disqualifications.
            </p>
          </div>

        </div>

      </div>

    </section>
  );
};
