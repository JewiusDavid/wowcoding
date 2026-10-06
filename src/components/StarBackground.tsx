import React, { useEffect, useRef } from 'react';

interface Star {
  x: number;
  y: number;
  origX: number;
  origY: number;
  radius: number;
  innerRadiusRatio: number;
  rotation: number;
  rotSpeed: number;
  vx: number;
  vy: number;
  baseColor: string;
  baseAlpha: number;
  heat: number; // 0 to 1 for litmus shift
}

const STAR_PALETTE = [
  { color: '#E2A9F0', alpha: 0.85 }, // Lilac
  { color: '#B01FD6', alpha: 0.75 }, // Magenta
  { color: '#C46DE0', alpha: 0.80 }, // Medium purple / Orchid
  { color: '#4A2260', alpha: 0.65 }, // Dark plum
  { color: '#E8E2D0', alpha: 0.50 }, // Cream
];

export const StarBackground: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    let animId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const isTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;

    const mouse = {
      x: -1000,
      y: -1000,
      targetX: -1000,
      targetY: -1000,
      active: false,
    };

    const handleMouseMove = (e: MouseEvent) => {
      mouse.targetX = e.clientX;
      mouse.targetY = e.clientY;
      mouse.active = true;
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        mouse.targetX = e.touches[0].clientX;
        mouse.targetY = e.touches[0].clientY;
        mouse.active = true;
      }
    };

    const handleMouseLeave = () => {
      mouse.active = false;
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    window.addEventListener('touchmove', handleTouchMove, { passive: true });
    document.addEventListener('mouseleave', handleMouseLeave);

    // Generate stars
    const starCount = isTouch || width < 768 ? 24 : 45;
    let stars: Star[] = [];

    const initStars = () => {
      stars = [];
      for (let i = 0; i < starCount; i++) {
        const x = Math.random() * width;
        const y = Math.random() * height;
        
        // Varied sizes: some prominent big stars (like poster: 35-70px), medium (18-30px), small (8-16px)
        let radius = 12 + Math.random() * 20;
        if (i % 6 === 0) {
          radius = 38 + Math.random() * 32; // Prominent hero star
        } else if (i % 4 === 0) {
          radius = 24 + Math.random() * 15;
        }

        const paletteItem = STAR_PALETTE[i % STAR_PALETTE.length];

        stars.push({
          x,
          y,
          origX: x,
          origY: y,
          radius,
          innerRadiusRatio: 0.42 + Math.random() * 0.08,
          rotation: Math.random() * Math.PI * 2,
          rotSpeed: (Math.random() - 0.5) * 0.008,
          vx: (Math.random() - 0.5) * 0.25,
          vy: (Math.random() - 0.5) * 0.25,
          baseColor: paletteItem.color,
          baseAlpha: paletteItem.alpha,
          heat: 0,
        });
      }
    };

    initStars();

    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
      initStars();
    };

    window.addEventListener('resize', handleResize);

    const drawStarShape = (
      c: CanvasRenderingContext2D,
      cx: number,
      cy: number,
      spikes: number,
      outerRadius: number,
      innerRadius: number,
      rot: number
    ) => {
      let currentAngle = rot - Math.PI / 2;
      const step = Math.PI / spikes;

      c.beginPath();
      for (let i = 0; i < spikes; i++) {
        const ox = cx + Math.cos(currentAngle) * outerRadius;
        const oy = cy + Math.sin(currentAngle) * outerRadius;
        if (i === 0) c.moveTo(ox, oy);
        else c.lineTo(ox, oy);
        currentAngle += step;

        const ix = cx + Math.cos(currentAngle) * innerRadius;
        const iy = cy + Math.sin(currentAngle) * innerRadius;
        c.lineTo(ix, iy);
        currentAngle += step;
      }
      c.closePath();
    };

    // Litmus paper color transformation on hover
    // As heat goes 0 -> 1:
    // lilac (#E2A9F0) -> magenta (#B01FD6) -> cream (#E8E2D0) -> orchid (#C46DE0)
    const getLitmusColor = (baseColor: string, heat: number, alpha: number) => {
      if (heat <= 0.05) {
        return { color: baseColor, alpha };
      }
      if (heat < 0.4) {
        // Shift toward magenta (#B01FD6)
        return { color: '#B01FD6', alpha: Math.min(1, alpha + 0.2) };
      }
      if (heat < 0.75) {
        // Shift toward cream (#E8E2D0)
        return { color: '#E8E2D0', alpha: 0.95 };
      }
      // Peak heat: shift toward vibrant orchid (#E2A9F0)
      return { color: '#E2A9F0', alpha: 1.0 };
    };

    const influenceRadius = isTouch ? 150 : 220;
    const maxDisplacement = isTouch ? 12 : 28;

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // Smooth mouse easing
      if (mouse.active) {
        mouse.x += (mouse.targetX - mouse.x) * 0.12;
        mouse.y += (mouse.targetY - mouse.y) * 0.12;
      } else {
        mouse.x += (-2000 - mouse.x) * 0.05;
        mouse.y += (-2000 - mouse.y) * 0.05;
      }

      for (let i = 0; i < stars.length; i++) {
        const star = stars[i];

        if (!prefersReducedMotion) {
          // Floating drift
          star.origX += star.vx;
          star.origY += star.vy;
          star.rotation += star.rotSpeed;

          // Screen wrapping
          if (star.origX < -star.radius) star.origX = width + star.radius;
          if (star.origX > width + star.radius) star.origX = -star.radius;
          if (star.origY < -star.radius) star.origY = height + star.radius;
          if (star.origY > height + star.radius) star.origY = -star.radius;

          // Magnetic cursor drag & litmus paper color heating
          const dx = mouse.x - star.origX;
          const dy = mouse.y - star.origY;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < influenceRadius) {
            const pull = (1 - dist / influenceRadius);
            const targetHeat = Math.pow(pull, 1.2);
            star.heat = Math.max(star.heat, targetHeat);

            const angle = Math.atan2(dy, dx);
            const moveDist = pull * maxDisplacement;
            const targetPosX = star.origX + Math.cos(angle) * moveDist;
            const targetPosY = star.origY + Math.sin(angle) * moveDist;

            star.x += (targetPosX - star.x) * 0.14;
            star.y += (targetPosY - star.y) * 0.14;
          } else {
            // Litmus cooling fade back slowly
            star.heat *= 0.94;
            if (star.heat < 0.005) star.heat = 0;

            // Ease back to equilibrium
            star.x += (star.origX - star.x) * 0.08;
            star.y += (star.origY - star.y) * 0.08;
          }
        } else {
          star.x = star.origX;
          star.y = star.origY;
        }

        const { color, alpha } = getLitmusColor(star.baseColor, star.heat, star.baseAlpha);

        ctx.save();
        ctx.globalAlpha = alpha;
        ctx.fillStyle = color;

        // Subtle glow for heated or larger stars
        if (star.heat > 0.25 || star.radius > 35) {
          ctx.shadowColor = color;
          ctx.shadowBlur = 12 + star.heat * 18;
        }

        drawStarShape(
          ctx,
          star.x,
          star.y,
          5,
          star.radius,
          star.radius * star.innerRadiusRatio,
          star.rotation
        );
        ctx.fill();
        ctx.restore();
      }

      animId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('touchmove', handleTouchMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0"
      style={{
        width: '100vw',
        height: '100vh',
      }}
      aria-hidden="true"
    />
  );
};
