import express, { Request, Response } from 'express';
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { EVENT_CONFIG, isRegistrationActive } from './src/config/eventConfig.ts';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;
const isProd = process.env.NODE_ENV === 'production';

// Admin secret from environment secret (Dexter@003)
const ADMIN_SECRET = process.env.ADMIN_SECRET || 'Dexter@003';

app.use(express.json());

// Persistent storage setup
const DATA_DIR = path.join(__dirname, 'data');
const DATA_FILE = path.join(DATA_DIR, 'registrations.json');

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

function ensureDataFile() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
  if (!fs.existsSync(DATA_FILE)) {
    const initialSeed: Registration[] = [
      {
        id: 'WC-2026-001',
        name: 'Sneha Venkatesh',
        registerNumber: '310822104018',
        department: 'CSE AIML',
        year: '3rd Year',
        college: 'Jeppiaar Engineering College',
        email: 'sneha.v@jeppiaar.ac.in',
        phone: '9840123456',
        registeredAt: new Date(Date.now() - 3600000 * 3).toISOString(),
        registeredAtIst: new Date(Date.now() - 3600000 * 3).toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })
      },
      {
        id: 'WC-2026-002',
        name: 'Deepika Mohan',
        registerNumber: '310822104042',
        department: 'CSE',
        year: '3rd Year',
        college: 'Jeppiaar Engineering College',
        email: 'deepika.m@gmail.com',
        phone: '9444156789',
        registeredAt: new Date(Date.now() - 3600000 * 2).toISOString(),
        registeredAtIst: new Date(Date.now() - 3600000 * 2).toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })
      },
      {
        id: 'WC-2026-003',
        name: 'Ananya Swaminathan',
        registerNumber: '310823104031',
        department: 'Information Technology',
        year: '2nd Year',
        college: 'Jeppiaar Engineering College',
        email: 'ananya.swami@gmail.com',
        phone: '9789012345',
        registeredAt: new Date(Date.now() - 3600000 * 1).toISOString(),
        registeredAtIst: new Date(Date.now() - 3600000 * 1).toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })
      }
    ];
    fs.writeFileSync(DATA_FILE, JSON.stringify(initialSeed, null, 2), 'utf-8');
  }
}

function getRegistrations(): Registration[] {
  ensureDataFile();
  try {
    const raw = fs.readFileSync(DATA_FILE, 'utf-8');
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

function saveRegistrations(data: Registration[]) {
  ensureDataFile();
  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2), 'utf-8');
}

// 1. API: Event Status & Cut-off
app.get('/api/event-status', (_req: Request, res: Response) => {
  const status = isRegistrationActive();
  res.json({
    isOpen: status.isOpen,
    reason: status.reason || null,
    cutOffMs: status.cutOffMs,
    eventStartMs: status.eventStartMs,
    timeRemainingMs: status.timeRemainingMs,
    eventDate: EVENT_CONFIG.eventDate,
    startTime: EVENT_CONFIG.startTime,
    endTime: EVENT_CONFIG.endTime,
    venueName: EVENT_CONFIG.venueName,
    serverTime: new Date().toISOString(),
    serverTimeIst: new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })
  });
});

// 2. API: Register
app.post('/api/register', (req: Request, res: Response): void => {
  const status = isRegistrationActive();
  if (!status.isOpen) {
    res.status(403).json({
      error: status.reason || 'Registration is currently closed.'
    });
    return;
  }

  const { name, registerNumber, department, year, college, email, phone } = req.body || {};

  // Validations
  if (!name || typeof name !== 'string' || name.trim().length < 2) {
    res.status(400).json({ error: 'Please enter a valid full name (minimum 2 characters).' });
    return;
  }
  if (!registerNumber || typeof registerNumber !== 'string' || registerNumber.trim().length < 4) {
    res.status(400).json({ error: 'Please enter a valid college register number.' });
    return;
  }
  if (!department || typeof department !== 'string' || department.trim().length < 2) {
    res.status(400).json({ error: 'Department is required.' });
    return;
  }
  if (!year || typeof year !== 'string') {
    res.status(400).json({ error: 'Year of study is required.' });
    return;
  }
  if (!college || typeof college !== 'string' || college.trim().length < 2) {
    res.status(400).json({ error: 'College name is required.' });
    return;
  }
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email || !emailRegex.test(email.trim())) {
    res.status(400).json({ error: 'Please enter a valid email address.' });
    return;
  }
  const cleanPhone = (phone || '').toString().replace(/[^0-9]/g, '');
  if (cleanPhone.length < 10) {
    res.status(400).json({ error: 'Please enter a valid 10-digit mobile number.' });
    return;
  }

  const trimmedReg = registerNumber.trim().toUpperCase();
  const trimmedEmail = email.trim().toLowerCase();

  const registrations = getRegistrations();

  // Duplicate checks
  const existingReg = registrations.find(r => r.registerNumber.toUpperCase() === trimmedReg);
  if (existingReg) {
    res.status(409).json({
      error: `Register number ${trimmedReg} is already registered for Wow Coding.`
    });
    return;
  }

  const existingEmail = registrations.find(r => r.email.toLowerCase() === trimmedEmail);
  if (existingEmail) {
    res.status(409).json({
      error: `Email address ${trimmedEmail} is already registered.`
    });
    return;
  }

  const newReg: Registration = {
    id: `WC-2026-${String(registrations.length + 1).padStart(3, '0')}`,
    name: name.trim(),
    registerNumber: trimmedReg,
    department: department.trim(),
    year: year.trim(),
    college: college.trim(),
    email: trimmedEmail,
    phone: cleanPhone,
    registeredAt: new Date().toISOString(),
    registeredAtIst: new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })
  };

  registrations.push(newReg);
  saveRegistrations(registrations);

  res.status(201).json({
    success: true,
    message: 'Registration successful! Star allocated.',
    registration: newReg
  });
});

// Helper to authenticate admin token
function verifyAdminToken(req: Request): boolean {
  const authHeader = req.headers.authorization;
  const token = authHeader?.startsWith('Bearer ')
    ? authHeader.substring(7).trim()
    : (req.query.token as string || req.body?.token as string);

  return token === ADMIN_SECRET;
}

// 3. Admin Verification (Returns 404 on invalid password to hide existence)
app.post('/api/admin/verify', (req: Request, res: Response): void => {
  const token = req.body?.token;
  if (token === ADMIN_SECRET) {
    res.json({ success: true });
    return;
  }
  // Masquerade as normal 404
  res.status(404).json({ error: 'Not Found' });
});

// 4. Admin Registrations List
app.get('/api/admin/registrations', (req: Request, res: Response): void => {
  if (!verifyAdminToken(req)) {
    res.status(404).json({ error: 'Not Found' });
    return;
  }

  const registrations = getRegistrations();
  res.json({
    total: registrations.length,
    registrations: registrations.reverse()
  });
});

// 5. Admin CSV Export
app.get('/api/admin/export.csv', (req: Request, res: Response): void => {
  if (!verifyAdminToken(req)) {
    res.status(404).send('Not Found');
    return;
  }

  const registrations = getRegistrations();
  const headers = [
    'Registration ID',
    'Name',
    'Register Number',
    'Department',
    'Year',
    'College',
    'Email',
    'Phone',
    'Registered Time (IST)'
  ];

  const escapeCsv = (val: string) => `"${(val || '').replace(/"/g, '""')}"`;

  const rows = registrations.map(r => [
    escapeCsv(r.id),
    escapeCsv(r.name),
    escapeCsv(r.registerNumber),
    escapeCsv(r.department),
    escapeCsv(r.year),
    escapeCsv(r.college),
    escapeCsv(r.email),
    escapeCsv(r.phone),
    escapeCsv(r.registeredAtIst)
  ].join(','));

  const csvContent = [headers.join(','), ...rows].join('\n');

  res.setHeader('Content-Type', 'text/csv');
  res.setHeader('Content-Disposition', 'attachment; filename="wow-coding-registrations.csv"');
  res.send(csvContent);
});

// Setup Vite in Dev or Static in Production
async function startServer() {
  if (!isProd) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa'
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(__dirname, 'dist')));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.join(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
