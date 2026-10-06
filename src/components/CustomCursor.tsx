import React, { useEffect, useState, useRef, useCallback } from 'react';

interface TrailStar {
  id: number;
  x: number;
  y: number;
  size: number;
  color: string;
}

const TRAIL_COLORS = ['#FFFFFF', '#E2A9F0', '#B01FD6', '#E8E2D0', '#C46DE0'];

export const CustomCursor: React.FC = () => {
  const [pos, setPos] = useState({ x: -100, y: -100 });
  const [angle, setAngle] = useState(-45);
  const [isHovering, setIsHovering] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [isTouchDevice, setIsTouchDevice] = useState(false);
  const [trail, setTrail] = useState<TrailStar[]>([]);

  const idCounter = useRef(0);
  const prevPos = useRef({ x: -100, y: -100 });
  const lastSpawnTime = useRef(0);

  const removeStar = useCallback((id: number) => {
    setTrail((prev) => prev.filter((p) => p.id !== id));
  }, []);

  useEffect(() => {
    const isTouch = window.matchMedia('(pointer: coarse)').matches || 'ontouchstart' in window;
    if (isTouch) {
      setIsTouchDevice(true);
      return;
    }

    document.body.classList.add('has-custom-cursor');

    const handleMouseMove = (e: MouseEvent) => {
      const newX = e.clientX;
      const newY = e.clientY;
      const now = performance.now();

      const dx = newX - prevPos.current.x;
      const dy = newY - prevPos.current.y;
      const dist = Math.sqrt(dx * dx + dy * dy);

      if (dist > 3) {
        // Point the star head directly along movement direction
        const moveAngle = (Math.atan2(dy, dx) * 180) / Math.PI;
        setAngle(moveAngle);
      }

      // Spawn shooting star trail particles as mouse moves (throttled to ~25ms for lightweight responsiveness)
      if (dist > 6 && now - lastSpawnTime.current > 24) {
        lastSpawnTime.current = now;
        prevPos.current = { x: newX, y: newY };

        // Position slightly behind the moving star head
        const rad = (Math.atan2(dy, dx) + Math.PI);
        const tailOffset = 8 + Math.random() * 6;
        const trailX = newX + Math.cos(rad) * tailOffset + (Math.random() - 0.5) * 4;
        const trailY = newY + Math.sin(rad) * tailOffset + (Math.random() - 0.5) * 4;

        idCounter.current += 1;
        const newStarId = idCounter.current;
        const newStar: TrailStar = {
          id: newStarId,
          x: trailX,
          y: trailY,
          size: 7 + Math.random() * 9,
          color: TRAIL_COLORS[Math.floor(Math.random() * TRAIL_COLORS.length)],
        };

        setTrail((prev) => {
          // Keep maximum 14 particles in memory for peak lightweight performance
          const sliced = prev.length >= 14 ? prev.slice(prev.length - 13) : prev;
          return [...sliced, newStar];
        });

        // Auto remove star particle after CSS keyframe animation completes (420ms)
        window.setTimeout(() => {
          removeStar(newStarId);
        }, 440);
      }

      setPos({ x: newX, y: newY });
      if (!isVisible) setIsVisible(true);

      const target = e.target as HTMLElement | null;
      if (target) {
        const clickable = target.closest('a, button, input, select, textarea, [role="button"], label, .interactive-hover');
        setIsHovering(!!clickable);
      }
    };

    const handleMouseLeave = () => {
      setIsVisible(false);
      setTrail([]);
    };

    const handleMouseEnter = () => {
      setIsVisible(true);
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    document.addEventListener('mouseleave', handleMouseLeave);
    document.addEventListener('mouseenter', handleMouseEnter);

    return () => {
      document.body.classList.remove('has-custom-cursor');
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
      document.removeEventListener('mouseenter', handleMouseEnter);
    };
  }, [isVisible, removeStar]);

  if (isTouchDevice || !isVisible) {
    return null;
  }

  return (
    <>
      {/* Trailing SVG Star Particles Animated with CSS Keyframes */}
      {trail.map((star) => (
        <div
          key={star.id}
          className="animate-star-tail fixed z-[9998] pointer-events-none"
          style={{
            left: `${star.x}px`,
            top: `${star.y}px`,
            width: `${star.size}px`,
            height: `${star.size}px`,
          }}
        >
          <svg
            viewBox="0 0 24 24"
            width="100%"
            height="100%"
            fill={star.color}
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* SVG Star Path */}
            <polygon points="12,1 15,8 23,9 17,15 19,23 12,19 5,23 7,15 1,9 9,8" />
          </svg>
        </div>
      ))}

      {/* Main Pointed Shooting Star Head Tracking Mouse Movement */}
      <div
        className="fixed pointer-events-none z-[9999] will-change-transform select-none"
        style={{
          left: `${pos.x}px`,
          top: `${pos.y}px`,
          transform: `translate(-40%, -50%) rotate(${angle}deg) ${
            isHovering ? 'scale(1.4)' : 'scale(1.1)'
          }`,
          transition: 'transform 80ms ease-out',
        }}
        aria-hidden="true"
      >
        <svg
          width="42"
          height="42"
          viewBox="0 0 42 42"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="drop-shadow-[0_0_12px_rgba(226,169,240,0.95)]"
        >
          <defs>
            <linearGradient id="cometTailGradient" x1="100%" y1="50%" x2="0%" y2="50%">
              <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.95" />
              <stop offset="30%" stopColor="#E2A9F0" stopOpacity="0.8" />
              <stop offset="70%" stopColor="#B01FD6" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#5E3070" stopOpacity="0" />
            </linearGradient>

            <linearGradient id="starHeadFill" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FFFFFF" />
              <stop offset="50%" stopColor="#E2A9F0" />
              <stop offset="100%" stopColor="#B01FD6" />
            </linearGradient>
          </defs>

          {/* Shooting Star Tapered Jet Streak */}
          <path
            d="M 36 21 L 2 15 C 14 20, 14 22, 2 27 Z"
            fill="url(#cometTailGradient)"
          />

          {/* Aerodynamic Pointed Star Head (Pointed Nose pointing forward to the right) */}
          <path
            d="M 40 21 
               C 33 18, 29 13, 26 5 
               C 24 13, 20 18, 12 21 
               C 20 24, 24 29, 26 37 
               C 29 29, 33 24, 40 21 Z"
            fill="url(#starHeadFill)"
            stroke="#FFFFFF"
            strokeWidth="1.2"
          />

          {/* Sharp Diamond Core Sparkle */}
          <polygon
            points="34,21 26,16 20,21 26,26"
            fill="#FFFFFF"
            opacity="0.9"
          />

          {/* Front Tip Point */}
          <circle cx="39" cy="21" r="1.5" fill="#FFFFFF" />
        </svg>
      </div>
    </>
  );
};
