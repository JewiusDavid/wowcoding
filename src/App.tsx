import React, { useEffect, useState } from 'react';
import { StarBackground } from './components/StarBackground.tsx';
import { CustomCursor } from './components/CustomCursor.tsx';
import { Navbar } from './components/Navbar.tsx';
import { Hero } from './components/Hero.tsx';
import { About } from './components/About.tsx';
import { Instructions } from './components/Instructions.tsx';
import { EventSchedule } from './components/EventSchedule.tsx';
import { Location } from './components/Location.tsx';
import { Register } from './components/Register.tsx';
import { Footer } from './components/Footer.tsx';
import { AdminPortal } from './components/AdminPortal.tsx';
import { NotFound } from './components/NotFound.tsx';
import { IntroSequence } from './components/IntroSequence.tsx';
import { AudioPlayerWidget } from './components/AudioPlayerWidget.tsx';
import { isRegistrationActive } from './config/eventConfig.ts';
import { calmMusic } from './utils/audioEngine.ts';

export default function App() {
  const [isAdminRoute, setIsAdminRoute] = useState(false);
  const [adminToken, setAdminToken] = useState<string | null>(null);
  const [isAdminVerified, setIsAdminVerified] = useState<boolean | null>(null);
  const [isUnknownRoute, setIsUnknownRoute] = useState(false);
  const [isRegistrationOpen, setIsRegistrationOpen] = useState(true);
  const [showIntro, setShowIntro] = useState(true);

  // Parse path on mount and popstate
  useEffect(() => {
    const handleRoute = async () => {
      const path = window.location.pathname;

      if (path.startsWith('/admin/')) {
        const token = path.substring('/admin/'.length).trim();
        setIsAdminRoute(true);
        setAdminToken(token);

        // Add noindex tag dynamically
        let meta = document.querySelector('meta[name="robots"]');
        if (!meta) {
          meta = document.createElement('meta');
          meta.setAttribute('name', 'robots');
          document.head.appendChild(meta);
        }
        meta.setAttribute('content', 'noindex, nofollow');

        // Verify token with backend
        try {
          const res = await fetch('/api/admin/verify', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ token }),
          });

          if (res.ok) {
            setIsAdminVerified(true);
          } else {
            setIsAdminVerified(false);
          }
        } catch {
          setIsAdminVerified(false);
        }
      } else if (path !== '/' && path !== '') {
        // Any unknown route shows 404
        setIsUnknownRoute(true);
      } else {
        setIsAdminRoute(false);
        setIsUnknownRoute(false);
      }
    };

    handleRoute();
    window.addEventListener('popstate', handleRoute);
    return () => window.removeEventListener('popstate', handleRoute);
  }, []);

  // Fetch registration status
  useEffect(() => {
    const checkStatus = async () => {
      try {
        const res = await fetch('/api/event-status');
        if (res.ok) {
          const data = await res.json();
          setIsRegistrationOpen(data.isOpen);
        } else {
          setIsRegistrationOpen(isRegistrationActive().isOpen);
        }
      } catch {
        setIsRegistrationOpen(isRegistrationActive().isOpen);
      }
    };

    checkStatus();
  }, []);

  // Global user interaction gesture to start calm music if autoplay policy suspended it
  useEffect(() => {
    const handleFirstInteraction = () => {
      const status = calmMusic.getStatus();
      if (!status.isPlaying && !status.isMuted) {
        calmMusic.startMusic().catch(() => {});
      }
    };

    window.addEventListener('pointerdown', handleFirstInteraction, { once: true });
    window.addEventListener('keydown', handleFirstInteraction, { once: true });
    return () => {
      window.removeEventListener('pointerdown', handleFirstInteraction);
      window.removeEventListener('keydown', handleFirstInteraction);
    };
  }, []);

  // Scroll to register helper
  const handleRegisterClick = () => {
    const el = document.getElementById('register');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // 1. Unknown route: render NotFound
  if (isUnknownRoute) {
    return <NotFound />;
  }

  // 2. Admin route
  if (isAdminRoute) {
    if (isAdminVerified === null) {
      return (
        <div className="min-h-screen bg-[#5E3070] flex items-center justify-center font-mono text-white text-xs">
          <div className="flex items-center gap-3">
            <span className="w-3 h-3 rounded-full bg-[#E2A9F0] animate-ping" />
            <span className="tracking-widest">VERIFYING CREDENTIALS...</span>
          </div>
        </div>
      );
    }

    if (!isAdminVerified || !adminToken) {
      return <NotFound />;
    }

    return (
      <>
        <CustomCursor />
        <AdminPortal token={adminToken} />
      </>
    );
  }

  // 3. Main Event Landing Page
  return (
    <div className="relative min-h-screen bg-[#5E3070] text-[#E8E2D0] selection:bg-[#B01FD6]/40 selection:text-white">
      {/* Intro Shooting Star Sequence & Sweet Music Opener */}
      {showIntro && (
        <IntroSequence
          isOpen={showIntro}
          onComplete={() => setShowIntro(false)}
        />
      )}

      {/* Shooting Star Trailing Particle Cursor */}
      <CustomCursor />

      {/* Floating Calm Music Controller with Replay Intro option */}
      <AudioPlayerWidget onReplayIntro={() => setShowIntro(true)} />

      {/* Interactive 5-Pointed Star Canvas Background */}
      <StarBackground />

      {/* Fixed Navbar with Centered College Logo Slot */}
      <Navbar />

      {/* Main Content Sections */}
      <main className="relative z-10">
        <Hero
          onRegisterClick={handleRegisterClick}
          isRegistrationOpen={isRegistrationOpen}
        />
        <About />
        <Instructions />
        <EventSchedule />
        <Location />
        <Register />
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
