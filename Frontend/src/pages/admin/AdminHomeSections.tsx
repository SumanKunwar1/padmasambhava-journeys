// src/pages/admin/AdminHomeSections.tsx
import { useState, useEffect, useMemo } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { isAxiosError } from "axios";
import { Plus, Trash2, ArrowUp, ArrowDown, Search, ExternalLink, MapPin, Check, LayoutList, Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import AdminLayout from "@/components/admin/AdminLayout";
import { Price } from "@/components/shared/Price";
import axiosInstance from "@/lib/axios";
import { cn } from "@/lib/utils";
import { HOME_MANAGED_SECTIONS, HOME_SECTION_VISIBLE_TRIPS } from "@/lib/home-sections";

interface SectionTrip {
  _id: string;
  name: string;
  image?: string;
  duration?: string;
  destination?: string;
  price: number;
  priceUSD?: number;
  status?: string;
}

type SectionTrips = Record<string, SectionTrip[]>;

// One shared empty list, so a section with no trips keeps a stable reference.
const NO_TRIPS: SectionTrip[] = [];

const errorMessage = (error: unknown, fallback: string) =>
  (isAxiosError(error) && error.response?.data?.message) || fallback;

function TripSummary({ trip }: { trip: SectionTrip }) {
  return (
    <>
      <div className="w-16 h-12 sm:w-20 sm:h-14 shrink-0 rounded-md overflow-hidden bg-muted">
        {trip.image && <img src={trip.image} alt="" className="w-full h-full object-cover" loading="lazy" />}
      </div>
      <div className="min-w-0 flex-1">
        <p className="font-medium leading-snug line-clamp-2">{trip.name}</p>
        <p className="mt-0.5 flex flex-wrap items-center gap-x-2 text-xs text-muted-foreground">
          {trip.duration && <span>{trip.duration}</span>}
          {trip.destination && (
            <span className="inline-flex items-center gap-1">
              <MapPin className="w-3 h-3" />
              {trip.destination}
            </span>
          )}
          <Price
            currency="USD"
            amount={trip.price}
            priceUSD={trip.priceUSD}
            className="font-semibold text-foreground"
          />
        </p>
      </div>
    </>
  );
}

export default function AdminHomeSections() {
  const { toast } = useToast();
  const [searchParams, setSearchParams] = useSearchParams();

  const [sectionTrips, setSectionTrips] = useState<SectionTrips>({});
  const [allTrips, setAllTrips] = useState<SectionTrip[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  const [showPicker, setShowPicker] = useState(false);
  const [pickerSearch, setPickerSearch] = useState("");
  const [pickedIds, setPickedIds] = useState<string[]>([]);

  const activeSection =
    HOME_MANAGED_SECTIONS.find((section) => section.id === searchParams.get("section")) ?? HOME_MANAGED_SECTIONS[0];
  const trips = sectionTrips[activeSection.id] ?? NO_TRIPS;

  useEffect(() => {
    const load = async () => {
      try {
        const [sectionsResponse, tripsResponse] = await Promise.all([
          axiosInstance.get("/home-sections"),
          // The picker's catalogue: every active trip, card fields only.
          axiosInstance.get("/trips", {
            params: {
              limit: 1000,
              sort: "name",
              fields: "name,image,duration,destination,price,priceUSD,status",
            },
          }),
        ]);

        const bySection: SectionTrips = {};
        for (const section of sectionsResponse.data.data.sections) {
          bySection[section.key] = section.trips;
        }
        setSectionTrips(bySection);
        setAllTrips(tripsResponse.data.data.trips);
      } catch (error) {
        toast({
          title: "Error",
          description: errorMessage(error, "Failed to load the homepage sections"),
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Every change saves straight away, so there is no "Save" button to forget.
  const saveSection = async (nextTrips: SectionTrip[], successMessage: string) => {
    const sectionId = activeSection.id;
    const previous = sectionTrips[sectionId] ?? [];

    setSectionTrips((current) => ({ ...current, [sectionId]: nextTrips }));
    setIsSaving(true);

    try {
      const response = await axiosInstance.put(`/home-sections/${sectionId}`, {
        tripIds: nextTrips.map((trip) => trip._id),
      });
      setSectionTrips((current) => ({ ...current, [sectionId]: response.data.data.trips }));
      toast({ title: "Saved", description: successMessage });
    } catch (error) {
      setSectionTrips((current) => ({ ...current, [sectionId]: previous }));
      toast({
        title: "Could not save",
        description: errorMessage(error, "Your change was not saved. Please try again."),
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const moveTrip = (index: number, direction: -1 | 1) => {
    const target = index + direction;
    if (target < 0 || target >= trips.length) return;
    const next = [...trips];
    [next[index], next[target]] = [next[target], next[index]];
    saveSection(next, "Order updated.");
  };

  const removeTrip = (trip: SectionTrip) => {
    saveSection(
      trips.filter((item) => item._id !== trip._id),
      `"${trip.name}" removed from ${activeSection.title}.`
    );
  };

  const openPicker = () => {
    setPickedIds([]);
    setPickerSearch("");
    setShowPicker(true);
  };

  const togglePicked = (id: string) => {
    setPickedIds((current) => (current.includes(id) ? current.filter((item) => item !== id) : [...current, id]));
  };

  const addPicked = () => {
    const picked = pickedIds
      .map((id) => allTrips.find((trip) => trip._id === id))
      .filter((trip): trip is SectionTrip => Boolean(trip));

    setShowPicker(false);
    saveSection(
      [...trips, ...picked],
      `${picked.length} ${picked.length === 1 ? "trip" : "trips"} added to ${activeSection.title}.`
    );
  };

  const idsInSection = useMemo(() => new Set(trips.map((trip) => trip._id)), [trips]);

  const pickerTrips = useMemo(() => {
    const query = pickerSearch.trim().toLowerCase();
    if (!query) return allTrips;
    return allTrips.filter(
      (trip) => trip.name.toLowerCase().includes(query) || (trip.destination ?? "").toLowerCase().includes(query)
    );
  }, [allTrips, pickerSearch]);

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold">Homepage Tour Sections</h1>
          <p className="text-muted-foreground mt-1">
            Choose which of your existing trips appear in each tour section of the homepage. Changes save
            automatically.
          </p>
        </div>

        {/* Section tabs */}
        <div className="flex flex-wrap gap-2" role="tablist" aria-label="Homepage sections">
          {HOME_MANAGED_SECTIONS.map((section) => {
            const isActive = section.id === activeSection.id;
            return (
              <button
                key={section.id}
                type="button"
                role="tab"
                aria-selected={isActive}
                onClick={() => setSearchParams({ section: section.id })}
                className={cn(
                  "inline-flex items-center gap-2 rounded-lg border px-3 py-2 text-sm font-medium transition-colors",
                  isActive
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-border bg-card hover:border-primary/60 hover:text-primary"
                )}
              >
                {section.title}
                <span
                  className={cn(
                    "inline-flex min-w-[1.5rem] justify-center rounded-full px-1.5 py-0.5 text-xs",
                    isActive ? "bg-white/20" : "bg-muted text-muted-foreground"
                  )}
                >
                  {(sectionTrips[section.id] ?? []).length}
                </span>
              </button>
            );
          })}
        </div>

        {/* Active section */}
        <div className="bg-card rounded-lg border" role="tabpanel" aria-label={activeSection.title}>
          <div className="flex flex-col gap-4 p-5 border-b sm:flex-row sm:items-start sm:justify-between">
            <div className="min-w-0">
              <h2 className="text-xl font-semibold">{activeSection.title}</h2>
              <p className="text-sm text-muted-foreground mt-1">{activeSection.description}</p>
              <p className="text-xs text-muted-foreground mt-2">
                The first {HOME_SECTION_VISIBLE_TRIPS} active trips show on the homepage; the rest appear under
                "View All".
              </p>
            </div>
            <div className="flex shrink-0 gap-2">
              <Button asChild variant="outline" size="sm">
                <a href={activeSection.route} target="_blank" rel="noopener noreferrer">
                  <ExternalLink />
                  View page
                </a>
              </Button>
              <Button size="sm" onClick={openPicker} disabled={isLoading || isSaving}>
                <Plus />
                Add Trips
              </Button>
            </div>
          </div>

          {isLoading ? (
            <div className="flex items-center justify-center py-16">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
            </div>
          ) : trips.length === 0 ? (
            <div className="p-10 text-center">
              <LayoutList className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No trips in this section yet</h3>
              <p className="text-muted-foreground mb-4 max-w-md mx-auto">
                Until you add one, the homepage shows "New departures coming soon" here.
              </p>
              <Button onClick={openPicker}>
                <Plus />
                Add Trips
              </Button>
            </div>
          ) : (
            <ol className="divide-y" data-testid="section-trip-list">
              {trips.map((trip, index) => {
                const isActiveTrip = !trip.status || trip.status === "Active";
                const visibleRank = trips.slice(0, index).filter((item) => !item.status || item.status === "Active").length;

                return (
                  <li key={trip._id} className="flex items-center gap-3 p-3 sm:p-4" data-testid="section-trip">
                    <span className="w-6 shrink-0 text-center text-sm font-semibold text-muted-foreground">
                      {index + 1}
                    </span>
                    <TripSummary trip={trip} />

                    <span
                      className={cn(
                        "hidden md:inline-flex shrink-0 rounded-full px-2.5 py-1 text-xs font-medium",
                        !isActiveTrip
                          ? "bg-destructive/10 text-destructive"
                          : visibleRank < HOME_SECTION_VISIBLE_TRIPS
                            ? "bg-primary/10 text-primary"
                            : "bg-muted text-muted-foreground"
                      )}
                    >
                      {!isActiveTrip
                        ? `${trip.status} · hidden`
                        : visibleRank < HOME_SECTION_VISIBLE_TRIPS
                          ? "On homepage"
                          : "Under View All"}
                    </span>

                    <div className="flex shrink-0 items-center gap-0.5">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => moveTrip(index, -1)}
                        disabled={isSaving || index === 0}
                        aria-label={`Move ${trip.name} up`}
                      >
                        <ArrowUp />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => moveTrip(index, 1)}
                        disabled={isSaving || index === trips.length - 1}
                        aria-label={`Move ${trip.name} down`}
                      >
                        <ArrowDown />
                      </Button>
                      <Button asChild variant="ghost" size="icon" className="h-8 w-8">
                        <Link to={`/admin/trips/edit/${trip._id}`} aria-label={`Edit ${trip.name}`}>
                          <Pencil />
                        </Link>
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-destructive hover:text-destructive"
                        onClick={() => removeTrip(trip)}
                        disabled={isSaving}
                        aria-label={`Remove ${trip.name} from this section`}
                      >
                        <Trash2 />
                      </Button>
                    </div>
                  </li>
                );
              })}
            </ol>
          )}
        </div>

        {/* Trip picker */}
        {showPicker && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div
              className="bg-card rounded-lg max-w-2xl w-full max-h-[90svh] flex flex-col"
              role="dialog"
              aria-modal="true"
              aria-label={`Add trips to ${activeSection.title}`}
            >
              <div className="p-5 border-b">
                <div className="flex items-center justify-between gap-4 mb-4">
                  <div className="min-w-0">
                    <h2 className="text-xl font-bold">Add Trips</h2>
                    <p className="text-sm text-muted-foreground truncate">to {activeSection.title}</p>
                  </div>
                  <Button variant="ghost" size="sm" onClick={() => setShowPicker(false)} aria-label="Close">
                    ✕
                  </Button>
                </div>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    autoFocus
                    placeholder="Search your trips by name or destination..."
                    value={pickerSearch}
                    onChange={(e) => setPickerSearch(e.target.value)}
                    className="pl-9"
                    aria-label="Search trips"
                  />
                </div>
              </div>

              <div className="flex-1 overflow-y-auto p-2">
                {allTrips.length === 0 ? (
                  <div className="p-8 text-center text-muted-foreground">
                    <p className="mb-3">You have no active trips yet.</p>
                    <Button asChild variant="outline" size="sm">
                      <Link to="/admin/trips/create">Create a trip</Link>
                    </Button>
                  </div>
                ) : pickerTrips.length === 0 ? (
                  <p className="p-8 text-center text-muted-foreground">No trips match "{pickerSearch}".</p>
                ) : (
                  <ul>
                    {pickerTrips.map((trip) => {
                      const alreadyAdded = idsInSection.has(trip._id);
                      const isPicked = pickedIds.includes(trip._id);

                      return (
                        <li key={trip._id}>
                          <label
                            className={cn(
                              "flex items-center gap-3 rounded-lg p-2.5 transition-colors",
                              alreadyAdded ? "opacity-60" : "cursor-pointer hover:bg-muted",
                              isPicked && "bg-primary/5"
                            )}
                          >
                            <input
                              type="checkbox"
                              className="w-4 h-4 shrink-0"
                              checked={alreadyAdded || isPicked}
                              disabled={alreadyAdded}
                              onChange={() => togglePicked(trip._id)}
                              aria-label={trip.name}
                            />
                            <TripSummary trip={trip} />
                            {alreadyAdded && (
                              <span className="hidden sm:inline-flex shrink-0 items-center gap-1 text-xs text-muted-foreground">
                                <Check className="w-3 h-3" />
                                Already added
                              </span>
                            )}
                          </label>
                        </li>
                      );
                    })}
                  </ul>
                )}
              </div>

              <div className="flex items-center justify-between gap-3 p-4 border-t">
                <p className="text-sm text-muted-foreground">
                  {pickedIds.length === 0 ? "Tick the trips to add" : `${pickedIds.length} selected`}
                </p>
                <div className="flex gap-2">
                  <Button variant="outline" onClick={() => setShowPicker(false)}>
                    Cancel
                  </Button>
                  <Button onClick={addPicked} disabled={pickedIds.length === 0}>
                    {pickedIds.length > 1 ? `Add ${pickedIds.length} Trips` : "Add Trip"}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
