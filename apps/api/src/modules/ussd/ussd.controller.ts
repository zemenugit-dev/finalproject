
import { Request, Response } from 'express';
import { UssdService } from './ussd.service';
import { validateUssdRequest } from './ussd.schema';

const ussdService = new UssdService();

export class UssdController {
  async handleRequest(req: Request, res: Response): Promise<void> {
    const request = validateUssdRequest(req.body);

    if (!request) {
      res.status(400).json({
        success: false,
        message:
          'Invalid request. Required: sessionId, phoneNumber; text is optional.'
      });
      return;
    }

    try {
      const response = await ussdService.handle(request);

      res
        .status(200)
        .type('text/plain')
        .send(response);
    } catch (error) {
      console.error('USSD request failed:', error);

      res.status(500).json({
        success: false,
        message: 'Unable to process the USSD request.'
      });
    }
  }
}
