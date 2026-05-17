const STAFF_REPLY_START = '\n\n---STAFF---\n';

export function customerMessagePreview(fullMessage: string): string {
  const idx = fullMessage.indexOf(STAFF_REPLY_START);
  const body = idx === -1 ? fullMessage : fullMessage.slice(0, idx);
  return body.trim();
}

export function hasStaffReply(fullMessage: string): boolean {
  return fullMessage.includes(STAFF_REPLY_START);
}

export function statusLabel(status: string): string {
  switch (status) {
    case 'IN_PROGRESS':
      return 'In progress';
    case 'CLOSED':
      return 'Closed';
    default:
      return 'Open';
  }
}
