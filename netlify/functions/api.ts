import type { Handler, HandlerEvent, HandlerContext } from '@netlify/functions';
import { db } from '../../server/db';
import { parseOrGenerateMeetingResults } from '../../server/rcResultsImporter';

export const handler: Handler = async (event: HandlerEvent, context: HandlerContext) => {
  const path = event.path.replace(/^\/\.netlify\/functions\/api/, '').replace(/^\/api/, '');
  const method = event.httpMethod;

  const headers = {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, PATCH, DELETE, OPTIONS',
  };

  if (method === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' };
  }

  try {
    const body = event.body ? JSON.parse(event.body) : {};

    // Routes
    if (path === '/events' && method === 'GET') {
      return { statusCode: 200, headers, body: JSON.stringify(db.getEvents()) };
    }

    if (path.startsWith('/events/') && path.endsWith('/entries') && method === 'GET') {
      const parts = path.split('/');
      const eventId = parts[2];
      return { statusCode: 200, headers, body: JSON.stringify(db.getEntries(eventId)) };
    }

    if (path.startsWith('/events/') && path.endsWith('/entries') && method === 'POST') {
      const parts = path.split('/');
      const eventId = parts[2];
      const entry = db.addEntry({ ...body, eventId });
      return { statusCode: 201, headers, body: JSON.stringify(entry) };
    }

    if (path === '/events' && method === 'POST') {
      const newEvent = db.addEvent(body);
      return { statusCode: 201, headers, body: JSON.stringify(newEvent) };
    }

    if (path === '/members' && method === 'GET') {
      return { statusCode: 200, headers, body: JSON.stringify(db.getMembers()) };
    }

    if (path === '/members/register' && method === 'POST') {
      const member = db.addMember(body);
      return { statusCode: 201, headers, body: JSON.stringify(member) };
    }

    if (path.startsWith('/members/') && path.endsWith('/assign-number') && method === 'PATCH') {
      const id = path.split('/')[2];
      const updated = db.assignMembershipNumber(id, body.membershipNumber, body.status);
      return { statusCode: 200, headers, body: JSON.stringify(updated) };
    }

    if (path === '/members/verify' && method === 'POST') {
      const member = db.verifyMember(body);
      if (!member) {
        return { statusCode: 404, headers, body: JSON.stringify({ valid: false }) };
      }
      return { statusCode: 200, headers, body: JSON.stringify({ valid: true, member }) };
    }

    if (path === '/results' && method === 'GET') {
      return { statusCode: 200, headers, body: JSON.stringify(db.getResults()) };
    }

    if (path === '/results/recent' && method === 'GET') {
      return { statusCode: 200, headers, body: JSON.stringify(db.getRecentResults(3)) };
    }

    if (path === '/results/import' && method === 'POST') {
      const saved = db.importResult(
        body.customData || parseOrGenerateMeetingResults(body.meetingName, body.date, body.sourceUrl)
      );
      return { statusCode: 201, headers, body: JSON.stringify(saved) };
    }

    if (path === '/settings' && method === 'GET') {
      return { statusCode: 200, headers, body: JSON.stringify(db.getSettings()) };
    }

    if (path === '/settings' && method === 'PUT') {
      return { statusCode: 200, headers, body: JSON.stringify(db.updateSettings(body)) };
    }

    if (path === '/database/export' && method === 'GET') {
      return { statusCode: 200, headers, body: JSON.stringify(db.exportData()) };
    }

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ status: 'ok', serverless: true }),
    };
  } catch (err: any) {
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: err.message }),
    };
  }
};
