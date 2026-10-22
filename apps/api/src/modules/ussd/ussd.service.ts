
import {
  UssdLanguage,
  UssdRequest,
  UssdSessionData,
  UssdSessionRow
} from './ussd.schema';

import { UssdRepository } from './ussd.repository';

const SESSION_TIMEOUT_MS = 5 * 60 * 1000;

export class UssdService {
  private repository = new UssdRepository();

  private message(
    _language: UssdLanguage,
    step: string,
    body: string
  ): string {
    return `${step} ${body}`;
  }

  /**
   * Reads English or Amharic text from the translation table.
   * Uses the fallback when a translation is missing.
   */
  private async t(
    key: string,
    language: UssdLanguage,
    fallback: string
  ): Promise<string> {
    const translated = await this.repository.getTranslation(
      key,
      language
    );

    return translated?.trim() || fallback;
  }

  private async mainMenu(
    language: UssdLanguage
  ): Promise<string> {
    const welcome = await this.t(
      'welcome',
      language,
      'Welcome to SASM-IS'
    );

    const changeLanguage = await this.t(
      'change_language',
      language,
      'Change language'
    );

    const marketPrices = await this.t(
      'market_prices',
      language,
      'Market prices'
    );

    const exit = await this.t(
      'exit',
      language,
      'Exit'
    );

    return [
      welcome,
      `0. ${changeLanguage}`,
      `1. ${marketPrices}`,
      `9. ${exit}`
    ].join('\n');
  }

  private async languageMenu(
    language: UssdLanguage
  ): Promise<string> {
    const prompt = await this.t(
      'select_language',
      language,
      'Select your language'
    );

    if (language === 'am') {
      return [
        `${prompt}:`,
        '1. English',
        '2. አማርኛ',
        '0. ተመለስ'
      ].join('\n');
    }

    return [
      `${prompt}:`,
      '1. English',
      '2. Amharic (አማርኛ)',
      '0. Back'
    ].join('\n');
  }

  private async invalidChoice(
    language: UssdLanguage
  ): Promise<string> {
    return this.t(
      'invalid_choice',
      language,
      'Invalid choice. Please try again.'
    );
  }

  private parseSession(
    row: UssdSessionRow
  ): UssdSessionData | null {
    try {
      const parsed = JSON.parse(
        row.session_data
      ) as UssdSessionData;

      if (
        !parsed ||
        typeof parsed.providerSessionId !== 'string' ||
        !['en', 'am'].includes(parsed.language) ||
        !['main', 'markets', 'products', 'language'].includes(
          parsed.step
        )
      ) {
        return null;
      }

      return parsed;
    } catch {
      return null;
    }
  }

  private isExpired(row: UssdSessionRow): boolean {
    const lastActivity = new Date(row.created_at).getTime();

    return (
      !Number.isFinite(lastActivity) ||
      Date.now() - lastActivity > SESSION_TIMEOUT_MS
    );
  }

  private async saveSession(
    row: UssdSessionRow,
    data: UssdSessionData
  ): Promise<void> {
    await this.repository.updateSession(
      row.session_id,
      data
    );
  }

  async handle(request: UssdRequest): Promise<string> {
    const latest = await this.repository.findLatestSession(
      request.phoneNumber
    );

    let row: UssdSessionRow | null = latest;

    let data: UssdSessionData | null = latest
      ? this.parseSession(latest)
      : null;

    const isNewSession =
      !row ||
      !data ||
      this.isExpired(row) ||
      data.providerSessionId !== request.sessionId;

    if (isNewSession) {
      data = {
        providerSessionId: request.sessionId,
        language: request.language ?? 'en',
        step: 'main',
        marketId: null
      };

      row = await this.repository.createSession(
        request.phoneNumber,
        data
      );

      if (request.text === '') {
        return this.message(
          data.language,
          'CON',
          await this.mainMenu(data.language)
        );
      }
    }

    if (!row || !data) {
      throw new Error('Unable to initialize USSD session');
    }

    const input =
      request.text.split('*').pop()?.trim() ?? '';

    if (request.language) {
      data.language = request.language;
    }

    // Handle English and Amharic language selection.
    if (data.step === 'language') {
      if (input === '0') {
        data.step = 'main';

        await this.saveSession(row, data);

        return this.message(
          data.language,
          'CON',
          await this.mainMenu(data.language)
        );
      }

      const selectedLanguage: UssdLanguage | null =
        input === '1'
          ? 'en'
          : input === '2'
            ? 'am'
            : null;

      if (!selectedLanguage) {
        await this.saveSession(row, data);

        return this.message(
          data.language,
          'CON',
          `${await this.invalidChoice(data.language)}\n${await this.languageMenu(data.language)}`
        );
      }

      data.language = selectedLanguage;
      data.step = 'main';
      data.marketId = null;

      await this.saveSession(row, data);

      const confirmation =
        selectedLanguage === 'am'
          ? 'ቋንቋው ተቀይሯል።'
          : 'Language changed to English.';

      return this.message(
        data.language,
        'CON',
        `${confirmation}\n${await this.mainMenu(data.language)}`
      );
    }

    const language = data.language;

    // Open language selection.
    if (data.step === 'main' && input === '0') {
      data.step = 'language';

      await this.saveSession(row, data);

      return this.message(
        language,
        'CON',
        await this.languageMenu(language)
      );
    }

    // Exit from the main, market, or product menu.
    if (
      (data.step === 'main' && input === '9') ||
      (
        (data.step === 'markets' || data.step === 'products') &&
        input === '0'
      )
    ) {
      const thankYou =
        language === 'am'
          ? 'ስለ SASM-IS አጠቃቀምዎ እናመሰግናለን።'
          : 'Thank you for using SASM-IS.';

      return this.message(language, 'END', thankYou);
    }

    // Main menu.
    if (data.step === 'main') {
      if (input === '') {
        await this.saveSession(row, data);

        return this.message(
          language,
          'CON',
          await this.mainMenu(language)
        );
      }

      if (input === '1') {
        data.step = 'markets';

        await this.saveSession(row, data);

        const markets = await this.repository.getMarkets();

        if (markets.length === 0) {
          data.step = 'main';

          await this.saveSession(row, data);

          return this.message(
            language,
            'END',
            language === 'am'
              ? 'ምንም ገበያ አልተገኘም።'
              : 'No markets are available.'
          );
        }

        const list = markets
          .map(
            (market, index) =>
              `${index + 1}. ${market.market_name} (${market.region_name})`
          )
          .join('\n');

        const prompt = await this.t(
          'select_market',
          language,
          'Select a market'
        );

        const exit = await this.t(
          'exit',
          language,
          'Exit'
        );

        return this.message(
          language,
          'CON',
          `${prompt}:\n${list}\n0. ${exit}`
        );
      }

      await this.saveSession(row, data);

      return this.message(
        language,
        'CON',
        `${await this.invalidChoice(language)}\n${await this.mainMenu(language)}`
      );
    }

    // Market selection.
    if (data.step === 'markets') {
      const markets = await this.repository.getMarkets();
      const index = Number(input) - 1;

      if (
        !Number.isInteger(index) ||
        index < 0 ||
        index >= markets.length
      ) {
        await this.saveSession(row, data);

        return this.message(
          language,
          'CON',
          language === 'am'
            ? 'የገበያ ምርጫ ልክ አይደለም። እንደገና ይምረጡ።'
            : 'Invalid market selection. Please try again.'
        );
      }

      data.marketId = markets[index].market_id;
      data.step = 'products';

      await this.saveSession(row, data);

      const products = await this.repository.getProductsForMarket(
        data.marketId
      );

      if (products.length === 0) {
        data.step = 'main';
        data.marketId = null;

        await this.saveSession(row, data);

        return this.message(
          language,
          'END',
          language === 'am'
            ? 'ምንም ምርት አልተገኘም።'
            : 'No products are available.'
        );
      }

      const list = products
        .map(
          (product, index) =>
            `${index + 1}. ${product.name}`
        )
        .join('\n');

      const prompt = await this.t(
        'select_product',
        language,
        'Select a product'
      );

      const exit = await this.t(
        'exit',
        language,
        'Exit'
      );

      return this.message(
        language,
        'CON',
        `${prompt}:\n${list}\n0. ${exit}`
      );
    }

    // Product selection and price lookup.
    if (data.step === 'products') {
      if (!data.marketId) {
        data.step = 'main';

        await this.saveSession(row, data);

        return this.message(
          language,
          'CON',
          await this.mainMenu(language)
        );
      }

      const products = await this.repository.getProductsForMarket(
        data.marketId
      );

      const index = Number(input) - 1;

      if (
        !Number.isInteger(index) ||
        index < 0 ||
        index >= products.length
      ) {
        await this.saveSession(row, data);

        return this.message(
          language,
          'CON',
          language === 'am'
            ? 'የምርት ምርጫ ልክ አይደለም። እንደገና ይምረጡ።'
            : 'Invalid product selection. Please try again.'
        );
      }

      const product = products[index];

      const price = await this.repository.getProductPrice(
        product.product_id,
        data.marketId
      );

      data.step = 'main';
      data.marketId = null;

      await this.saveSession(row, data);

      if (!price || price.current_price === null) {
        return this.message(
          language,
          'END',
          await this.t(
            'no_price',
            language,
            'No price is available for this product.'
          )
        );
      }

      const priceLabel = await this.t(
        'price',
        language,
        'Price'
      );

      const priceText =
        language === 'am'
          ? `${priceLabel}: ${price.name} — ${price.current_price} ብር / ${price.unit}`
          : `${priceLabel}: ${price.name} — ${price.current_price} ETB per ${price.unit}`;

      const sourceText = price.updated_at
        ? ''
        : language === 'am'
          ? '\nማስታወሻ: ይህ የመደበኛ ምርት ዋጋ ነው፣ የገበያ ዋጋ አይደለም።'
          : '\nNote: This is the product default price, not a recorded market price.';

      return this.message(
        language,
        'END',
        `${priceText}${sourceText}`
      );
    }

    // Safe fallback for an unexpected session step.
    data.step = 'main';
    data.marketId = null;

    await this.saveSession(row, data);

    return this.message(
      language,
      'CON',
      await this.mainMenu(language)
    );
  }
}
