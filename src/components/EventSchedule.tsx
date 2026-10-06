import React, { useEffect, useState } from 'react';
import { EVENT_CONFIG, getEventTimestamps, isRegistrationActive } from '../config/eventConfig.ts';

interface EventStatusData {
  isOpen: boolean;
  cutOffMs: number;
  eventStartMs: number;
  timeRemainingMs: number;
  serverTimeIst: string;
}

export const EventSchedule: React.FC = () => {
  const [eventStatus, setEventStatus] = useState<EventStatusData | null>(null);
  const [countdown, setCountdown] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
    totalRemainingMs: 0
  });

  // Fetch status from server
  useEffect(() => {
    const fetchStatus = async () => {
      try {
        const res = await fetch('/api/event-status');
        if (res.ok) {
          const data = await res.json();
          setEventStatus(data);
        } else {
          const local = isRegistrationActive();
          setEventStatus({
            isOpen: local.isOpen,
            cutOffMs: local.cutOffMs,
            eventStartMs: local.eventStartMs,
            timeRemainingMs: local.timeRemainingMs,
            serverTimeIst: new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })
          });
        }
      } catch {
        const local = isRegistrationActive();
        setEventStatus({
          isOpen: local.isOpen,
          cutOffMs: local.cutOffMs,
          eventStartMs: local.eventStartMs,
          timeRemainingMs: local.timeRemainingMs,
          serverTimeIst: new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })
        });
      }
    };

    fetchStatus();
    const interval = setInterval(fetchStatus, 30000);
    return () => clearInterval(interval);
  }, []);

  // Real-time 1-second countdown
  useEffect(() => {
    const { eventStartMs } = getEventTimestamps(EVENT_CONFIG);

    const tick = () => {
      const now = Date.now();
      const diff = Math.max(0, eventStartMs - now);

      const d = Math.floor(diff / (1000 * 60 * 60 * 24));
      const h = Math.floor((diff / (1000 * 60 * 60)) % 24);
      const m = Math.floor((diff / (1000 * 60)) % 60);
      const s = Math.floor((diff / 1000) % 60);

      setCountdown({
        days: d,
        hours: h,
        minutes: m,
        seconds: s,
        totalRemainingMs: diff
      });
    };

    tick();
    const timer = setInterval(tick, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section id="time" className="py-24 px-4 md:px-8 max-w-6xl mx-auto border-t border-[#E2A9F0]/20 relative">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-4">
        <div>
          <span className="text-xs font-mono tracking-widest text-[#E2A9F0] uppercase block mb-2">
            03 · CLOCK &amp; SCHEDULE
          </span>
          <h2 className="font-display text-4xl sm:text-5xl md:text-6xl text-white tracking-tight uppercase">
            EVENT TIMELINE
          </h2>
        </div>
        <p className="font-mono text-xs sm:text-sm text-[#E8E2D0]/70 max-w-md">
          Live IST countdown to the start of Wow Coding. Configured for {EVENT_CONFIG.startTime} AM to {EVENT_CONFIG.endTime} PM.
        </p>
      </div>

      {/* Big Live Countdown Banner in Octagon Shape (NO rounded borders) */}
      <div className="shape-octagon p-8 sm:p-12 bg-[#3E1F4D]/90 border-l-4 border-l-[#B01FD6] border-y border-r border-[#E2A9F0]/30 relative shadow-2xl mb-12">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
          
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#5E3070] border border-[#E2A9F0]/30 text-xs font-mono text-[#E2A9F0] mb-3">
              <span className="w-2 h-2 rotate-45 bg-[#B01FD6] animate-ping" />
              <span>LIVE IST COUNTDOWN TO START</span>
            </div>
            <h3 className="font-display text-3xl sm:text-4xl text-white uppercase tracking-tight">
              WOW CODING COMMENCES IN
            </h3>
            <p className="text-xs font-mono text-[#E8E2D0]/70 mt-1">
              Event Window: {EVENT_CONFIG.startTime} AM &ndash; {EVENT_CONFIG.endTime} PM IST · {EVENT_CONFIG.venueName}
            </p>
          </div>

          {/* Countdown Numbers in Octagonal Boxes */}
          <div className="grid grid-cols-4 gap-3 sm:gap-4 font-mono text-center">
            
            <div className="shape-octagon-sm p-4 sm:p-5 bg-[#5E3070]/80 border-t-2 border-[#E2A9F0]/40 min-w-[70px] sm:min-w-[92px]">
              <span className="font-display text-3xl sm:text-5xl text-white tabular-numbers block">
                {String(countdown.days).padStart(2, '0')}
              </span>
              <span className="text-[10px] text-[#E2A9F0] tracking-widest uppercase block mt-1">DAYS</span>
            </div>

            <div className="shape-octagon-sm p-4 sm:p-5 bg-[#5E3070]/80 border-t-2 border-[#E2A9F0]/40 min-w-[70px] sm:min-w-[92px]">
              <span className="font-display text-3xl sm:text-5xl text-white tabular-numbers block">
                {String(countdown.hours).padStart(2, '0')}
              </span>
              <span className="text-[10px] text-[#E2A9F0] tracking-widest uppercase block mt-1">HOURS</span>
            </div>

            <div className="shape-octagon-sm p-4 sm:p-5 bg-[#5E3070]/80 border-t-2 border-[#E2A9F0]/40 min-w-[70px] sm:min-w-[92px]">
              <span className="font-display text-3xl sm:text-5xl text-white tabular-numbers block">
                {String(countdown.minutes).padStart(2, '0')}
              </span>
              <span className="text-[10px] text-[#E2A9F0] tracking-widest uppercase block mt-1">MINS</span>
            </div>

            <div className="shape-octagon-sm p-4 sm:p-5 bg-[#B01FD6]/40 border-t-2 border-[#E2A9F0] min-w-[70px] sm:min-w-[92px]">
              <span className="font-display text-3xl sm:text-5xl text-white tabular-numbers block animate-pulse">
                {String(countdown.seconds).padStart(2, '0')}
              </span>
              <span className="text-[10px] text-[#E2A9F0] tracking-widest uppercase block mt-1">SECS</span>
            </div>

          </div>

        </div>

        {/* Automatic Cut-Off Reminder Banner */}
        <div className="mt-8 pt-6 border-t border-[#E2A9F0]/20 flex flex-col sm:flex-row items-start sm:items-center justify-between text-xs font-mono text-[#E8E2D0]/80 gap-3">
          <div className="flex items-center gap-2">
            <span className="text-[#E2A9F0]">★</span>
            <span>
              <strong>REGISTRATION CUT-OFF:</strong> Automatically closes exactly 1 hour prior to event start ({EVENT_CONFIG.startTime} AM IST).
            </span>
          </div>

          <div className="text-[11px] text-[#E2A9F0]/70">
            TIMEZONE: Asia/Kolkata (IST · UTC+5:30)
          </div>
        </div>

      </div>

      {/* Timeline Table in Octagon Container (NO rounded borders) */}
      <div className="shape-octagon border-l-4 border-l-[#E2A9F0] border-y border-r border-[#E2A9F0]/20 bg-[#3E1F4D]/75 overflow-hidden font-mono text-xs sm:text-sm">
        <div className="p-4 bg-[#5E3070]/80 border-b border-[#E2A9F0]/20 font-bold text-white uppercase flex items-center justify-between">
          <span>EVENT RUN SCHEDULE · WOMEN&rsquo;S DAY SPECIAL</span>
          <span className="text-xs text-[#E2A9F0]">JEPPIAAR ENGINEERING COLLEGE</span>
        </div>

        <div className="divide-y divide-[#E2A9F0]/15">
          <div className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div className="flex items-center gap-4">
              <span className="text-[#E2A9F0] font-bold w-24">08:30 AM</span>
              <span className="text-white font-medium">Automatic Registration Cut-Off</span>
            </div>
            <span className="text-xs text-[#E8E2D0]/60">Portal closes 1 hr before start. Terminal allocations lock.</span>
          </div>

          <div className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div className="flex items-center gap-4">
              <span className="text-[#E2A9F0] font-bold w-24">09:30 AM</span>
              <span className="text-white font-medium">Check-In, Welcome &amp; Lab Allotment</span>
            </div>
            <span className="text-xs text-[#E8E2D0]/60">Registration pass validation at Department of CSE AIML Labs.</span>
          </div>

          <div className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div className="flex items-center gap-4">
              <span className="text-[#E2A9F0] font-bold w-24">10:00 AM</span>
              <span className="text-white font-medium">Level 1: Syntax &amp; Logic Debugging (Entry Toughness)</span>
            </div>
            <span className="text-xs text-[#E8E2D0]/60">Fix the broken code &amp; compile errors to restore baseline function.</span>
          </div>

          <div className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div className="flex items-center gap-4">
              <span className="text-[#E2A9F0] font-bold w-24">11:15 AM</span>
              <span className="text-white font-medium">Level 2: Runtime Optimization &amp; Refactoring (Increased Toughness)</span>
            </div>
            <span className="text-xs text-[#E8E2D0]/60">Eliminate TLE bottlenecks to achieve optimal runtime functional code.</span>
          </div>

          <div className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div className="flex items-center gap-4">
              <span className="text-[#E2A9F0] font-bold w-24">01:30 PM</span>
              <span className="text-white font-medium">Level 3: Extreme Scale Stress Testing (Maximum Toughness · Hardest)</span>
            </div>
            <span className="text-xs text-[#E8E2D0]/60">Peak algorithmic refactoring against high-load benchmarks (&ldquo;Wowww!&rdquo;).</span>
          </div>

          <div className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2 bg-[#B01FD6]/20">
            <div className="flex items-center gap-4">
              <span className="text-white font-bold w-24">03:00 PM</span>
              <span className="text-white font-bold">Event Conclusion &amp; Women in Tech Honors</span>
            </div>
            <span className="text-xs text-[#E2A9F0] font-semibold">Awards ceremony &amp; celebration.</span>
          </div>
        </div>
      </div>

    </section>
  );
};
