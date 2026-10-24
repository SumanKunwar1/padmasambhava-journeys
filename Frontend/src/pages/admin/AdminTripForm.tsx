// src/pages/admin/AdminTripForm.tsx
import { useState, useEffect, useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Save,
  ArrowLeft,
  Plus,
  X,
  Upload,
  Check,
  Copy,
  Trash2,
  AlertCircle,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import AdminLayout from "@/components/admin/AdminLayout";
import BulletListInput from "@/components/admin/BulletListInput";
import { cn } from "@/lib/utils";
import axiosInstance from "@/lib/axios";
import { TRIP_CATEGORIES } from "@/lib/trip-taxonomy";
import { useCurrency } from "@/context/CurrencyContext";
import { formatPrice, resolvePrice } from "@/lib/currency";


interface ItineraryDay {
  day: number;
  title: string;
  highlights: string[];
}

interface TripDate {
  date: string;
  price: number;
  available: number;
}

const TABS = ["Basic Info", "Categories & Type", "Pricing", "Itinerary", "Inclusions", "Dates"];

// Which step each validated field lives on, so a failed save can jump there
const FIELD_TAB: Record<string, number> = {
  name: 0,
  destination: 0,
  duration: 0,
  description: 0,
  image: 0,
  tripCategory: 1,
  tripType: 1,
  price: 2,
  itinerary: 3,
};

function Field({
  label,
  required,
  hint,
  error,
  className,
  children,
}: {
  label: string;
  required?: boolean;
  hint?: React.ReactNode;
  error?: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div className={className}>
      <label className="block text-sm font-medium mb-1.5">
        {label}
        {required && <span className="text-destructive"> *</span>}
      </label>
      {children}
      {error ? (
        <p className="text-xs text-destructive mt-1.5">{error}</p>
      ) : (
        hint && <p className="text-xs text-muted-foreground mt-1.5">{hint}</p>
      )}
    </div>
  );
}

function SelectCard({
  label,
  selected,
  onClick,
}: {
  label: string;
  selected: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={selected}
      className={cn(
        "px-3 py-2.5 border-2 rounded-lg text-left transition-all hover:shadow-sm flex items-center justify-between gap-2",
        selected
          ? "border-primary bg-primary/5"
          : "border-border hover:border-primary/50"
      )}
    >
      <span className="text-sm font-medium truncate">{label}</span>
      <span
        className={cn(
          "w-4 h-4 rounded-full flex items-center justify-center shrink-0 border",
          selected ? "bg-primary border-primary" : "border-border"
        )}
      >
        {selected && <Check className="w-2.5 h-2.5 text-white" strokeWidth={3} />}
      </span>
    </button>
  );
}

export default function AdminTripForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const isEdit = Boolean(id);

  const [formData, setFormData] = useState({
    name: "",
    destination: "",
    destinations: [] as string[], // Explore Destination ids (country grouping)
    tripCategory: [] as string[], // Changed to array for multiple categories
    tripType: [] as string[],
    tripRoute: [] as string[],
    duration: "",
    description: "",
    price: "",
    priceUSD: "",
    originalPrice: "",
    discount: "",
    status: "Active",
    image: "",
    inclusions: [] as string[],
    exclusions: [] as string[],
    notes: [] as string[],
    itinerary: [{ day: 1, title: "", highlights: [] }] as ItineraryDay[],
    dates: [{ date: "", price: 0, available: 20 }] as TripDate[],
    tags: "",
    hasGoodies: false,
    showRetreatForm: false,
  });

  const [currentTab, setCurrentTab] = useState(0);

  // Shows the admin what an empty currency box will actually render as today,
  // so "leave it blank" is not a leap of faith.
  const { rates } = useCurrency();
  const autoPricePreview = useMemo(() => {
    const base = parseFloat(formData.price);
    if (!Number.isFinite(base) || base <= 0) return { USD: "" };
    return {
      USD: formatPrice(resolvePrice(base, {}, "USD", rates).amount, "USD"),
    };
  }, [formData.price, rates]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]); // Changed to array
  const [availableTypes, setAvailableTypes] = useState<any[]>([]);
  const [availableDestinations, setAvailableDestinations] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  // Errors stay hidden until the first save attempt, so a blank form is not red
  const [showErrors, setShowErrors] = useState(false);

  const tabs = TABS;

  // Load trip data if editing
  useEffect(() => {
    if (isEdit && id) {
      fetchTripData(id);
    }
  }, [id, isEdit]);

  // Load the country list straight from Explore Destinations, so adding or
  // removing a destination there is reflected here automatically
  useEffect(() => {
    const fetchDestinations = async () => {
      try {
        const response = await axiosInstance.get('/explore-destinations/active');
        if (response.data.status === 'success') {
          setAvailableDestinations(response.data.data.exploreDestinations);
        }
      } catch (error) {
        console.error("Error fetching explore destinations:", error);
      }
    };

    fetchDestinations();
  }, []);

  const fetchTripData = async (tripId: string) => {
    try {
      const response = await axiosInstance.get(`/trips/${tripId}`);

      if (response.data.status === 'success') {
        const trip = response.data.data.trip;
        // Handle both old single category and new multiple categories format
        const categories = Array.isArray(trip.tripCategory)
          ? trip.tripCategory
          : [trip.tripCategory];

        setFormData({
          name: trip.name,
          destination: trip.destination,
          destinations: (trip.destinations || []).map((d: any) =>
            typeof d === 'string' ? d : d._id
          ),
          tripCategory: categories,
          // Legacy trips stored a single string for each of these.
          tripType: Array.isArray(trip.tripType)
            ? trip.tripType
            : trip.tripType
              ? [trip.tripType]
              : [],
          tripRoute: Array.isArray(trip.tripRoute)
            ? trip.tripRoute
            : trip.tripRoute
              ? [trip.tripRoute]
              : [],
          duration: trip.duration,
          description: trip.description,
          price: trip.price.toString(),
          priceUSD: trip.priceUSD != null ? trip.priceUSD.toString() : "",
          originalPrice: trip.originalPrice.toString(),
          discount: trip.discount.toString(),
          status: trip.status,
          image: trip.image,
          inclusions: trip.inclusions || [],
          exclusions: trip.exclusions || [],
          notes: trip.notes || [],
          itinerary: trip.itinerary.length > 0 ? trip.itinerary : [{ day: 1, title: "", highlights: [] }],
          dates: trip.dates.length > 0 ? trip.dates : [{ date: "", price: 0, available: 20 }],
          tags: trip.tags || "",
          hasGoodies: trip.hasGoodies || false,
          showRetreatForm: trip.showRetreatForm || false,
        });
        setSelectedCategories(categories);
      }
    } catch (error) {
      console.error("Error fetching trip:", error);
      toast({
        title: "Error",
        description: "Failed to load trip data",
        variant: "destructive",
      });
    }
  };

  // Update available types when categories change
  useEffect(() => {
    if (selectedCategories.length > 0) {
      // Collect all unique subcategories from selected categories
      const allTypes: any[] = [];
      selectedCategories.forEach(categoryValue => {
        const category = Object.values(TRIP_CATEGORIES).find(
          (cat) => cat.value === categoryValue
        );
        if (category) {
          allTypes.push(...category.subcategories);
        }
      });
      // Remove duplicates based on value
      const uniqueTypes = allTypes.filter((type, index, self) =>
        index === self.findIndex((t) => t.value === type.value)
      );
      setAvailableTypes(uniqueTypes);
    } else {
      setAvailableTypes([]);
    }
  }, [selectedCategories]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleCategoryToggle = (category: string) => {
    setSelectedCategories((prev) => {
      const newCategories = prev.includes(category)
        ? prev.filter((c) => c !== category)
        : [...prev, category];

      setFormData((prevForm) => ({
        ...prevForm,
        tripCategory: newCategories,
      }));

      return newCategories;
    });
  };

  // Step navigation - keeps the long form usable without scrolling back to the
  // tab strip at the top
  const goToTab = (index: number) => {
    if (index < 0 || index > tabs.length - 1) return;
    setCurrentTab(index);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDestinationToggle = (destinationId: string) => {
    setFormData((prev) => ({
      ...prev,
      destinations: prev.destinations.includes(destinationId)
        ? prev.destinations.filter((d) => d !== destinationId)
        : [...prev.destinations, destinationId],
    }));
  };

  // Types are multi-select; routes are derived from whatever is selected, so
  // the two stay in step and the admin never types a route by hand.
  const handleTypeToggle = (type: string) => {
    setFormData((prev) => {
      const nextTypes = prev.tripType.includes(type)
        ? prev.tripType.filter((t) => t !== type)
        : [...prev.tripType, type];

      const nextRoutes = nextTypes
        .map((value) => availableTypes.find((t) => t.value === value)?.route)
        .filter((route): route is string => Boolean(route));

      return { ...prev, tripType: nextTypes, tripRoute: nextRoutes };
    });
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData((prev) => ({ ...prev, image: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  // Bullet list handler (inclusions / exclusions / notes)
  const setListField = (
    field: "inclusions" | "exclusions" | "notes",
    items: string[]
  ) => {
    setFormData((prev) => ({ ...prev, [field]: items }));
  };

  // Itinerary handlers
  const addItineraryDay = () => {
    setFormData((prev) => ({
      ...prev,
      itinerary: [
        ...prev.itinerary,
        { day: prev.itinerary.length + 1, title: "", highlights: [] },
      ],
    }));
  };

  const updateItineraryDay = (dayIndex: number, patch: Partial<ItineraryDay>) => {
    setFormData((prev) => ({
      ...prev,
      itinerary: prev.itinerary.map((day, i) =>
        i === dayIndex ? { ...day, ...patch } : day
      ),
    }));
  };

  // Removing a day renumbers the ones after it, so there is never a gap
  const removeItineraryDay = (dayIndex: number) => {
    setFormData((prev) => ({
      ...prev,
      itinerary: prev.itinerary
        .filter((_, i) => i !== dayIndex)
        .map((day, i) => ({ ...day, day: i + 1 })),
    }));
  };

  // Date handlers - a new row starts from the trip price instead of 0
  const addDate = () => {
    setFormData((prev) => ({
      ...prev,
      dates: [
        ...prev.dates,
        { date: "", price: parseFloat(prev.price) || 0, available: 20 },
      ],
    }));
  };

  const duplicateDate = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      dates: [
        ...prev.dates.slice(0, index + 1),
        { ...prev.dates[index], date: "" },
        ...prev.dates.slice(index + 1),
      ],
    }));
  };

  const handleDateChange = (index: number, field: keyof TripDate, value: string | number) => {
    setFormData((prev) => ({
      ...prev,
      dates: prev.dates.map((date, i) =>
        i === index ? { ...date, [field]: value } : date
      ),
    }));
  };

  const removeDate = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      dates: prev.dates.filter((_, i) => i !== index),
    }));
  };

  const discountPercent = useMemo(() => {
    const original = parseFloat(formData.originalPrice);
    const current = parseFloat(formData.price);
    if (!(original > 0) || !(current >= 0) || current >= original) return 0;
    return Math.round(((original - current) / original) * 100);
  }, [formData.originalPrice, formData.price]);

  // Everything the server will reject, checked up front. Only one step is
  // mounted at a time, so the browser's own `required` cannot cover this.
  const errors = useMemo(() => {
    const found: Record<string, string> = {};
    if (!formData.name.trim()) found.name = "Trip name is required";
    if (!formData.destination.trim()) found.destination = "Destination is required";
    if (!formData.duration.trim()) found.duration = "Duration is required";
    if (!formData.description.trim()) found.description = "Description is required";
    if (!formData.image) found.image = "Trip image is required";
    if (formData.tripCategory.length === 0) {
      found.tripCategory = "Select at least one category";
    } else if (formData.tripType.length === 0) {
      found.tripType = "Select at least one trip type";
    }
    if (!Number.isFinite(parseFloat(formData.price))) {
      found.price = "Current price is required";
    }
    const untitledDay = formData.itinerary.find(
      (day) => !day.title.trim() && day.highlights.length > 0
    );
    if (untitledDay) found.itinerary = `Day ${untitledDay.day} needs a title`;
    return found;
  }, [formData]);

  const fieldError = (field: string) => (showErrors ? errors[field] : undefined);

  const tabHasError = (index: number) =>
    showErrors && Object.keys(errors).some((field) => FIELD_TAB[field] === index);

  const tabDone = [
    !["name", "destination", "duration", "description", "image"].some((f) => errors[f]),
    !errors.tripCategory && !errors.tripType,
    !errors.price,
    !errors.itinerary && formData.itinerary.some((day) => day.title.trim()),
    formData.inclusions.length > 0 || formData.exclusions.length > 0,
    formData.dates.some((date) => date.date),
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const problems = Object.entries(errors);
    if (problems.length > 0) {
      setShowErrors(true);
      toast({
        title: "A few details are missing",
        description: problems.map(([, message]) => message).join(" · "),
        variant: "destructive",
      });
      goToTab(Math.min(...problems.map(([field]) => FIELD_TAB[field])));
      return;
    }

    setIsLoading(true);

    try {
      const price = parseFloat(formData.price);
      const originalPrice = parseFloat(formData.originalPrice);

      // Filter out empty strings from arrays
      const cleanedData = {
        ...formData,
        inclusions: formData.inclusions.filter((item) => item.trim() !== ""),
        exclusions: formData.exclusions.filter((item) => item.trim() !== ""),
        notes: formData.notes.filter((item) => item.trim() !== ""),
        itinerary: formData.itinerary
          // A day left completely blank is dropped rather than failing the save
          .filter((day) => day.title.trim() !== "" || day.highlights.length > 0)
          .map((day) => ({
            ...day,
            highlights: day.highlights.filter((h) => h.trim() !== ""),
          })),
        dates: formData.dates.filter((date) => date.date !== ""),
        price,
        // Empty means "convert at the day's rate", so send null rather than 0.
        priceUSD: formData.priceUSD === "" ? null : parseFloat(formData.priceUSD),
        // No original price means no discount: it simply equals the price.
        originalPrice: Number.isFinite(originalPrice) ? originalPrice : price,
        discount: parseFloat(formData.discount),
      };

      let response;
      if (isEdit) {
        // Use PATCH instead of PUT to match backend route
        response = await axiosInstance.patch(`/trips/${id}`, cleanedData);
      } else {
        response = await axiosInstance.post('/trips', cleanedData);
      }

      toast({
        title: "Success",
        description: isEdit ? "Trip updated successfully" : "Trip created successfully",
      });
      navigate("/admin/trips");
    } catch (error: any) {
      console.error("Error saving trip:", error);
      toast({
        title: "Error",
        description: error.response?.data?.message || "Failed to save trip",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const selectClassName =
    "w-full h-10 px-3 border border-input rounded-md bg-background text-sm";

  return (
    <AdminLayout>
      <div className="space-y-5">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" onClick={() => navigate("/admin/trips")}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          <div className="min-w-0">
            <h1 className="text-2xl sm:text-3xl font-display font-bold truncate">
              {isEdit ? "Edit Trip" : "Create New Trip"}
            </h1>
            <p className="text-muted-foreground text-sm mt-0.5 truncate">
              {formData.name.trim() ||
                (isEdit ? "Update trip information" : "Add a new trip package")}
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} noValidate className="space-y-5">
          {/* Steps */}
          <div className="flex gap-2 overflow-x-auto pb-1">
            {tabs.map((tab, index) => {
              const active = currentTab === index;
              const hasError = tabHasError(index);
              return (
                <button
                  key={tab}
                  type="button"
                  onClick={() => setCurrentTab(index)}
                  className={cn(
                    "flex items-center gap-2 pl-2 pr-3.5 py-1.5 rounded-full border text-sm font-medium whitespace-nowrap transition-colors",
                    active
                      ? "bg-primary text-primary-foreground border-primary"
                      : hasError
                        ? "border-destructive text-destructive hover:bg-destructive/5"
                        : "border-border bg-card hover:border-primary/50"
                  )}
                >
                  <span
                    className={cn(
                      "w-5 h-5 rounded-full flex items-center justify-center text-[11px] shrink-0",
                      active
                        ? "bg-primary-foreground/20"
                        : hasError
                          ? "bg-destructive/10"
                          : tabDone[index]
                            ? "bg-primary/15 text-primary"
                            : "bg-muted text-muted-foreground"
                    )}
                  >
                    {hasError ? (
                      <AlertCircle className="w-3.5 h-3.5" />
                    ) : tabDone[index] ? (
                      <Check className="w-3 h-3" strokeWidth={3} />
                    ) : (
                      index + 1
                    )}
                  </span>
                  {tab}
                </button>
              );
            })}
          </div>

          {/* Tab Content */}
          <div className="bg-card rounded-xl border border-border p-4 sm:p-6">
            {/* Basic Info Tab */}
            {currentTab === 0 && (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4 content-start">
                  <Field
                    label="Trip Name"
                    required
                    error={fieldError("name")}
                    className="sm:col-span-2"
                  >
                    <Input
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      placeholder="Enter trip name..."
                      className={cn(fieldError("name") && "border-destructive")}
                    />
                  </Field>

                  <Field label="Destination" required error={fieldError("destination")}>
                    <Input
                      name="destination"
                      value={formData.destination}
                      onChange={handleInputChange}
                      placeholder="Enter destination..."
                      className={cn(fieldError("destination") && "border-destructive")}
                    />
                  </Field>

                  <Field label="Duration" required error={fieldError("duration")}>
                    <Input
                      name="duration"
                      value={formData.duration}
                      onChange={handleInputChange}
                      placeholder="e.g., 5 Days 4 Nights"
                      className={cn(fieldError("duration") && "border-destructive")}
                    />
                  </Field>

                  <Field
                    label="Description"
                    required
                    error={fieldError("description")}
                    className="sm:col-span-2"
                  >
                    <Textarea
                      name="description"
                      value={formData.description}
                      onChange={handleInputChange}
                      placeholder="Enter trip description..."
                      rows={7}
                      className={cn(fieldError("description") && "border-destructive")}
                    />
                  </Field>

                  <Field
                    label="Tags"
                    hint="Comma separated, e.g. adventure, beach, cultural"
                    className="sm:col-span-2"
                  >
                    <Input
                      name="tags"
                      value={formData.tags}
                      onChange={handleInputChange}
                      placeholder="e.g., adventure, beach, cultural"
                    />
                  </Field>
                </div>

                <div className="space-y-4">
                  <Field label="Trip Image" required error={fieldError("image")}>
                    <label
                      className={cn(
                        "group relative flex flex-col items-center justify-center aspect-video rounded-lg border-2 border-dashed cursor-pointer overflow-hidden transition-colors hover:border-primary/60",
                        fieldError("image") ? "border-destructive" : "border-border"
                      )}
                    >
                      {formData.image ? (
                        <>
                          <img
                            src={formData.image}
                            alt="Preview"
                            className="absolute inset-0 w-full h-full object-cover"
                          />
                          <span className="absolute inset-x-0 bottom-0 bg-black/60 text-white text-xs py-1.5 text-center opacity-0 group-hover:opacity-100 transition-opacity">
                            Click to replace
                          </span>
                        </>
                      ) : (
                        <>
                          <Upload className="w-6 h-6 text-muted-foreground mb-2" />
                          <span className="text-sm font-medium">Click to upload</span>
                          <span className="text-xs text-muted-foreground">
                            JPG, PNG or WebP
                          </span>
                        </>
                      )}
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="sr-only"
                      />
                    </label>
                  </Field>

                  <Field label="Status">
                    <select
                      name="status"
                      value={formData.status}
                      onChange={(e) =>
                        setFormData((prev) => ({ ...prev, status: e.target.value }))
                      }
                      className={selectClassName}
                    >
                      <option value="Active">Active</option>
                      <option value="Inactive">Inactive</option>
                      <option value="Draft">Draft</option>
                    </select>
                  </Field>

                  <label className="flex items-center gap-2.5 p-3 rounded-lg border border-border cursor-pointer hover:border-primary/50 transition-colors">
                    <input
                      type="checkbox"
                      name="hasGoodies"
                      checked={formData.hasGoodies}
                      onChange={handleInputChange}
                      className="w-4 h-4"
                    />
                    <span className="text-sm font-medium">Has Goodies/Special Offers</span>
                  </label>

                  <label className="flex items-start gap-2.5 p-3 rounded-lg border border-border cursor-pointer hover:border-primary/50 transition-colors">
                    <input
                      type="checkbox"
                      name="showRetreatForm"
                      checked={formData.showRetreatForm}
                      onChange={handleInputChange}
                      className="w-4 h-4 mt-0.5"
                    />
                    <span>
                      <span className="block text-sm font-medium">Show retreat details in booking form</span>
                      <span className="block text-xs text-muted-foreground">
                        Also asks for WhatsApp number, pick-up location and whether meditation is required.
                      </span>
                    </span>
                  </label>
                </div>
              </div>
            )}

            {/* Categories & Type Tab */}
            {currentTab === 1 && (
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium mb-3">
                    Select Categories <span className="text-destructive">*</span>{" "}
                    <span className="text-muted-foreground font-normal">
                      (You can select multiple)
                    </span>
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2">
                    {Object.entries(TRIP_CATEGORIES).map(([label, category]) => (
                      <SelectCard
                        key={category.value}
                        label={label}
                        selected={selectedCategories.includes(category.value)}
                        onClick={() => handleCategoryToggle(category.value)}
                      />
                    ))}
                  </div>
                  {fieldError("tripCategory") && (
                    <p className="text-sm text-destructive mt-2">
                      {fieldError("tripCategory")}
                    </p>
                  )}
                </div>

                {availableTypes.length > 0 && (
                  <div className="pt-5 border-t border-border">
                    <label className="block text-sm font-medium mb-1">
                      Trip Type <span className="text-destructive">*</span>{" "}
                      <span className="text-muted-foreground font-normal">
                        (You can select multiple)
                      </span>
                    </label>
                    <p className="text-xs text-muted-foreground mb-3">
                      Each type adds the trip to that section of the site. The
                      homepage&apos;s &quot;Upcoming Trips&quot; shows only trips
                      with <strong>Group Trips</strong> selected. The other
                      homepage sections (Kailash &amp; Tibet, Wellness Tours,
                      World Peace Prayer, Empowerment &amp; Teachings, Trip by
                      Activities) are under the <strong>Homepage Sections</strong>{" "}
                      category, and Pilgrimage Tours uses{" "}
                      <strong>Pilgrimage Trips</strong>. You can also fill and
                      reorder those sections from Homepage → Tour Sections.
                    </p>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
                      {availableTypes.map((type) => (
                        <SelectCard
                          key={type.value}
                          label={type.label}
                          selected={formData.tripType.includes(type.value)}
                          onClick={() => handleTypeToggle(type.value)}
                        />
                      ))}
                    </div>
                    {formData.tripType.length === 0 && (
                      <p className="text-sm text-destructive mt-2">
                        Select at least one trip type.
                      </p>
                    )}
                    {formData.tripRoute.length > 0 && (
                      <div className="flex flex-wrap items-center gap-2 mt-3">
                        <span className="text-xs text-muted-foreground">
                          Routes (set automatically):
                        </span>
                        {formData.tripRoute.map((route) => (
                          <span
                            key={route}
                            className="px-2.5 py-1 rounded-full bg-muted text-xs text-muted-foreground border border-border"
                          >
                            {route}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {/* Country grouping - drives the Explore Destinations cards on the
                    homepage. Does NOT affect navbar placement. */}
                <div className="pt-5 border-t border-border">
                  <label className="block text-sm font-medium mb-1">
                    Countries / Destinations{" "}
                    <span className="text-muted-foreground font-normal">
                      (You can select multiple)
                    </span>
                  </label>
                  <p className="text-xs text-muted-foreground mb-3">
                    Controls which "Explore Destinations" card this trip appears
                    under on the homepage. This is separate from the categories
                    above and does not change where the trip sits in the navbar.
                  </p>
                  {availableDestinations.length === 0 ? (
                    <p className="text-sm text-muted-foreground">
                      No destinations found. Add them under Homepage → Explore
                      Destinations.
                    </p>
                  ) : (
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
                      {availableDestinations.map((dest) => (
                        <SelectCard
                          key={dest._id}
                          label={dest.name}
                          selected={formData.destinations.includes(dest._id)}
                          onClick={() => handleDestinationToggle(dest._id)}
                        />
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Pricing Tab */}
            {currentTab === 2 && (
              <div className="space-y-5">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Field
                    label="Current Price (₹, INR)"
                    required
                    error={fieldError("price")}
                  >
                    <Input
                      name="price"
                      type="number"
                      value={formData.price}
                      onChange={handleInputChange}
                      placeholder="Enter current price"
                      className={cn(fieldError("price") && "border-destructive")}
                    />
                  </Field>
                  <Field
                    label="Original Price (₹, INR)"
                    hint="Leave blank if there is no discount."
                  >
                    <Input
                      name="originalPrice"
                      type="number"
                      value={formData.originalPrice}
                      onChange={handleInputChange}
                      placeholder="Enter original price"
                    />
                  </Field>
                  <Field label="Discount (%)" hint="Calculated automatically.">
                    <Input
                      name="discount"
                      type="number"
                      value={discountPercent}
                      disabled
                      className="bg-muted"
                    />
                  </Field>
                </div>

                {/* Per-currency prices */}
                <div className="rounded-xl border border-border bg-muted/30 p-4 sm:p-5 space-y-4">
                  <div>
                    <h3 className="font-semibold text-sm sm:text-base">
                      US Dollar price
                    </h3>
                    <p className="text-xs sm:text-sm text-muted-foreground mt-1">
                      Leave the box empty and the site converts the INR price at
                      that day&apos;s exchange rate. Type a price and visitors
                      see exactly that number instead.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Field
                      label="US Dollar price ($)"
                      hint={
                        formData.priceUSD
                          ? "Manual price — shown exactly as typed."
                          : autoPricePreview.USD
                            ? `Will show as ${autoPricePreview.USD} today.`
                            : "Will be converted automatically."
                      }
                    >
                      <Input
                        name="priceUSD"
                        type="number"
                        min="0"
                        step="0.01"
                        value={formData.priceUSD}
                        onChange={handleInputChange}
                        placeholder={
                          autoPricePreview.USD
                            ? `Auto: ${autoPricePreview.USD}`
                            : "Leave blank to auto-convert"
                        }
                      />
                    </Field>
                  </div>
                </div>
              </div>
            )}

            {/* Itinerary Tab */}
            {currentTab === 3 && (
              <div className="space-y-3">
                {fieldError("itinerary") && (
                  <p className="text-sm text-destructive">{fieldError("itinerary")}</p>
                )}
                {formData.itinerary.map((day, dayIndex) => (
                  <div
                    key={dayIndex}
                    className="border border-border rounded-lg p-3 sm:p-4 space-y-3"
                  >
                    <div className="flex items-center gap-2 sm:gap-3">
                      <span className="shrink-0 px-2.5 py-1.5 rounded-md bg-primary/10 text-primary text-sm font-semibold whitespace-nowrap">
                        Day {day.day}
                      </span>
                      <Input
                        value={day.title}
                        onChange={(e) =>
                          updateItineraryDay(dayIndex, { title: e.target.value })
                        }
                        placeholder="Day title..."
                        className={cn(
                          showErrors &&
                            !day.title.trim() &&
                            day.highlights.length > 0 &&
                            "border-destructive"
                        )}
                      />
                      {formData.itinerary.length > 1 && (
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => removeItineraryDay(dayIndex)}
                          title="Remove this day"
                        >
                          <Trash2 className="w-4 h-4 text-destructive" />
                        </Button>
                      )}
                    </div>
                    <BulletListInput
                      value={day.highlights}
                      onChange={(highlights) =>
                        updateItineraryDay(dayIndex, { highlights })
                      }
                      placeholder="• Highlights for this day, one per line"
                      rows={3}
                    />
                  </div>
                ))}
                <Button
                  type="button"
                  variant="outline"
                  onClick={addItineraryDay}
                  className="w-full"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Day {formData.itinerary.length + 1}
                </Button>
              </div>
            )}

            {/* Inclusions Tab */}
            {currentTab === 4 && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div>
                    <label className="flex items-center gap-2 text-sm font-medium mb-2">
                      <Check className="w-4 h-4 text-primary" />
                      Inclusions
                    </label>
                    <BulletListInput
                      value={formData.inclusions}
                      onChange={(items) => setListField("inclusions", items)}
                      placeholder={"• Accommodation on twin sharing\n• Daily breakfast\n• Airport transfers"}
                      rows={10}
                    />
                  </div>

                  <div>
                    <label className="flex items-center gap-2 text-sm font-medium mb-2">
                      <X className="w-4 h-4 text-destructive" />
                      Exclusions
                    </label>
                    <BulletListInput
                      value={formData.exclusions}
                      onChange={(items) => setListField("exclusions", items)}
                      placeholder={"• International flights\n• Travel insurance\n• Personal expenses"}
                      rows={10}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Important Notes</label>
                  <BulletListInput
                    value={formData.notes}
                    onChange={(items) => setListField("notes", items)}
                    placeholder="• Anything travellers should know before booking"
                    rows={5}
                  />
                </div>
              </div>
            )}

            {/* Dates Tab */}
            {currentTab === 5 && (
              <div className="space-y-3">
                <div className="mb-1">
                  <h3 className="text-lg font-semibold mb-1">Trip Availability Dates</h3>
                  <p className="text-sm text-muted-foreground">
                    Add all available dates for this trip with specific pricing and group sizes
                  </p>
                </div>

                {formData.dates.length > 0 && (
                  <div className="hidden md:grid grid-cols-[1fr_1fr_1fr_auto] gap-3 px-1 text-xs font-medium text-muted-foreground">
                    <span>Date</span>
                    <span>Starting Price (₹)</span>
                    <span>Group Size (Available Seats)</span>
                    <span className="w-[76px]" />
                  </div>
                )}

                {formData.dates.map((dateItem, index) => (
                  <div
                    key={index}
                    className="grid grid-cols-1 md:grid-cols-[1fr_1fr_1fr_auto] gap-3 md:items-center border border-border md:border-0 rounded-lg p-3 md:p-0"
                  >
                    <div>
                      <label className="block md:hidden text-xs font-medium text-muted-foreground mb-1">
                        Date
                      </label>
                      <Input
                        type="date"
                        value={dateItem.date}
                        onChange={(e) => handleDateChange(index, "date", e.target.value)}
                      />
                    </div>

                    <div>
                      <label className="block md:hidden text-xs font-medium text-muted-foreground mb-1">
                        Starting Price (₹)
                      </label>
                      <Input
                        type="number"
                        value={Number.isNaN(dateItem.price) ? "" : dateItem.price}
                        onChange={(e) => handleDateChange(index, "price", parseInt(e.target.value))}
                        placeholder="Enter price"
                        min="0"
                      />
                    </div>

                    <div>
                      <label className="block md:hidden text-xs font-medium text-muted-foreground mb-1">
                        Group Size (Available Seats)
                      </label>
                      <Input
                        type="number"
                        value={Number.isNaN(dateItem.available) ? "" : dateItem.available}
                        onChange={(e) => handleDateChange(index, "available", parseInt(e.target.value))}
                        placeholder="Enter available seats"
                        min="1"
                      />
                    </div>

                    <div className="flex justify-end">
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => duplicateDate(index)}
                        title="Duplicate this row"
                      >
                        <Copy className="w-4 h-4" />
                      </Button>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeDate(index)}
                        title="Remove this date"
                      >
                        <X className="w-4 h-4 text-destructive" />
                      </Button>
                    </div>
                  </div>
                ))}

                {formData.dates.length === 0 && (
                  <p className="text-sm text-muted-foreground py-4 text-center border border-dashed border-border rounded-lg">
                    No dates yet.
                  </p>
                )}

                <Button
                  type="button"
                  variant="outline"
                  onClick={addDate}
                  className="w-full"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Another Date
                </Button>
              </div>
            )}
          </div>

          {/* Step navigation + Submit - stays in view on every step */}
          <div className="sticky bottom-0 z-10 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-border bg-card/95 backdrop-blur px-3 py-3 sm:px-4 shadow-sm">
            {/* Previous / Next */}
            <div className="flex items-center gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => goToTab(currentTab - 1)}
                disabled={currentTab === 0}
              >
                <ChevronLeft className="w-4 h-4 mr-1" />
                Previous
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => goToTab(currentTab + 1)}
                disabled={currentTab === tabs.length - 1}
              >
                Next
                <ChevronRight className="w-4 h-4 ml-1" />
              </Button>
              <span className="hidden sm:inline text-sm text-muted-foreground ml-1 whitespace-nowrap">
                Step {currentTab + 1} of {tabs.length}
              </span>
            </div>

            {/* Cancel / Save - available on every step */}
            <div className="flex gap-2 sm:gap-3 justify-end ml-auto">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate("/admin/trips")}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isLoading}>
                <Save className="w-4 h-4 mr-2" />
                {isLoading ? "Saving..." : isEdit ? "Update Trip" : "Create Trip"}
              </Button>
            </div>
          </div>
        </form>
      </div>
    </AdminLayout>
  );
}
