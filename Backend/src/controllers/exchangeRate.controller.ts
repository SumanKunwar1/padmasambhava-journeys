// controllers/exchangeRate.controller.ts
import { Request, Response, NextFunction } from 'express';
import { catchAsync } from '../utils/catchAsync';
import { getExchangeRates } from '../utils/exchangeRates';

// @desc    Current NPR-based exchange rates for the currencies the site quotes
// @route   GET /api/v1/exchange-rates
// @access  Public
export const getRates = catchAsync(
  async (_req: Request, res: Response, _next: NextFunction) => {
    const table = await getExchangeRates();

    // Browsers may reuse this for an hour; the upstream feed only moves daily.
    res.set('Cache-Control', 'public, max-age=3600');

    res.status(200).json({
      status: 'success',
      data: table,
    });
  }
);
