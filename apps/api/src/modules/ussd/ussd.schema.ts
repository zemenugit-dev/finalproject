
export type UssdLanguage = 'en' | 'am';

export interface UssdRequest {
  sessionId: string;
  phoneNumber: string;
  text: string;
  language?: UssdLanguage;
}

export interface UssdSessionData {
  providerSessionId: string;
  language: UssdLanguage;
  step: 'main' | 'markets' | 'products' | 'language';
  marketId: string | null;
}

export interface UssdSessionRow {
  session_id: string;
  phone_number: string;
  session_data: string;
  created_at: Date | string;
}

export function validateUssdRequest(
  body: unknown
): UssdRequest | null {
  if (!body || typeof body !== 'object') {
    return null;
  }

  const value = body as Record<string, unknown>;

  if (
    typeof value.sessionId !== 'string' ||
    value.sessionId.trim().length === 0 ||
    value.sessionId.length > 100
  ) {
    return null;
  }

  if (
    typeof value.phoneNumber !== 'string' ||
    !/^\+?[0-9]{9,15}$/.test(value.phoneNumber.trim())
  ) {
    return null;
  }

  if (
    value.text !== undefined &&
    typeof value.text !== 'string'
  ) {
    return null;
  }

  if (
    value.language !== undefined &&
    value.language !== 'en' &&
    value.language !== 'am'
  ) {
    return null;
  }

  return {
    sessionId: value.sessionId.trim(),
    phoneNumber: value.phoneNumber.trim(),
    text: typeof value.text === 'string'
      ? value.text.trim()
      : '',
    language: value.language as UssdLanguage | undefined
  };
}
