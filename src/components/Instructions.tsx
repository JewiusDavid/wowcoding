import React from 'react';

interface InstructionItem {
  number: string;
  category: string;
  toughnessLabel?: string;
  title: string;
  bullets: string[];
}

const INSTRUCTIONS_DATA: InstructionItem[] = [
  {
    number: '01',
    category: 'CODE RULES',
    title: 'ENVIRONMENT & INTEGRITY',
    bullets: [
      'Open to all engineering students across all departments and years.',
      'Permitted languages: Python 3, C++, Java, and JavaScript (Node.js).',
      'Each participant receives an assigned terminal in the CSE AIML Labs with offline code editors.',
      'Participants receive pre-written, intentionally broken codebases for each level.',
      'Plagiarism, AI chatbot prompt generation, or unauthorized network tools result in instant forfeiture.'
    ]
  },
  {
    number: '02',
    category: 'LEVEL 01',
    toughnessLabel: 'TOUGHNESS: LEVEL 1 (ENTRY)',
    title: 'SYNTAX & BOUNDARY DEBUGGING',
    bullets: [
      'Mission: Diagnose and repair elementary syntax faults, typing errors, null pointers, and off-by-one loop boundaries.',
      'The code is currently broken (&ldquo;Ehh!&rdquo;) and fails compilation or crashes on edge cases.',
      'Identify the logical flaws and deliver clean, functional code passing the baseline validation suite.',
      'Time Window: 45 Minutes. Fast completions bank reserve time for Level 2 and Level 3.'
    ]
  },
  {
    number: '03',
    category: 'LEVEL 02',
    toughnessLabel: 'TOUGHNESS: LEVEL 2 (INCREASED)',
    title: 'LOGIC & RUNTIME OPTIMIZATION',
    bullets: [
      'Toughness Escalation: Code logic is fundamentally broken, suffering from memory leaks, infinite recursion, and severe quadratic O(N²) time-limit-exceeded (TLE) faults.',
      'Step 1: Fix the obscure edge-case errors preventing correct outputs.',
      'Step 2: Refactor data structures and algorithmic flow to produce optimal runtime functional code.',
      'Solutions are evaluated against intermediate benchmark stress sets where brute-force code chokes.',
      'Time Window: 60 Minutes.'
    ]
  },
  {
    number: '04',
    category: 'LEVEL 03',
    toughnessLabel: 'TOUGHNESS: LEVEL 3 (MAXIMUM · HARDEST)',
    title: 'EXTREME SCALE & ASYMPTOTIC MASTERY',
    bullets: [
      'Maximum Toughness: The ultimate crucible of Wow Coding! High-dimensional graph problems, dynamic memoization flaws, and high-throughput data processing bugs.',
      'The provided code crashes under load, suffers from concurrency bottlenecks, or consumes excessive heap memory.',
      'Transform the failing implementation into an elite, optimal runtime functional architecture (&ldquo;Wowww!&rdquo;).',
      'Tested against millions of operations under sub-millisecond execution caps.',
      'Time Window: 45 Minutes.'
    ]
  },
  {
    number: '05',
    category: 'EVALUATION',
    toughnessLabel: 'OFFICIAL SCORING RUBRIC',
    title: 'JUDGING CRITERIA (PRIORITY ORDER)',
    bullets: [
      'Criterion 1 · Functional Correctness: 100% resolution of all bugs and complete pass across all hidden test cases.',
      'Criterion 2 · Optimal Runtime: Execution speed across automated benchmark suites (faster execution time wins).',
      'Criterion 3 · Asymptotic Complexity: Big-O scaling efficiency (e.g. O(N log N) dominates O(N²)).',
      'Criterion 4 · Submission Speed: In the event of matching runtime metrics, the earliest verified submission wins.'
    ]
  }
];

export const Instructions: React.FC = () => {
  return (
    <section id="instructions" className="py-24 px-4 md:px-8 max-w-6xl mx-auto border-t border-[#E2A9F0]/20 relative">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-4">
        <div>
          <span className="text-xs font-mono tracking-widest text-[#E2A9F0] uppercase block mb-2">
            02 · 3 ASCENDING LEVELS
          </span>
          <h2 className="font-display text-4xl sm:text-5xl md:text-6xl text-white tracking-tight uppercase">
            RULES &amp; 3-LEVEL ARENA
          </h2>
        </div>
        <p className="font-mono text-xs sm:text-sm text-[#E8E2D0]/70 max-w-md">
          Debug the code, eradicate errors, and refactor into optimal runtime functional code. With each level, toughness escalates.
        </p>
      </div>

      {/* Numbered Cards with Octagon Shape (NO rounded borders) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 font-mono">
        {INSTRUCTIONS_DATA.map((item, idx) => (
          <div
            key={item.number}
            className={`shape-octagon p-6 sm:p-7 transition-all duration-300 hover:-translate-y-1 ${
              idx === 0
                ? 'bg-[#3E1F4D]/90 border-l-4 border-l-[#E2A9F0] border-y border-r border-[#E2A9F0]/30 shadow-xl'
                : idx === 3
                ? 'bg-[#4A2260]/95 border-l-4 border-l-[#B01FD6] border-y border-r border-[#B01FD6]/60 shadow-[0_0_20px_rgba(176,31,214,0.3)]'
                : idx === 4
                ? 'bg-[#E8E2D0] text-[#3E1F4D] border-l-4 border-l-[#B01FD6] shadow-2xl md:col-span-2 lg:col-span-2'
                : 'bg-[#4A2260]/85 border-l-4 border-l-[#B01FD6] border-y border-r border-[#B01FD6]/35 shadow-lg'
            }`}
          >
            {/* Header row with card number and category */}
            <div className="flex items-center justify-between mb-2 border-b pb-3 border-current/20">
              <div>
                <span className="text-xs font-bold tracking-widest uppercase opacity-75 block">
                  {item.category}
                </span>
                {item.toughnessLabel && (
                  <span className={`text-[10px] font-bold tracking-wider uppercase block mt-0.5 ${idx === 4 ? 'text-[#B01FD6]' : 'text-[#E2A9F0]'}`}>
                    {item.toughnessLabel}
                  </span>
                )}
              </div>
              <span className="font-display text-2xl font-black opacity-80">
                #{item.number}
              </span>
            </div>

            <h3 className="font-display text-xl sm:text-2xl uppercase tracking-tight mb-4">
              {item.title}
            </h3>

            {/* Star Bullet List */}
            <ul className="space-y-2.5 text-xs leading-relaxed">
              {item.bullets.map((bullet, bIdx) => (
                <li key={bIdx} className="flex items-start gap-2.5">
                  <span className={`shrink-0 text-sm select-none ${idx === 4 ? 'text-[#B01FD6]' : 'text-[#E2A9F0]'}`}>
                    ★
                  </span>
                  <span className="opacity-90">{bullet}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

    </section>
  );
};
