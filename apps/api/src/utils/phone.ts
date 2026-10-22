
/**
 * Normalize supported Ethiopian phone number formats to +251XXXXXXXXX.
 * Supports local 09XXXXXXXX / 07XXXXXXXX and international formats.
 */
export function normalizeEthiopianPhone(phone: string): string {
  const cleaned = phone.trim().replace(/[\s()-]/g, '');

  let normalized: string;

  if (/^0[79]\d{8}$/.test(cleaned)) {
    normalized = `+251${cleaned.slice(1)}`;
  } else if (/^251[79]\d{8}$/.test(cleaned)) {
    normalized = `+${cleaned}`;
  } else if (/^\+251[79]\d{8}$/.test(cleaned)) {
    normalized = cleaned;
  } else {
    throw new Error('Invalid Ethiopian phone number format.');
  }

  return normalized;
}

export function isValidEthiopianPhone(phone: string): boolean {
  try {
    normalizeEthiopianPhone(phone);
    return true;
  } catch {
    return false;
  }
}
