const API_BASE = '/api/calendar/events';

export async function fetchEvents({ start, end, event_type } = {}) {
  const params = new URLSearchParams();
  if (start) params.append('start', start);
  if (end) params.append('end', end);
  if (event_type) params.append('event_type', event_type);
  const res = await fetch(`${API_BASE}?${params.toString()}`, {
    credentials: 'include',
  });
  if (!res.ok) throw new Error('Failed to fetch events');
  const data = await res.json();
  return data.events;
}

export async function createEvent(event) {
  const res = await fetch(API_BASE, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify(event),
  });
  if (!res.ok) throw new Error('Failed to create event');
  const data = await res.json();
  return data.event;
}

export async function updateEvent(id, event) {
  const res = await fetch(`${API_BASE}/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify(event),
  });
  if (!res.ok) throw new Error('Failed to update event');
  const data = await res.json();
  return data.event;
}

export async function deleteEvent(id) {
  const res = await fetch(`${API_BASE}/${id}`, {
    method: 'DELETE',
    credentials: 'include',
  });
  if (!res.ok) throw new Error('Failed to delete event');
  return true;
} 