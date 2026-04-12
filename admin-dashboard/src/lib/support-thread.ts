/** Must match `backend/src/services/help.service.ts` markers. */
export const STAFF_REPLY_START = '\n\n---STAFF---\n';
export const STAFF_REPLY_END = '\n---ENDSTAFF---\n';

export type ApiTicketStatus = 'OPEN' | 'IN_PROGRESS' | 'CLOSED';

const CATEGORIES = [
  'Order Issue',
  'Payment',
  'Delivery',
  'Account',
  'Technical',
] as const;

function isTicketCategory(s: string): s is (typeof CATEGORIES)[number] {
  return (CATEGORIES as readonly string[]).includes(s);
}

export function parseSubjectMeta(subject: string): { category: (typeof CATEGORIES)[number]; cleanSubject: string } {
  const m = subject.match(/^\[([^\]]+)\]\s*(.*)$/s);
  if (m && isTicketCategory(m[1])) {
    return { category: m[1], cleanSubject: (m[2] || '').trim() || subject };
  }
  return { category: 'Technical', cleanSubject: subject.trim() || '(No subject)' };
}

export function parsePriorityAndBody(raw: string): { priority: 'Low' | 'Medium' | 'High' | 'Critical'; body: string } {
  const m = raw.match(/^\[P:(Low|Medium|High|Critical)\]\s*\n+([\s\S]*)$/);
  if (m) {
    return { priority: m[1] as 'Low' | 'Medium' | 'High' | 'Critical', body: m[2].trim() };
  }
  return { priority: 'Medium', body: raw.trim() };
}

export function splitCustomerFirstSegment(fullMessage: string): { first: string; rest: string } {
  const idx = fullMessage.indexOf(STAFF_REPLY_START);
  if (idx === -1) return { first: fullMessage, rest: '' };
  return { first: fullMessage.slice(0, idx), rest: fullMessage.slice(idx) };
}
