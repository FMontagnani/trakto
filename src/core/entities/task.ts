import crypto from 'node:crypto';

export function generateTaskId(): string {
  return crypto.randomUUID();
}

export default {
  generateTaskId
}
