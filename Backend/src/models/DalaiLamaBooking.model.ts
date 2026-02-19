// models/DalaiLamaBooking.model.ts
import fs from 'fs/promises';
import path from 'path';

export interface IDalaiLamaBooking {
  id: string;
  bookingId: string;
  customerName: string;
  email: string;
  phone: string;
  message?: string;
  travelers: number;
  selectedDate: string;
  // totalAmount is optional — pricing is discussed post-inquiry
  totalAmount?: number;
  status: 'Pending' | 'Confirmed' | 'Cancelled';
  createdAt: string;
  updatedAt: string;
}

const BOOKINGS_FILE = path.join(process.cwd(), 'data', 'dalai-lama-bookings.json');

const ensureDataDir = async () => {
  const dataDir = path.join(process.cwd(), 'data');
  try {
    await fs.access(dataDir);
  } catch {
    await fs.mkdir(dataDir, { recursive: true });
  }
};

const readBookings = async (): Promise<IDalaiLamaBooking[]> => {
  await ensureDataDir();
  try {
    const data = await fs.readFile(BOOKINGS_FILE, 'utf-8');
    return JSON.parse(data);
  } catch {
    return [];
  }
};

const writeBookings = async (bookings: IDalaiLamaBooking[]): Promise<void> => {
  await ensureDataDir();
  await fs.writeFile(BOOKINGS_FILE, JSON.stringify(bookings, null, 2));
};

const generateBookingId = (count: number): string => {
  return `DL${String(count + 1).padStart(6, '0')}`;
};

const generateId = (): string => {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};

export class DalaiLamaBooking {
  // Create new booking / inquiry
  static async create(
    data: Omit<IDalaiLamaBooking, 'id' | 'bookingId' | 'status' | 'createdAt' | 'updatedAt'>
  ): Promise<IDalaiLamaBooking> {
    const bookings = await readBookings();
    const now = new Date().toISOString();

    const newBooking: IDalaiLamaBooking = {
      id: generateId(),
      bookingId: generateBookingId(bookings.length),
      ...data,
      status: 'Pending',
      createdAt: now,
      updatedAt: now,
    };

    bookings.push(newBooking);
    await writeBookings(bookings);
    return newBooking;
  }

  // Find all bookings with optional filters
  static async findAll(filters?: {
    status?: string;
    search?: string;
    page?: number;
    limit?: number;
  }): Promise<{ bookings: IDalaiLamaBooking[]; total: number; pages: number }> {
    let bookings = await readBookings();

    if (filters?.status && filters.status !== 'All') {
      bookings = bookings.filter((b) => b.status === filters.status);
    }

    if (filters?.search) {
      const search = filters.search.toLowerCase();
      bookings = bookings.filter(
        (b) =>
          b.customerName.toLowerCase().includes(search) ||
          b.email.toLowerCase().includes(search) ||
          b.phone.includes(search) ||
          b.bookingId.toLowerCase().includes(search)
      );
    }

    const total = bookings.length;
    const page = filters?.page || 1;
    const limit = filters?.limit || 10;
    const pages = Math.ceil(total / limit);

    const start = (page - 1) * limit;
    const paginatedBookings = bookings
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(start, start + limit);

    return { bookings: paginatedBookings, total, pages };
  }

  static async findById(id: string): Promise<IDalaiLamaBooking | null> {
    const bookings = await readBookings();
    return bookings.find((b) => b.id === id) || null;
  }

  static async findByIdAndUpdate(
    id: string,
    update: Partial<IDalaiLamaBooking>
  ): Promise<IDalaiLamaBooking | null> {
    const bookings = await readBookings();
    const index = bookings.findIndex((b) => b.id === id);

    if (index === -1) return null;

    bookings[index] = {
      ...bookings[index],
      ...update,
      updatedAt: new Date().toISOString(),
    };

    await writeBookings(bookings);
    return bookings[index];
  }

  static async deleteOne(id: string): Promise<boolean> {
    const bookings = await readBookings();
    const filteredBookings = bookings.filter((b) => b.id !== id);

    if (filteredBookings.length === bookings.length) return false;

    await writeBookings(filteredBookings);
    return true;
  }

  static async countDocuments(filter?: { status?: string }): Promise<number> {
    const bookings = await readBookings();
    if (!filter?.status) return bookings.length;
    return bookings.filter((b) => b.status === filter.status).length;
  }

  static async getStats(): Promise<{
    totalBookings: number;
    confirmedBookings: number;
    pendingBookings: number;
    cancelledBookings: number;
    totalRevenue: number;
    avgBookingValue: number;
  }> {
    const bookings = await readBookings();

    const confirmedBookings = bookings.filter((b) => b.status === 'Confirmed');

    const stats = {
      totalBookings: bookings.length,
      confirmedBookings: confirmedBookings.length,
      pendingBookings: bookings.filter((b) => b.status === 'Pending').length,
      cancelledBookings: bookings.filter((b) => b.status === 'Cancelled').length,
      // Revenue only from confirmed bookings that have a totalAmount set by admin
      totalRevenue: confirmedBookings.reduce((sum, b) => sum + (b.totalAmount || 0), 0),
      avgBookingValue: 0,
    };

    const bookingsWithAmount = bookings.filter((b) => b.totalAmount !== undefined);
    stats.avgBookingValue =
      bookingsWithAmount.length > 0
        ? Math.round(
            bookingsWithAmount.reduce((sum, b) => sum + (b.totalAmount || 0), 0) /
              bookingsWithAmount.length
          )
        : 0;

    return stats;
  }
}

export default DalaiLamaBooking;