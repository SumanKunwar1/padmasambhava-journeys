// controllers/homeSection.controller.ts
import { Request, Response, NextFunction } from 'express';
import mongoose from 'mongoose';
import { catchAsync } from '../utils/catchAsync';
import { AppError } from '../utils/appError';
import Trip from '../models/Trip.model';
import HomeSection, { HOME_SECTIONS, HomeSectionDefinition } from '../models/HomeSection.model';

// Only what a tour card or an admin row needs. Trips carry itineraries and
// galleries that the homepage should not download seven times over.
const CARD_FIELDS =
  'name image duration price priceUSD originalPrice discount dates destination hasGoodies tripRoute status';

const findSection = (key: string): HomeSectionDefinition | undefined =>
  HOME_SECTIONS.find((section) => section.key === key);

// Legacy trips store tripType / tripRoute / tripCategory as a bare string.
const toList = (value: unknown): string[] => {
  if (Array.isArray(value)) return value.filter((entry) => typeof entry === 'string' && entry);
  return typeof value === 'string' && value ? [value] : [];
};

/**
 * The section's trips in display order: the order the admin arranged first,
 * then anything ticked for the section from the trip form, newest first.
 */
const loadSectionTrips = async (section: HomeSectionDefinition, onlyActive: boolean) => {
  const filter: Record<string, unknown> = { tripRoute: section.route };
  if (onlyActive) filter.status = 'Active';

  const [trips, saved] = await Promise.all([
    Trip.find(filter).select(CARD_FIELDS).sort('-createdAt').lean(),
    HomeSection.findOne({ key: section.key }).lean(),
  ]);

  const position = new Map((saved?.tripIds ?? []).map((id, index) => [String(id), index]));
  const rank = (id: unknown) => position.get(String(id)) ?? Number.MAX_SAFE_INTEGER;

  // Array.prototype.sort is stable, so unranked trips keep their newest-first order.
  return trips.sort((a, b) => rank(a._id) - rank(b._id));
};

// @desc    Get the trips of one homepage section, in display order
// @route   GET /api/v1/home-sections/:key
// @access  Public
export const getHomeSection = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const section = findSection(req.params.key);
    if (!section) {
      return next(new AppError('Homepage section not found', 404));
    }

    const trips = await loadSectionTrips(section, true);

    res.status(200).json({
      status: 'success',
      results: trips.length,
      data: { key: section.key, trips },
    });
  }
);

// @desc    Get every homepage section with its trips (any status)
// @route   GET /api/v1/home-sections
// @access  Private (Admin)
export const getAllHomeSections = catchAsync(
  async (_req: Request, res: Response, _next: NextFunction) => {
    const sections = await Promise.all(
      HOME_SECTIONS.map(async (section) => ({
        key: section.key,
        route: section.route,
        trips: await loadSectionTrips(section, false),
      }))
    );

    res.status(200).json({
      status: 'success',
      results: sections.length,
      data: { sections },
    });
  }
);

// @desc    Set which trips a homepage section shows, and in what order
// @route   PUT /api/v1/home-sections/:key
// @access  Private (Admin)
export const updateHomeSection = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const section = findSection(req.params.key);
    if (!section) {
      return next(new AppError('Homepage section not found', 404));
    }

    const { tripIds } = req.body;
    if (!Array.isArray(tripIds)) {
      return next(new AppError('Please provide the list of trip IDs', 400));
    }

    const ids = [...new Set(tripIds.map((id: unknown) => String(id)))];
    if (ids.some((id) => !mongoose.isValidObjectId(id))) {
      return next(new AppError('One of the trip IDs is not valid', 400));
    }

    // Everything this change can touch: the chosen trips, plus the trips
    // currently in the section (some of which are being removed).
    const affected = await Trip.find({ $or: [{ _id: { $in: ids } }, { tripRoute: section.route }] })
      .select('tripRoute tripType tripCategory')
      .lean();

    const found = new Set(affected.map((trip) => String(trip._id)));
    if (ids.some((id) => !found.has(id))) {
      return next(new AppError('One of the selected trips no longer exists', 400));
    }

    // Adding a trip ticks the section's type for it, exactly as the trip form
    // would; removing unticks it. Arrays are rewritten whole so legacy trips
    // that still hold a bare string are normalised along the way.
    const wanted = new Set(ids);
    const operations = affected.map((trip) => {
      const routes = toList(trip.tripRoute).filter((route) => route !== section.route);
      const types = toList(trip.tripType).filter((type) => type !== section.type);
      const categories = toList(trip.tripCategory);

      if (wanted.has(String(trip._id))) {
        routes.push(section.route);
        types.push(section.type);
        if (!categories.includes(section.category)) categories.push(section.category);
      }

      return {
        updateOne: {
          filter: { _id: trip._id },
          update: { $set: { tripRoute: routes, tripType: types, tripCategory: categories } },
        },
      };
    });

    if (operations.length > 0) {
      // Straight to the collection: these are plain array rewrites, and going
      // through Mongoose would re-cast the legacy string values first.
      await Trip.collection.bulkWrite(operations as any);
    }

    await HomeSection.findOneAndUpdate(
      { key: section.key },
      { key: section.key, tripIds: ids },
      { upsert: true, new: true, runValidators: true, setDefaultsOnInsert: true }
    );

    const trips = await loadSectionTrips(section, false);

    res.status(200).json({
      status: 'success',
      message: 'Homepage section updated successfully',
      data: { key: section.key, route: section.route, trips },
    });
  }
);
