import type { Handler, HandlerEvent, HandlerContext } from '@netlify/functions';
import { netlifyBlobDb } from '../../server/netlifyBlobDb';
import { parseOrGenerateMeetingResults } from '../../server/rcResultsImporter';

export const handler: Handler = async (event: HandlerEvent, context: HandlerContext) => {
  const path = event.path.replace(/^\/\.netlify\/functions\/api/, '').replace(/^\/api/, '');
  const method = event.httpMethod;

  const headers = {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, PATCH, DELETE, OPTIONS',
  };

  if (method === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' };
  }

  try {
    const body = event.body ? JSON.parse(event.body) : {};

    // Events routes
    if (path === '/events' && method === 'GET') {
      const events = await netlifyBlobDb.getEvents();
      return { statusCode: 200, headers, body: JSON.stringify(events) };
    }

    if (path.startsWith('/events/') && path.endsWith('/entries') && method === 'GET') {
      const parts = path.split('/');
      const eventId = parts[2];
      const entries = await netlifyBlobDb.getEntries(eventId);
      return { statusCode: 200, headers, body: JSON.stringify(entries) };
    }

    if (path.startsWith('/events/') && path.endsWith('/entries') && method === 'POST') {
      const parts = path.split('/');
      const eventId = parts[2];
      const entry = await netlifyBlobDb.addEntry({ ...body, eventId });
      return { statusCode: 201, headers, body: JSON.stringify(entry) };
    }

    if (path.startsWith('/events/') && method === 'PATCH') {
      const id = path.split('/')[2];
      const updated = await netlifyBlobDb.updateEvent(id, body);
      return { statusCode: 200, headers, body: JSON.stringify(updated) };
    }

    if (path.startsWith('/events/') && method === 'DELETE') {
      const id = path.split('/')[2];
      const deleted = await netlifyBlobDb.deleteEvent(id);
      return { statusCode: 200, headers, body: JSON.stringify({ success: deleted }) };
    }

    if (path === '/events' && method === 'POST') {
      const newEvent = await netlifyBlobDb.addEvent(body);
      return { statusCode: 201, headers, body: JSON.stringify(newEvent) };
    }

    // Members routes
    if (path === '/members' && method === 'GET') {
      const members = await netlifyBlobDb.getMembers();
      return { statusCode: 200, headers, body: JSON.stringify(members) };
    }

    if (path === '/members/register' && method === 'POST') {
      const member = await netlifyBlobDb.addMember(body);
      return { statusCode: 201, headers, body: JSON.stringify(member) };
    }

    if (path.startsWith('/members/') && path.endsWith('/assign-number') && method === 'PATCH') {
      const id = path.split('/')[2];
      const updated = await netlifyBlobDb.assignMembershipNumber(id, body.membershipNumber, body.status);
      return { statusCode: 200, headers, body: JSON.stringify(updated) };
    }

    if (path.startsWith('/members/') && method === 'PATCH') {
      const id = path.split('/')[2];
      const updated = await netlifyBlobDb.updateMember(id, body);
      return { statusCode: 200, headers, body: JSON.stringify(updated) };
    }

    if (path === '/members/verify' && method === 'POST') {
      const member = await netlifyBlobDb.verifyMember(body);
      if (!member) {
        return { statusCode: 404, headers, body: JSON.stringify({ valid: false }) };
      }
      return { statusCode: 200, headers, body: JSON.stringify({ valid: true, member }) };
    }

    // Results routes
    if (path === '/results' && method === 'GET') {
      const results = await netlifyBlobDb.getResults();
      return { statusCode: 200, headers, body: JSON.stringify(results) };
    }

    if (path === '/results/recent' && method === 'GET') {
      const recent = await netlifyBlobDb.getRecentResults(3);
      return { statusCode: 200, headers, body: JSON.stringify(recent) };
    }

    if (path === '/results/import' && method === 'POST') {
      const resultData = body.customData || parseOrGenerateMeetingResults(body.meetingName, body.date, body.sourceUrl);
      const saved = await netlifyBlobDb.importResult(resultData);
      return { statusCode: 201, headers, body: JSON.stringify(saved) };
    }

    // Settings routes
    if (path === '/settings' && method === 'GET') {
      const settings = await netlifyBlobDb.getSettings();
      return { statusCode: 200, headers, body: JSON.stringify(settings) };
    }

    if (path === '/settings' && method === 'PUT') {
      const updated = await netlifyBlobDb.updateSettings(body);
      return { statusCode: 200, headers, body: JSON.stringify(updated) };
    }

    // Database export (1-click backup)
    if (path === '/database/export' && method === 'GET') {
      const data = await netlifyBlobDb.exportData();
      return { statusCode: 200, headers, body: JSON.stringify(data) };
    }

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ status: 'ok', storage: 'netlify-blobs' }),
    };
  } catch (err: any) {
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: err.message }),
    };
  }
};
