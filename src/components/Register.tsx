import React, { useState, useEffect } from 'react';
import { isRegistrationActive } from '../config/eventConfig.ts';

interface RegistrationData {
  id: string;
  name: string;
  registerNumber: string;
  department: string;
  year: string;
  college: string;
  email: string;
  phone: string;
  registeredAtIst: string;
}

export const Register: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    registerNumber: '',
    department: 'CSE AIML',
    year: '3rd Year',
    college: 'Jeppiaar Engineering College',
    email: '',
    phone: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const [successData, setSuccessData] = useState<RegistrationData | null>(null);
  const [isStarBursting, setIsStarBursting] = useState(false);

  // Check cut-off status
  const [isCutoffClosed, setIsCutoffClosed] = useState(false);
  const [cutoffReason, setCutoffReason] = useState<string>('');

  useEffect(() => {
    const checkStatus = async () => {
      try {
        const res = await fetch('/api/event-status');
        if (res.ok) {
          const data = await res.json();
          setIsCutoffClosed(!data.isOpen);
          setCutoffReason(data.reason || 'Registration closed automatically 1 hour prior to event start time.');
        } else {
          const local = isRegistrationActive();
          setIsCutoffClosed(!local.isOpen);
          setCutoffReason(local.reason || '');
        }
      } catch {
        const local = isRegistrationActive();
        setIsCutoffClosed(!local.isOpen);
        setCutoffReason(local.reason || '');
      }
    };

    checkStatus();
    const interval = setInterval(checkStatus, 30000);
    return () => clearInterval(interval);
  }, []);

  const validate = () => {
    const errs: Record<string, string> = {};

    if (!formData.name.trim() || formData.name.trim().length < 2) {
      errs.name = 'Full name must be at least 2 characters.';
    }
    if (!formData.registerNumber.trim() || formData.registerNumber.trim().length < 4) {
      errs.registerNumber = 'Please enter a valid college register number.';
    }
    if (!formData.department.trim()) {
      errs.department = 'Department is required.';
    }
    if (!formData.year.trim()) {
      errs.year = 'Year of study is required.';
    }
    if (!formData.college.trim()) {
      errs.college = 'College name is required.';
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim() || !emailRegex.test(formData.email.trim())) {
      errs.email = 'Please enter a valid email address.';
    }
    const cleanPhone = formData.phone.replace(/[^0-9]/g, '');
    if (cleanPhone.length < 10) {
      errs.phone = 'Please enter a valid 10-digit mobile number.';
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setServerError(null);

    if (!validate()) return;

    setIsSubmitting(true);

    try {
      const res = await fetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        if (res.status === 403) {
          setIsCutoffClosed(true);
          setCutoffReason(data.error || 'Registration closed.');
        } else {
          setServerError(data.error || 'Registration failed. Please check your details.');
        }
        setIsSubmitting(false);
        return;
      }

      // Success! Trigger star burst animation
      setIsStarBursting(true);
      setTimeout(() => {
        setSuccessData(data.registration);
        setIsSubmitting(false);
      }, 1300);

    } catch {
      setServerError('Network error while processing registration. Please try again.');
      setIsSubmitting(false);
    }
  };

  return (
    <section id="register" className="py-24 px-4 md:px-8 max-w-4xl mx-auto border-t border-[#E2A9F0]/20 relative">
      
      {/* Header */}
      <div className="text-center mb-14">
        <span className="text-xs font-mono tracking-widest text-[#E2A9F0] uppercase block mb-2">
          05 · REGISTRATION PORTAL
        </span>
        <h2 className="font-display text-4xl sm:text-5xl md:text-6xl text-white tracking-tight uppercase">
          REGISTER FOR WOW CODING...
        </h2>
        <p className="font-mono text-xs sm:text-sm text-[#E8E2D0]/80 max-w-lg mx-auto mt-2">
          Join the Women&rsquo;s Day coding challenge presented by CSE AIML. Free entry with verified student credentials.
        </p>
      </div>

      {/* STATE 1: REGISTRATION CLOSED in Octagon Frame (NO rounded borders) */}
      {isCutoffClosed && (
        <div className="shape-octagon p-8 sm:p-14 bg-[#3E1F4D]/95 border-l-4 border-l-[#B01FD6] border-y border-r border-[#E2A9F0] text-center shadow-2xl relative overflow-hidden">
          <div className="w-20 h-20 mx-auto mb-6 p-4 bg-[#B01FD6]/30 border border-[#E2A9F0] shape-octagon-badge flex items-center justify-center text-[#E2A9F0] text-3xl">
            ★
          </div>

          <h3 className="font-display text-4xl sm:text-5xl text-white uppercase tracking-tight mb-3">
            REGISTRATION CLOSED
          </h3>

          <p className="font-mono text-sm text-[#E8E2D0]/85 max-w-md mx-auto mb-6 leading-relaxed">
            {cutoffReason || 'Registration for Wow Coding automatically closes 1 hour prior to the event start time. Lab terminal seating has been finalized.'}
          </p>

          <div className="shape-octagon-sm p-4 bg-[#5E3070]/60 border border-[#E2A9F0]/20 font-mono text-xs text-[#E8E2D0]/70 max-w-md mx-auto">
            <span>For event inquiries, contact the Department of CSE AIML, Jeppiaar Engineering College.</span>
          </div>
        </div>
      )}

      {/* STATE 2: SUCCESS WITH STAR-BURST ANIMATION in Octagon Shape */}
      {!isCutoffClosed && (successData || isStarBursting) && (
        <div className="shape-octagon p-8 sm:p-12 bg-[#3E1F4D]/95 border-l-4 border-l-[#E2A9F0] border-y border-r border-[#E2A9F0]/40 text-center shadow-2xl relative overflow-hidden">
          
          {/* Animated Star-Burst Visual */}
          <div className="relative w-32 h-32 mx-auto mb-8 flex items-center justify-center">
            <div className={`absolute inset-0 bg-gradient-to-tr from-[#B01FD6] via-[#C46DE0] to-[#E2A9F0] filter blur-xl transition-all duration-1000 ${isStarBursting && !successData ? 'opacity-100 scale-150 animate-pulse' : 'opacity-40 scale-100'}`} />

            <svg
              className={`w-24 h-24 relative z-10 drop-shadow-[0_0_25px_rgba(226,169,240,0.9)] transition-all duration-700 ${
                isStarBursting || successData ? 'scale-110 rotate-12' : 'scale-90 rotate-0'
              }`}
              viewBox="0 0 24 24"
              fill="#E2A9F0"
              stroke="#B01FD6"
              strokeWidth="1.5"
            >
              <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
            </svg>
          </div>

          <span className="text-xs font-mono text-[#E2A9F0] font-bold tracking-widest uppercase block mb-1">
            STAR ALLOCATED · ENTRY CONFIRMED
          </span>
          <h3 className="font-display text-4xl sm:text-5xl text-white uppercase tracking-tight mb-2">
            YOU&rsquo;RE IN! WOWWW!
          </h3>
          <p className="font-script text-2xl text-[#E2A9F0] mb-6">
            Happy Women&rsquo;s Day · Code Your Way to Brilliance!
          </p>

          {successData && (
            <div className="shape-octagon-sm max-w-md mx-auto text-left font-mono bg-[#5E3070]/70 border border-[#E2A9F0]/30 p-6 space-y-3 text-xs">
              <div className="flex justify-between border-b border-[#E2A9F0]/20 pb-2">
                <span className="text-[#E8E2D0]/60">REGISTRATION PASS ID</span>
                <span className="text-[#E2A9F0] font-bold text-sm tracking-wider">{successData.id}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#E8E2D0]/60">PARTICIPANT NAME</span>
                <span className="text-white font-medium">{successData.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#E8E2D0]/60">REGISTER NUMBER</span>
                <span className="text-white font-medium">{successData.registerNumber}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#E8E2D0]/60">DEPARTMENT</span>
                <span className="text-white">{successData.department} ({successData.year})</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#E8E2D0]/60">COLLEGE</span>
                <span className="text-white">{successData.college}</span>
              </div>
              <div className="flex justify-between pt-2 border-t border-[#E2A9F0]/20">
                <span className="text-[#E8E2D0]/60">TIMESTAMP (IST)</span>
                <span className="text-white/80">{successData.registeredAtIst}</span>
              </div>
            </div>
          )}

          <div className="mt-8 flex flex-col sm:flex-row justify-center gap-4 font-mono text-xs">
            <button
              onClick={() => window.print()}
              className="shape-hexagon-btn px-9 py-3.5 bg-[#E8E2D0] hover:bg-white text-[#3E1F4D] uppercase font-bold tracking-wider transition-colors cursor-pointer shadow-lg"
            >
              PRINT / SAVE PASS
            </button>
            <button
              onClick={() => {
                setSuccessData(null);
                setIsStarBursting(false);
                setFormData({
                  name: '',
                  registerNumber: '',
                  department: 'CSE AIML',
                  year: '3rd Year',
                  college: 'Jeppiaar Engineering College',
                  email: '',
                  phone: '',
                });
              }}
              className="px-6 py-3 text-[#E8E2D0]/70 hover:text-white uppercase tracking-wider transition-colors cursor-pointer"
            >
              REGISTER ANOTHER PARTICIPANT
            </button>
          </div>
        </div>
      )}

      {/* STATE 3: ACTIVE REGISTRATION FORM in Octagon Box (NO rounded borders) */}
      {!isCutoffClosed && !successData && !isStarBursting && (
        <form
          onSubmit={handleSubmit}
          className="shape-octagon bg-[#3E1F4D]/90 border-l-4 border-l-[#E2A9F0] border-y border-r border-[#E2A9F0]/30 p-6 sm:p-10 shadow-2xl relative font-mono"
        >
          {serverError && (
            <div className="mb-6 p-4 bg-red-950/80 border-l-4 border-l-red-400 text-xs text-red-200 flex items-center gap-3">
              <span className="text-lg">⚠</span>
              <span>{serverError}</span>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Full Name */}
            <div>
              <label className="block text-xs uppercase tracking-wider text-[#E8E2D0]/90 mb-2">
                Full Name *
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g. Swathi Rangarajan"
                className={`w-full px-4 py-3 bg-[#5E3070]/60 border ${errors.name ? 'border-red-400' : 'border-[#E2A9F0]/30 focus:border-[#E2A9F0]'} text-white text-sm outline-none transition-colors rounded-none`}
              />
              {errors.name && <p className="text-[11px] text-red-300 mt-1">{errors.name}</p>}
            </div>

            {/* Register Number */}
            <div>
              <label className="block text-xs uppercase tracking-wider text-[#E8E2D0]/90 mb-2">
                College Register Number *
              </label>
              <input
                type="text"
                required
                value={formData.registerNumber}
                onChange={(e) => setFormData({ ...formData, registerNumber: e.target.value })}
                placeholder="e.g. 310822104055"
                className={`w-full px-4 py-3 bg-[#5E3070]/60 border ${errors.registerNumber ? 'border-red-400' : 'border-[#E2A9F0]/30 focus:border-[#E2A9F0]'} text-white text-sm outline-none transition-colors uppercase rounded-none`}
              />
              {errors.registerNumber && <p className="text-[11px] text-red-300 mt-1">{errors.registerNumber}</p>}
            </div>

            {/* Department */}
            <div>
              <label className="block text-xs uppercase tracking-wider text-[#E8E2D0]/90 mb-2">
                Department *
              </label>
              <input
                type="text"
                required
                value={formData.department}
                onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                placeholder="e.g. CSE AIML, CSE, IT, AIDS"
                className={`w-full px-4 py-3 bg-[#5E3070]/60 border ${errors.department ? 'border-red-400' : 'border-[#E2A9F0]/30 focus:border-[#E2A9F0]'} text-white text-sm outline-none transition-colors rounded-none`}
              />
              {errors.department && <p className="text-[11px] text-red-300 mt-1">{errors.department}</p>}
            </div>

            {/* Year of Study */}
            <div>
              <label className="block text-xs uppercase tracking-wider text-[#E8E2D0]/90 mb-2">
                Year of Study *
              </label>
              <select
                value={formData.year}
                onChange={(e) => setFormData({ ...formData, year: e.target.value })}
                className="w-full px-4 py-3 bg-[#3E1F4D] border border-[#E2A9F0]/30 focus:border-[#E2A9F0] text-white text-sm outline-none transition-colors cursor-pointer rounded-none"
              >
                <option value="1st Year">1st Year (Freshman)</option>
                <option value="2nd Year">2nd Year (Sophomore)</option>
                <option value="3rd Year">3rd Year (Junior)</option>
                <option value="4th Year">4th Year (Senior)</option>
              </select>
            </div>

            {/* College Name */}
            <div className="md:col-span-2">
              <label className="block text-xs uppercase tracking-wider text-[#E8E2D0]/90 mb-2">
                College / Institution *
              </label>
              <input
                type="text"
                required
                value={formData.college}
                onChange={(e) => setFormData({ ...formData, college: e.target.value })}
                placeholder="Jeppiaar Engineering College"
                className={`w-full px-4 py-3 bg-[#5E3070]/60 border ${errors.college ? 'border-red-400' : 'border-[#E2A9F0]/30 focus:border-[#E2A9F0]'} text-white text-sm outline-none transition-colors rounded-none`}
              />
              {errors.college && <p className="text-[11px] text-red-300 mt-1">{errors.college}</p>}
            </div>

            {/* Email Address */}
            <div>
              <label className="block text-xs uppercase tracking-wider text-[#E8E2D0]/90 mb-2">
                Official / Student Email *
              </label>
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="student@jeppiaar.ac.in"
                className={`w-full px-4 py-3 bg-[#5E3070]/60 border ${errors.email ? 'border-red-400' : 'border-[#E2A9F0]/30 focus:border-[#E2A9F0]'} text-white text-sm outline-none transition-colors rounded-none`}
              />
              {errors.email && <p className="text-[11px] text-red-300 mt-1">{errors.email}</p>}
            </div>

            {/* Phone Number */}
            <div>
              <label className="block text-xs uppercase tracking-wider text-[#E8E2D0]/90 mb-2">
                Mobile Number (10 Digits) *
              </label>
              <input
                type="tel"
                required
                maxLength={14}
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                placeholder="9876543210"
                className={`w-full px-4 py-3 bg-[#5E3070]/60 border ${errors.phone ? 'border-red-400' : 'border-[#E2A9F0]/30 focus:border-[#E2A9F0]'} text-white text-sm outline-none transition-colors rounded-none`}
              />
              {errors.phone && <p className="text-[11px] text-red-300 mt-1">{errors.phone}</p>}
            </div>

          </div>

          {/* Submit */}
          <div className="mt-8 pt-6 border-t border-[#E2A9F0]/20 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-[11px] text-[#E8E2D0]/70">
              * Validates college register number and email to prevent duplicate seat allocation.
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="shape-hexagon-btn w-full sm:w-auto px-9 py-4 bg-[#B01FD6] hover:bg-[#C46DE0] text-white font-bold tracking-wider uppercase text-sm shadow-[0_0_20px_rgba(176,31,214,0.5)] transition-all cursor-pointer flex items-center justify-center gap-3 disabled:opacity-50"
            >
              {isSubmitting ? (
                <>
                  <span className="w-4 h-4 border-2 border-white border-t-transparent animate-spin rounded-none" />
                  <span>ALLOCATING SEAT...</span>
                </>
              ) : (
                <>
                  <span className="text-sm">★</span>
                  <span>SUBMIT REGISTRATION</span>
                </>
              )}
            </button>
          </div>
        </form>
      )}

    </section>
  );
};
