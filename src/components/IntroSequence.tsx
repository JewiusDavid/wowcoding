import React, { useEffect, useState, useRef } from 'react';
import { calmMusic } from '../utils/audioEngine.ts';

interface IntroSequenceProps {
  onComplete: () => void;
  isOpen: boolean;
}

interface SparkleParticle {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  color: string;
  alpha: number;
  rotation: number;
}

export const IntroSequence: React.FC<IntroSequenceProps> = ({ onComplete, isOpen }) => {
  const [phase, setPhase] = useState<'falling' | 'impact' | 'revealed' | 'opening' | 'finished'>('falling');
  const [starProgress, setStarProgress] = useState(0); // 0 to 1
  const [particles, setParticles] = useState<SparkleParticle[]>([]);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animFrameRef = useRef<number | null>(null);

  // Initialize intro and start audio
  useEffect(() => {
    if (!isOpen) {
      setPhase('finished');
      return;
    }

    setPhase('falling');
    setStarProgress(0);

    // Attempt to start calm music on open
    calmMusic.startMusic().catch(() => {});
    calmMusic.playShootingStarSwoosh();

    // 1. Shooting star fall animation (0ms to 1700ms)
    const startTime = performance.now();
    const duration = 1600; // ms

    const animateStar = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(1, elapsed / duration);
      // Ease-out cubic curve for natural atmospheric deceleration
      const eased = 1 - Math.pow(1 - progress, 2.5);
      setStarProgress(eased);

      if (progress < 1) {
        animFrameRef.current = requestAnimationFrame(animateStar);
      } else {
        // Trigger impact & starburst
        setPhase('impact');
        spawnBurstParticles();

        // 2. Reveal title cards
        window.setTimeout(() => {
          setPhase('revealed');
        }, 350);

        // 3. Gracefully open website automatically
        window.setTimeout(() => {
          handleGracefulOpen();
        }, 3400);
      }
    };

    animFrameRef.current = requestAnimationFrame(animateStar);

    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [isOpen]);

  // Generate burst particles on shooting star impact
  const spawnBurstParticles = () => {
    const colors = ['#FFFFFF', '#E2A9F0', '#B01FD6', '#E8E2D0', '#C46DE0'];
    const newParticles: SparkleParticle[] = [];
    const count = 38;

    for (let i = 0; i < count; i++) {
      const angle = (Math.PI * 2 * i) / count + (Math.random() - 0.5) * 0.4;
      const speed = 2.5 + Math.random() * 5.5;
      newParticles.push({
        id: i,
        x: window.innerWidth * 0.5,
        y: window.innerHeight * 0.42,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        size: 5 + Math.random() * 9,
        color: colors[Math.floor(Math.random() * colors.length)],
        alpha: 1,
        rotation: Math.random() * 360,
      });
    }

    setParticles(newParticles);
  };

  // Particle physics rendering loop
  useEffect(() => {
    if (particles.length === 0) return;

    let localParticles = [...particles];
    let animationId: number;

    const render = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      localParticles = localParticles
        .map((p) => ({
          ...p,
          x: p.x + p.vx,
          y: p.y + p.vy,
          vx: p.vx * 0.94,
          vy: p.vy * 0.94 + 0.08, // gentle gravity
          alpha: p.alpha - 0.02,
          rotation: p.rotation + 4,
        }))
        .filter((p) => p.alpha > 0);

      // Draw each five-pointed star particle
      localParticles.forEach((p) => {
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate((p.rotation * Math.PI) / 180);
        ctx.globalAlpha = Math.max(0, p.alpha);
        ctx.fillStyle = p.color;
        ctx.shadowColor = p.color;
        ctx.shadowBlur = 8;

        // Draw 5-pointed star
        ctx.beginPath();
        const spikes = 5;
        const outerRadius = p.size;
        const innerRadius = p.size * 0.45;
        let rot = (Math.PI / 2) * 3;
        const step = Math.PI / spikes;

        ctx.moveTo(0, -outerRadius);
        for (let i = 0; i < spikes; i++) {
          ctx.lineTo(Math.cos(rot) * outerRadius, Math.sin(rot) * outerRadius);
          rot += step;
          ctx.lineTo(Math.cos(rot) * innerRadius, Math.sin(rot) * innerRadius);
          rot += step;
        }
        ctx.closePath();
        ctx.fill();
        ctx.restore();
      });

      if (localParticles.length > 0) {
        animationId = requestAnimationFrame(render);
      }
    };

    animationId = requestAnimationFrame(render);
    return () => cancelAnimationFrame(animationId);
  }, [particles]);

  const handleGracefulOpen = () => {
    if (phase === 'opening' || phase === 'finished') return;

    // Ensure calm music starts if it was blocked by autoplay
    calmMusic.startMusic().catch(() => {});

    setPhase('opening');
    window.setTimeout(() => {
      setPhase('finished');
      onComplete();
    }, 850);
  };

  if (!isOpen && phase === 'finished') {
    return null;
  }

  // Calculate shooting star coordinate trajectory:
  // Starts from top-right (x: 88vw, y: 4vh) and streaks downwards toward center (x: 50vw, y: 42vh)
  const startX = 88;
  const startY = 4;
  const targetX = 50;
  const targetY = 42;

  const currentX = startX + (targetX - startX) * starProgress;
  const currentY = startY + (targetY - startY) * starProgress;

  return (
    <div
      className={`fixed inset-0 z-[10000] flex flex-col items-center justify-center overflow-hidden transition-all duration-700 ease-out select-none ${
        phase === 'opening' ? 'opacity-0 scale-105 pointer-events-none' : 'opacity-100 scale-100'
      }`}
      style={{
        background: 'radial-gradient(ellipse at 50% 40%, #5E3070 0%, #3E1F4D 55%, #1F0D29 100%)',
      }}
    >
      {/* Background canvas for bursts and dust */}
      <canvas
        ref={canvasRef}
        width={typeof window !== 'undefined' ? window.innerWidth : 1200}
        height={typeof window !== 'undefined' ? window.innerHeight : 800}
        className="absolute inset-0 pointer-events-none z-10 w-full h-full"
      />

      {/* Distant background star sparkles */}
      <div className="absolute inset-0 pointer-events-none opacity-40">
        <div className="absolute top-[15%] left-[20%] text-[#E2A9F0] text-xs animate-pulse">★</div>
        <div className="absolute top-[28%] left-[75%] text-white text-[10px] animate-pulse">★</div>
        <div className="absolute top-[65%] left-[15%] text-[#C46DE0] text-[8px]">★</div>
        <div className="absolute top-[72%] left-[82%] text-[#E8E2D0] text-sm animate-pulse">★</div>
        <div className="absolute top-[38%] left-[10%] text-white text-[11px]">★</div>
        <div className="absolute top-[80%] left-[45%] text-[#E2A9F0] text-[9px]">★</div>
      </div>

      {/* The Falling Shooting Star Object */}
      {phase === 'falling' && (
        <div
          className="absolute z-20 pointer-events-none"
          style={{
            left: `${currentX}vw`,
            top: `${currentY}vh`,
            transform: 'translate(-50%, -50%)',
          }}
        >
          {/* Luminous Tail Beam */}
          <div
            className="absolute top-1/2 left-1/2 origin-left pointer-events-none"
            style={{
              width: `${160 + starProgress * 140}px`,
              height: '4px',
              background: 'linear-gradient(90deg, rgba(255,255,255,0.95), #E2A9F0 30%, #B01FD6 70%, transparent 100%)',
              transform: 'translate(-100%, -50%) rotate(218deg)',
              boxShadow: '0 0 16px #E2A9F0, 0 0 30px #B01FD6',
              filter: 'blur(0.5px)',
            }}
          />

          {/* Secondary Shimmer Beam */}
          <div
            className="absolute top-1/2 left-1/2 origin-left pointer-events-none"
            style={{
              width: `${90 + starProgress * 80}px`,
              height: '8px',
              background: 'linear-gradient(90deg, rgba(232,226,208,0.8), #E2A9F0 50%, transparent 100%)',
              transform: 'translate(-100%, -50%) rotate(218deg)',
              filter: 'blur(3px)',
            }}
          />

          {/* Glowing Star Core */}
          <div className="relative flex items-center justify-center">
            {/* Pulsing Aura */}
            <div className="absolute w-14 h-14 rounded-full bg-[#E2A9F0]/60 blur-md animate-ping" />
            <div className="absolute w-20 h-20 rounded-full bg-[#B01FD6]/40 blur-lg" />

            {/* SVG 5-Pointed Star Head */}
            <svg
              className="w-10 h-10 text-white drop-shadow-[0_0_15px_#ffffff] transform -rotate-45"
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <polygon points="12,1 15,8 23,9 17,15 19,23 12,19 5,23 7,15 1,9 9,8" />
            </svg>
          </div>
        </div>
      )}

      {/* Revealed Celestial Event Crest on Impact */}
      <div
        className={`relative z-20 text-center px-4 max-w-2xl mx-auto flex flex-col items-center transition-all duration-700 ${
          phase === 'revealed' || phase === 'opening'
            ? 'opacity-100 scale-100 translate-y-0'
            : 'opacity-0 scale-95 translate-y-4'
        }`}
      >
        {/* Department & College Pill / Label */}
        <div className="shape-octagon bg-[#E8E2D0] text-[#3E1F4D] py-2 px-6 shadow-2xl flex items-center gap-3 border-l-4 border-[#B01FD6] mb-4">
          <span className="font-display text-sm sm:text-base font-black text-[#5E3070] tracking-wide">
            CSE AIML
          </span>
          <span className="text-[#3E1F4D]/40 font-mono">·</span>
          <span className="font-script text-xl sm:text-2xl text-[#B01FD6]">
            Presents
          </span>
        </div>

        {/* Hero Title: "Wow Coding..." */}
        <h1 className="font-script text-6xl sm:text-7xl md:text-8xl text-white font-normal leading-none drop-shadow-[0_8px_30px_rgba(176,31,214,0.8)] my-2">
          Wow Coding<span className="text-[#B01FD6] font-display ml-1">...</span>
        </h1>

        {/* Tagline: "Code Your Way from Ehh! to Wowww!" */}
        <p className="font-mono text-sm sm:text-xl text-[#E2A9F0] font-semibold tracking-wide mt-2 mb-2">
          Code Your Way from <span className="line-through text-white/70 decoration-[#B01FD6] decoration-2">Ehh!</span> to <span className="text-white font-bold underline decoration-[#E2A9F0]">Wowww!</span>
        </p>

        {/* Women's Day Special Line */}
        <div className="flex items-center gap-2 text-xs font-mono tracking-widest text-[#E8E2D0]/80 uppercase my-3">
          <span className="text-[#E2A9F0]">★</span>
          <span>WOMEN&rsquo;S DAY SPECIAL · JEPPIAAR ENGINEERING COLLEGE</span>
          <span className="text-[#E2A9F0]">★</span>
        </div>

        {/* Action Button: "OPEN WEBSITE WITH MUSIC" */}
        <div className="mt-6 flex flex-col sm:flex-row items-center gap-4">
          <button
            onClick={handleGracefulOpen}
            className="shape-hexagon-btn px-9 py-3.5 bg-[#B01FD6] hover:bg-[#C46DE0] text-white font-mono font-bold tracking-widest text-xs sm:text-sm shadow-[0_0_30px_rgba(176,31,214,0.7)] transition-all transform hover:scale-105 cursor-pointer flex items-center gap-3 uppercase group"
          >
            <span>ENTER EXPERIENCE</span>
            <span className="text-white text-base group-hover:translate-x-1 transition-transform">→</span>
          </button>

          <button
            onClick={() => {
              calmMusic.toggleMute();
              setSoundEnabled(!soundEnabled);
            }}
            className="shape-octagon px-4 py-2.5 bg-[#3E1F4D]/90 hover:bg-[#4A2260] border border-[#E2A9F0]/40 text-[#E8E2D0] font-mono text-xs tracking-wider flex items-center gap-2 cursor-pointer transition-colors"
            title="Toggle calm music"
          >
            <span>{soundEnabled ? '♫ MUSIC ON' : '✕ MUSIC MUTED'}</span>
          </button>
        </div>

        {/* Peaceful auto-open indicator */}
        <span className="font-mono text-[10px] text-[#E8E2D0]/50 tracking-wider mt-5">
          Entering automatically in a moment... or tap Enter
        </span>
      </div>

      {/* Top-Right Quick Skip */}
      <button
        onClick={handleGracefulOpen}
        className="absolute top-5 right-6 z-30 font-mono text-xs tracking-widest text-[#E2A9F0]/70 hover:text-white uppercase transition-colors cursor-pointer py-1 px-3 border border-white/10 shape-octagon bg-black/20"
      >
        SKIP INTRO &gt;
      </button>

      {/* Floating Star Holes Strip on the bottom right corner */}
      <div className="absolute bottom-6 left-6 z-20 flex items-center gap-2 opacity-60">
        <span className="w-2 h-2 rotate-45 bg-[#E2A9F0]" />
        <span className="text-[10px] font-mono tracking-widest text-[#E8E2D0]/60 uppercase">
          CSE AIML · 3-LEVEL DEBUGGING ARENA
        </span>
      </div>
    </div>
  );
};
