// Event & Registration Configuration
// Times in IST (Asia/Kolkata, UTC+05:30)

export interface EventConfigType {
  eventName: string;
  tagline: string;
  specialOccasion: string;
  organizer: string;
  institution: string;
  venueName: string;
  venueAddress: string;
  eventDate: string; // YYYY-MM-DD
  startTime: string; // HH:mm IST e.g. "09:30"
  endTime: string;   // HH:mm IST e.g. "15:00"
  registrationCloseHoursBeforeStart: number; // 1 hour before
  forceStatus?: 'open' | 'closed' | 'auto';
}

export const EVENT_CONFIG: EventConfigType = {
  eventName: "Wow Coding...",
  tagline: "Code Your Way from Ehh! to Wowww!",
  specialOccasion: "Happy Women's Day",
  organizer: "CSE AIML",
  institution: "Jeppiaar Engineering College",
  venueName: "Department of CSE AIML Labs, Jeppiaar Engineering College",
  venueAddress: "Jeppiaar Engineering College, Rajiv Gandhi Salai (OMR), Semmancheri, Chennai, Tamil Nadu 600119",
  eventDate: "2026-10-15",
  startTime: "09:30",
  endTime: "15:00",
  registrationCloseHoursBeforeStart: 1,
  forceStatus: 'auto'
};

export function getEventTimestamps(config: EventConfigType = EVENT_CONFIG) {
  const eventStartIso = `${config.eventDate}T${config.startTime}:00+05:30`;
  const eventStartMs = new Date(eventStartIso).getTime();
  
  // Cut-off is 1 hour before start time
  const cutOffMs = eventStartMs - (config.registrationCloseHoursBeforeStart * 60 * 60 * 1000);
  
  const eventEndIso = `${config.eventDate}T${config.endTime}:00+05:30`;
  const eventEndMs = new Date(eventEndIso).getTime();

  return {
    eventStartIso,
    eventStartMs,
    cutOffIso: new Date(cutOffMs).toISOString(),
    cutOffMs,
    eventEndIso,
    eventEndMs
  };
}

export function isRegistrationActive(nowMs: number = Date.now(), config: EventConfigType = EVENT_CONFIG): {
  isOpen: boolean;
  reason?: string;
  cutOffMs: number;
  eventStartMs: number;
  timeRemainingMs: number;
} {
  if (config.forceStatus === 'open') {
    const { cutOffMs, eventStartMs } = getEventTimestamps(config);
    return { isOpen: true, cutOffMs, eventStartMs, timeRemainingMs: Math.max(0, cutOffMs - nowMs) };
  }
  if (config.forceStatus === 'closed') {
    const { cutOffMs, eventStartMs } = getEventTimestamps(config);
    return { isOpen: false, reason: "Registration is currently closed.", cutOffMs, eventStartMs, timeRemainingMs: 0 };
  }

  const { cutOffMs, eventStartMs } = getEventTimestamps(config);

  if (nowMs >= cutOffMs) {
    return {
      isOpen: false,
      reason: "Registration closed 1 hour prior to the event start time.",
      cutOffMs,
      eventStartMs,
      timeRemainingMs: 0
    };
  }

  return {
    isOpen: true,
    cutOffMs,
    eventStartMs,
    timeRemainingMs: cutOffMs - nowMs
  };
}
