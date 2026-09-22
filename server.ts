import express, { Request, Response } from 'express';
import path from 'path';
import cors from 'cors';
import { createServer as createViteServer } from 'vite';
import { db } from './server/db';
import { fetchVenueMeetingsFromRCResults, parseOrGenerateMeetingResults } from './server/rcResultsImporter';

const PORT = 3000;

async function startServer() {
  const app = express();

  app.use(cors());
  app.use(express.json());

  // --- API Routes ---

  // Health check
  app.get('/api/health', (req: Request, res: Response) => {
    res.json({ status: 'ok', club: 'North West Nitro RC Club', time: new Date().toISOString() });
  });

  // Settings
  app.get('/api/settings', (req: Request, res: Response) => {
    res.json(db.getSettings());
  });

  app.put('/api/settings', (req: Request, res: Response) => {
    const updated = db.updateSettings(req.body);
    res.json(updated);
  });

  // Events
  app.get('/api/events', (req: Request, res: Response) => {
    const events = db.getEvents();
    res.json(events);
  });

  app.get('/api/events/:id', (req: Request, res: Response) => {
    const event = db.getEventById(req.params.id);
    if (!event) {
      return res.status(404).json({ error: 'Event not found' });
    }
    res.json(event);
  });

  app.post('/api/events', (req: Request, res: Response) => {
    try {
      const { title, series, date, gatesOpen, bookingCloses, driversBriefing, racingStarts, location, classes, standardFee, memberFee, maxEntries, description, cashAccepted, onlineAccepted } = req.body;
      if (!title || !date || !series) {
        return res.status(400).json({ error: 'Title, date, and series are required' });
      }
      const newEvent = db.addEvent({
        title,
        series,
        date,
        gatesOpen: gatesOpen || '07:30',
        bookingCloses: bookingCloses || '08:30',
        driversBriefing: driversBriefing || '08:45',
        racingStarts: racingStarts || '09:00',
        location: location || 'North West Nitro Track, Mythop Rd, Blackpool FY4 4XN',
        classes: classes || ['1/8 Nitro Buggy', '1/8 E-Buggy', '1/8 Truggy'],
        standardFee: Number(standardFee) || 15,
        memberFee: Number(memberFee) || 10,
        maxEntries: Number(maxEntries) || 90,
        status: 'open',
        description: description || '',
        cashAccepted: cashAccepted !== undefined ? cashAccepted : true,
        onlineAccepted: onlineAccepted !== undefined ? onlineAccepted : false,
      });
      res.status(201).json(newEvent);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.put('/api/events/:id', (req: Request, res: Response) => {
    const updated = db.updateEvent(req.params.id, req.body);
    if (!updated) {
      return res.status(404).json({ error: 'Event not found' });
    }
    res.json(updated);
  });

  app.delete('/api/events/:id', (req: Request, res: Response) => {
    const deleted = db.deleteEvent(req.params.id);
    if (!deleted) {
      return res.status(404).json({ error: 'Event not found' });
    }
    res.json({ success: true });
  });

  // Entries for an event
  app.get('/api/events/:id/entries', (req: Request, res: Response) => {
    const entries = db.getEntries(req.params.id);
    res.json(entries);
  });

  app.post('/api/events/:id/entries', (req: Request, res: Response) => {
    try {
      const { driverName, email, phone, brcaNumber, transponderNumber, carClass, paymentMethod, membershipNumber, notes } = req.body;
      if (!driverName || !email || !brcaNumber || !carClass) {
        return res.status(400).json({ error: 'Driver name, email, BRCA number, and car class are required' });
      }
      const entry = db.addEntry({
        eventId: req.params.id,
        driverName,
        email,
        phone: phone || '',
        brcaNumber,
        transponderNumber: transponderNumber || 'TBA',
        carClass,
        isMember: false,
        membershipNumber,
        feeCharged: 15, // Calculated by db based on membership
        paymentMethod: paymentMethod === 'online' ? 'online' : 'cash',
        paymentStatus: paymentMethod === 'online' ? 'paid' : 'pending',
        notes,
      });
      res.status(201).json(entry);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.patch('/api/events/:id/entries/:entryId', (req: Request, res: Response) => {
    const { paymentStatus } = req.body;
    const updated = db.updateEntryStatus(req.params.entryId, paymentStatus);
    if (!updated) {
      return res.status(404).json({ error: 'Entry not found' });
    }
    res.json(updated);
  });

  // Members
  app.get('/api/members', (req: Request, res: Response) => {
    const members = db.getMembers();
    res.json(members);
  });

  app.post('/api/members/register', (req: Request, res: Response) => {
    try {
      const { fullName, email, phone, address, postcode, emergencyContactName, emergencyContactPhone, brcaNumber, primaryClass, membershipType, notes } = req.body;
      if (!fullName || !email || !phone || !postcode || !brcaNumber) {
        return res.status(400).json({ error: 'Full name, email, phone, postcode, and BRCA number are required' });
      }
      const newMember = db.addMember({
        fullName,
        email,
        phone,
        address: address || '',
        postcode,
        emergencyContactName: emergencyContactName || '',
        emergencyContactPhone: emergencyContactPhone || '',
        brcaNumber,
        primaryClass: primaryClass || '1/8 Nitro Buggy',
        membershipType: membershipType || 'Adult',
        notes,
      });
      res.status(201).json(newMember);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.patch('/api/members/:id/assign-number', (req: Request, res: Response) => {
    const { membershipNumber, status } = req.body;
    if (!membershipNumber) {
      return res.status(400).json({ error: 'Membership number is required' });
    }
    const updated = db.assignMembershipNumber(req.params.id, membershipNumber, status || 'active');
    if (!updated) {
      return res.status(404).json({ error: 'Member not found' });
    }
    res.json(updated);
  });

  app.patch('/api/members/:id', (req: Request, res: Response) => {
    const updated = db.updateMember(req.params.id, req.body);
    if (!updated) {
      return res.status(404).json({ error: 'Member not found' });
    }
    res.json(updated);
  });

  app.post('/api/members/verify', (req: Request, res: Response) => {
    const { emailOrNumber } = req.body;
    if (!emailOrNumber) {
      return res.status(400).json({ error: 'Email or membership number is required' });
    }
    const member = db.verifyMember({ emailOrNumber });
    if (!member) {
      return res.status(404).json({ valid: false, message: 'No active membership found with those details' });
    }
    res.json({ valid: true, member });
  });

  // RC-Results
  app.get('/api/results', (req: Request, res: Response) => {
    const results = db.getResults();
    res.json(results);
  });

  app.get('/api/results/recent', (req: Request, res: Response) => {
    const count = parseInt(req.query.count as string) || 3;
    const recent = db.getRecentResults(count);
    res.json(recent);
  });

  app.get('/api/results/:id', (req: Request, res: Response) => {
    const result = db.getResultById(req.params.id);
    if (!result) {
      return res.status(404).json({ error: 'Result not found' });
    }
    res.json(result);
  });

  // Query venue 34 from RC-Results
  app.get('/api/results-import/venue-meetings', async (req: Request, res: Response) => {
    const venueId = parseInt(req.query.venueId as string) || 34;
    const data = await fetchVenueMeetingsFromRCResults(venueId);
    res.json(data);
  });

  app.post('/api/results/import', (req: Request, res: Response) => {
    try {
      const { meetingName, date, sourceUrl, customData } = req.body;
      if (customData) {
        const saved = db.importResult(customData);
        return res.status(201).json(saved);
      }
      if (!meetingName) {
        return res.status(400).json({ error: 'Meeting name is required' });
      }
      const generated = parseOrGenerateMeetingResults(
        meetingName,
        date || new Date().toISOString().split('T')[0],
        sourceUrl
      );
      const saved = db.importResult(generated);
      res.status(201).json(saved);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // Netlify / Supabase / Backup export
  app.get('/api/database/export', (req: Request, res: Response) => {
    res.json(db.exportData());
  });

  // --- Vite & Static Asset Handling ---
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req: Request, res: Response) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`North West Nitro Server listening on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Fatal error starting server:', err);
});
