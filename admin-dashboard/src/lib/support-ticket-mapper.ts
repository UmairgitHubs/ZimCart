import type { SupportTicket, SupportTicketDto, TicketMessage, TicketStatus } from '@/types/support';
import {
  STAFF_REPLY_END,
  STAFF_REPLY_START,
  parsePriorityAndBody,
  parseSubjectMeta,
  splitCustomerFirstSegment,
  type ApiTicketStatus,
} from '@/lib/support-thread';

function mapApiStatus(s: ApiTicketStatus): TicketStatus {
  if (s === 'OPEN') return 'Open';
  if (s === 'IN_PROGRESS') return 'In Progress';
  return 'Closed';
}

function parseMessagesFromBody(
  fullMessage: string,
  customerName: string,
  createdAt: string,
  updatedAt: string
): TicketMessage[] {
  const msgs: TicketMessage[] = [];
  const { first, rest } = splitCustomerFirstSegment(fullMessage);
  const { body } = parsePriorityAndBody(first);
  if (body) {
    msgs.push({
      id: 'c-0',
      sender: 'Customer',
      senderName: customerName,
      content: body,
      timestamp: createdAt,
    });
  }
  if (!rest) return msgs;

  let tail = rest;
  let ai = 0;
  while (tail.startsWith(STAFF_REPLY_START)) {
    tail = tail.slice(STAFF_REPLY_START.length);
    const end = tail.indexOf(STAFF_REPLY_END);
    const text = (end >= 0 ? tail.slice(0, end) : tail).trim();
    if (text) {
      msgs.push({
        id: `a-${ai}`,
        sender: 'Agent',
        senderName: 'Support',
        content: text,
        timestamp: updatedAt,
      });
      ai += 1;
    }
    tail = end >= 0 ? tail.slice(end + STAFF_REPLY_END.length) : '';
  }
  return msgs;
}

export function supportTicketDtoToView(dto: SupportTicketDto): SupportTicket {
  const { category, cleanSubject } = parseSubjectMeta(dto.subject);
  const { first } = splitCustomerFirstSegment(dto.message);
  const { priority } = parsePriorityAndBody(first);
  const messages = parseMessagesFromBody(dto.message, dto.user.name, dto.createdAt, dto.updatedAt);

  return {
    id: dto.id,
    customerId: dto.userId,
    customerName: dto.user.name,
    customerEmail: dto.user.email,
    customerPhone: dto.user.phone,
    subject: cleanSubject,
    category,
    status: mapApiStatus(dto.status),
    priority,
    assignedAgent: undefined,
    createdAt: dto.createdAt,
    updatedAt: dto.updatedAt,
    messages: messages.length ? messages : [],
  };
}

export function uiStatusToApi(status: TicketStatus): ApiTicketStatus {
  if (status === 'Open') return 'OPEN';
  if (status === 'In Progress') return 'IN_PROGRESS';
  return 'CLOSED';
}
