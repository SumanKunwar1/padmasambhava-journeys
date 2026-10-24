// src/components/admin/BookingPicker.tsx
//
// Searchable list of website bookings for linking an invoice to a booking.
// Shows the latest bookings straight away; typing searches name, email,
// phone, trip and booking ID on the server.
import { useEffect, useId, useRef, useState } from "react";
import { Loader2, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { formatPrice } from "@/lib/currency";
import { BOOKING_CURRENCY } from "@/lib/invoice";
import axiosInstance from "@/lib/axios";

export interface PickedBooking {
  _id: string;
  bookingId?: string;
  customerName: string;
  email: string;
  phone: string;
  whatsapp?: string;
  pickupLocation?: string;
  meditationRequired?: boolean;
  message?: string;
  tripName: string;
  travelers: number;
  selectedDate?: string;
  selectedPrice?: number;
  totalAmount: number;
  status: string;
  createdAt: string;
}

export function BookingPicker({ onSelect }: { onSelect: (booking: PickedBooking) => void }) {
  const listId = useId();
  const wrapperRef = useRef<HTMLDivElement>(null);
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<PickedBooking[]>([]);
  const [active, setActive] = useState(0);

  useEffect(() => {
    if (!open) return;
    let cancelled = false;
    const timer = setTimeout(async () => {
      try {
        setLoading(true);
        const response = await axiosInstance.get("/bookings", { params: { search: query.trim(), limit: 8 } });
        if (!cancelled) {
          setResults(response.data?.data?.bookings || []);
          setActive(0);
        }
      } catch {
        if (!cancelled) setResults([]);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }, 300);
    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [query, open]);

  // Close when clicking anywhere outside the picker.
  useEffect(() => {
    if (!open) return;
    const handle = (e: MouseEvent) => {
      if (!wrapperRef.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handle);
    return () => document.removeEventListener("mousedown", handle);
  }, [open]);

  const choose = (booking: PickedBooking) => {
    onSelect(booking);
    setOpen(false);
    setQuery("");
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setOpen(true);
      setActive((i) => Math.min(i + 1, results.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActive((i) => Math.max(i - 1, 0));
    } else if (e.key === "Enter" && open && results[active]) {
      e.preventDefault();
      choose(results[active]);
    } else if (e.key === "Escape" && open) {
      e.stopPropagation();
      setOpen(false);
    }
  };

  return (
    <div ref={wrapperRef} className="relative">
      <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
      <Input
        className="pl-9"
        placeholder="Search bookings by name, email, phone, trip or booking ID..."
        value={query}
        onChange={(e) => {
          setQuery(e.target.value);
          setOpen(true);
        }}
        onFocus={() => setOpen(true)}
        onKeyDown={handleKeyDown}
        role="combobox"
        aria-expanded={open}
        aria-controls={listId}
        aria-autocomplete="list"
      />
      {open && (
        <ul
          id={listId}
          role="listbox"
          className="absolute z-50 mt-1 max-h-72 w-full overflow-y-auto rounded-md border border-border bg-popover p-1 shadow-lg"
        >
          {loading && results.length === 0 ? (
            <li className="flex justify-center py-4">
              <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
            </li>
          ) : results.length === 0 ? (
            <li className="px-3 py-4 text-center text-sm text-muted-foreground">No bookings found.</li>
          ) : (
            results.map((booking, index) => (
              <li
                key={booking._id}
                role="option"
                aria-selected={index === active}
                onMouseEnter={() => setActive(index)}
                onMouseDown={(e) => {
                  e.preventDefault();
                  choose(booking);
                }}
                className={cn(
                  "cursor-pointer rounded px-3 py-2 text-sm",
                  index === active && "bg-accent text-accent-foreground"
                )}
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="font-medium truncate">{booking.customerName}</span>
                  <span className="shrink-0 text-xs text-muted-foreground">{booking.bookingId}</span>
                </div>
                <div className="truncate text-xs text-muted-foreground">
                  {booking.tripName} · {booking.travelers} pax
                  {booking.selectedDate && ` · ${booking.selectedDate}`} · {formatPrice(booking.totalAmount || 0, BOOKING_CURRENCY)} ·{" "}
                  {booking.status}
                </div>
                <div className="truncate text-xs text-muted-foreground">
                  {booking.phone} · {booking.email}
                </div>
              </li>
            ))
          )}
        </ul>
      )}
    </div>
  );
}
