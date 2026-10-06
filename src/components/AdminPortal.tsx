import React, { useState, useEffect, useMemo } from 'react';

interface Registration {
  id: string;
  name: string;
  registerNumber: string;
  department: string;
  year: string;
  college: string;
  email: string;
  phone: string;
  registeredAt: string;
  registeredAtIst: string;
}

interface AdminPortalProps {
  token: string;
}

export const AdminPortal: React.FC<AdminPortalProps> = ({ token }) => {
  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [totalCount, setTotalCount] = useState<number>(0);
  const [animatedCount, setAnimatedCount] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [departmentFilter, setDepartmentFilter] = useState<string>('ALL');
  const [autoRefresh, setAutoRefresh] = useState<boolean>(true);
  const [lastRefreshedAt, setLastRefreshedAt] = useState<string>('');

  const fetchRegistrations = async () => {
    setIsLoading(true);
    try {
      const res = await fetch(`/api/admin/registrations?token=${encodeURIComponent(token)}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      if (res.ok) {
        const data = await res.json();
        setRegistrations(data.registrations || []);
        setTotalCount(data.total || 0);
        setLastRefreshedAt(new Date().toLocaleTimeString('en-IN', { timeZone: 'Asia/Kolkata' }));
      }
    } catch {
      // silently handle
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchRegistrations();
  }, [token]);

  // Auto refresh every 15s if enabled
  useEffect(() => {
    if (!autoRefresh) return;
    const interval = setInterval(fetchRegistrations, 15000);
    return () => clearInterval(interval);
  }, [autoRefresh, token]);

  // Animated counter effect
  useEffect(() => {
    if (totalCount === 0) {
      setAnimatedCount(0);
      return;
    }
    const duration = 800; // ms
    const stepTime = 30;
    const totalSteps = duration / stepTime;
    const increment = totalCount / totalSteps;
    let current = 0;

    const timer = setInterval(() => {
      current += increment;
      if (current >= totalCount) {
        setAnimatedCount(totalCount);
        clearInterval(timer);
      } else {
        setAnimatedCount(Math.floor(current));
      }
    }, stepTime);

    return () => clearInterval(timer);
  }, [totalCount]);

  // Filtered registrations
  const filteredList = useMemo(() => {
    return registrations.filter((r) => {
      const matchSearch =
        r.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.registerNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.phone.includes(searchQuery) ||
        r.department.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.id.toLowerCase().includes(searchQuery.toLowerCase());

      const matchDept = departmentFilter === 'ALL' || r.department.toLowerCase() === departmentFilter.toLowerCase();

      return matchSearch && matchDept;
    });
  }, [registrations, searchQuery, departmentFilter]);

  const uniqueDepartments = useMemo(() => {
    const set = new Set<string>();
    registrations.forEach(r => {
      if (r.department) set.add(r.department.trim());
    });
    return Array.from(set);
  }, [registrations]);

  const handleCsvExport = () => {
    const exportUrl = `/api/admin/export.csv?token=${encodeURIComponent(token)}`;
    window.location.href = exportUrl;
  };

  return (
    <div className="min-h-screen bg-[#5E3070] text-[#E8E2D0] font-mono selection:bg-[#B01FD6]/40 selection:text-white relative z-10 pb-20">
      
      {/* Top Bar */}
      <header className="border-b border-[#E2A9F0]/20 bg-[#3E1F4D]/90 backdrop-blur-md sticky top-0 z-40 px-4 py-4">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="shape-octagon-badge w-9 h-9 bg-[#B01FD6] flex items-center justify-center text-white font-bold text-sm shadow-[0_0_15px_rgba(176,31,214,0.5)]">
              ★
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-display text-xl text-white tracking-wide">WOW CODING ADMIN</span>
                <span className="text-[10px] px-2 py-0.5 bg-[#B01FD6]/30 border border-[#E2A9F0]/40 text-[#E2A9F0] shape-octagon-sm uppercase">
                  CONFIDENTIAL
                </span>
              </div>
              <span className="text-[10px] text-[#E8E2D0]/60 block">
                DEPARTMENT OF CSE AIML · JEPPIAAR ENGINEERING COLLEGE
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3 text-xs w-full sm:w-auto justify-end">
            <button
              onClick={fetchRegistrations}
              disabled={isLoading}
              className="shape-hexagon-btn px-4 py-2 bg-[#5E3070] hover:bg-[#4A2260] border-y border-[#E2A9F0]/30 text-white flex items-center gap-2 transition-colors cursor-pointer"
            >
              <svg className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="23 4 23 10 17 10" />
                <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10" />
              </svg>
              <span>{isLoading ? 'REFRESHING...' : 'LIVE REFRESH'}</span>
            </button>

            <button
              onClick={handleCsvExport}
              className="shape-hexagon-btn px-5 py-2 bg-[#B01FD6] hover:bg-[#C46DE0] text-white font-bold shadow-[0_0_15px_rgba(176,31,214,0.4)] transition-opacity cursor-pointer flex items-center gap-2"
            >
              <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                <polyline points="7 10 12 15 17 10" />
                <line x1="12" y1="15" x2="12" y2="3" />
              </svg>
              <span>EXPORT CSV</span>
            </button>

            <a
              href="/"
              className="text-[#E8E2D0]/70 hover:text-white ml-2 text-xs transition-colors"
            >
              PUBLIC SITE ↗
            </a>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 pt-8">
        
        {/* Metric Cards Banner in Octagonal Boxes (NO rounded borders) */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
          
          {/* Large Animated Counter */}
          <div className="shape-octagon p-7 bg-[#3E1F4D]/90 border-l-4 border-l-[#E2A9F0] border-y border-r border-[#E2A9F0]/30 relative shadow-2xl sm:col-span-1">
            <span className="text-[11px] text-[#E2A9F0] tracking-widest uppercase block mb-1">
              TOTAL REGISTERED PARTICIPANTS
            </span>
            <div className="font-display text-6xl sm:text-7xl text-white tabular-numbers leading-none my-2">
              {animatedCount}
            </div>
            <div className="text-[10px] text-[#E2A9F0] uppercase tracking-wider flex items-center gap-1.5">
              <span className="w-2 h-2 rotate-45 bg-[#E2A9F0] animate-pulse" />
              <span>LIVE REGISTRATION ROSTER</span>
            </div>
          </div>

          {/* Department Breakdown Quick Insight */}
          <div className="shape-octagon p-7 bg-[#3E1F4D]/85 border-l-4 border-l-[#B01FD6] border-y border-r border-[#E2A9F0]/25 sm:col-span-2 flex flex-col justify-between">
            <div>
              <span className="text-[11px] text-[#E2A9F0] tracking-widest uppercase block mb-1">
                EVENT METRICS · WOMEN&rsquo;S DAY SPECIAL
              </span>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mt-3 text-xs">
                <div>
                  <span className="text-[#E8E2D0]/60 block text-[10px]">TOTAL DEPARTMENTS</span>
                  <span className="text-xl font-bold text-white">{uniqueDepartments.length || 1}</span>
                </div>
                <div>
                  <span className="text-[#E8E2D0]/60 block text-[10px]">LAST SYNC (IST)</span>
                  <span className="text-xl font-bold text-white">{lastRefreshedAt || 'Just now'}</span>
                </div>
                <div>
                  <span className="text-[#E8E2D0]/60 block text-[10px]">AUTO-REFRESH</span>
                  <label className="inline-flex items-center gap-2 cursor-pointer mt-1">
                    <input
                      type="checkbox"
                      checked={autoRefresh}
                      onChange={(e) => setAutoRefresh(e.target.checked)}
                      className="accent-[#B01FD6]"
                    />
                    <span className="text-xs text-white">{autoRefresh ? 'Enabled (15s)' : 'Paused'}</span>
                  </label>
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-[#E2A9F0]/15 text-[11px] text-[#E8E2D0]/70 flex items-center justify-between">
              <span>VENUE: Department of CSE AIML Labs, Jeppiaar Engineering College</span>
              <span>SPECIAL OCCASION: Happy Women&rsquo;s Day</span>
            </div>
          </div>

        </div>

        {/* Filter and Search Bar */}
        <div className="shape-octagon p-4 bg-[#3E1F4D]/80 border-l-4 border-l-[#E2A9F0] border-y border-r border-[#E2A9F0]/25 mb-6 flex flex-col md:flex-row items-center justify-between gap-4 text-xs">
          
          <div className="w-full md:w-96 relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by name, reg no, department, email..."
              className="w-full pl-9 pr-4 py-2.5 bg-[#5E3070]/60 border border-[#E2A9F0]/30 focus:border-[#E2A9F0] text-white rounded-none outline-none transition-colors"
            />
            <svg className="w-4 h-4 text-[#E2A9F0]/60 absolute left-3 top-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
          </div>

          <div className="flex items-center gap-3 w-full md:w-auto">
            <span className="text-[#E8E2D0]/70 whitespace-nowrap">Filter Dept:</span>
            <select
              value={departmentFilter}
              onChange={(e) => setDepartmentFilter(e.target.value)}
              className="bg-[#3E1F4D] border border-[#E2A9F0]/30 text-white px-3 py-2 rounded-none outline-none focus:border-[#E2A9F0] cursor-pointer"
            >
              <option value="ALL">All Departments ({registrations.length})</option>
              {uniqueDepartments.map((dept) => (
                <option key={dept} value={dept}>
                  {dept}
                </option>
              ))}
            </select>
          </div>

        </div>

        {/* Registrations Table in Octagonal Frame (NO rounded borders) */}
        <div className="shape-octagon border-l-4 border-l-[#E2A9F0] border-y border-r border-[#E2A9F0]/25 bg-[#3E1F4D]/85 shadow-2xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-[#5E3070]/80 border-b border-[#E2A9F0]/20 text-[#E2A9F0] font-semibold uppercase tracking-wider text-[11px]">
                  <th className="py-3.5 px-4"># ID</th>
                  <th className="py-3.5 px-4">Participant Name</th>
                  <th className="py-3.5 px-4">Register Number</th>
                  <th className="py-3.5 px-4">Dept &amp; Year</th>
                  <th className="py-3.5 px-4">College</th>
                  <th className="py-3.5 px-4">Email</th>
                  <th className="py-3.5 px-4">Phone</th>
                  <th className="py-3.5 px-4">Registered At (IST)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E2A9F0]/10">
                {filteredList.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="py-12 text-center text-[#E8E2D0]/60">
                      {searchQuery ? 'No participants matched the search query.' : 'No registrations received yet.'}
                    </td>
                  </tr>
                ) : (
                  filteredList.map((reg) => (
                    <tr key={reg.id} className="hover:bg-[#5E3070]/40 transition-colors">
                      <td className="py-3.5 px-4 font-bold text-[#E2A9F0] whitespace-nowrap">
                        {reg.id}
                      </td>
                      <td className="py-3.5 px-4 font-medium text-white whitespace-nowrap">
                        {reg.name}
                      </td>
                      <td className="py-3.5 px-4 text-[#E8E2D0] font-mono whitespace-nowrap">
                        {reg.registerNumber}
                      </td>
                      <td className="py-3.5 px-4 text-[#E8E2D0]/90 whitespace-nowrap">
                        {reg.department} <span className="text-[#E2A9F0]/70">({reg.year})</span>
                      </td>
                      <td className="py-3.5 px-4 text-[#E8E2D0]/80 whitespace-nowrap">
                        {reg.college}
                      </td>
                      <td className="py-3.5 px-4 text-[#E8E2D0]/90 whitespace-nowrap font-mono">
                        {reg.email}
                      </td>
                      <td className="py-3.5 px-4 text-[#E8E2D0]/90 whitespace-nowrap font-mono">
                        {reg.phone}
                      </td>
                      <td className="py-3.5 px-4 text-[#E8E2D0]/70 whitespace-nowrap">
                        {reg.registeredAtIst}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          <div className="p-3.5 bg-[#5E3070]/60 border-t border-[#E2A9F0]/15 flex items-center justify-between text-[11px] text-[#E8E2D0]/70">
            <span>Showing {filteredList.length} of {registrations.length} registered entries</span>
            <span>Wow Coding · Department of CSE AIML</span>
          </div>
        </div>

      </main>
    </div>
  );
};
