// src/pages/admin/AdminTripForm.tsx
import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Save,
  ArrowLeft,
  Plus,
  X,
  Upload,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import AdminLayout from "@/components/admin/AdminLayout";
import { cn } from "@/lib/utils";
import axiosInstance from "@/lib/axios";


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

// Trip Categories based on Navbar structure
const TRIP_CATEGORIES = {
  "EMI Trips": {
    value: "emi-trips",
    subcategories: [
      { label: "EMI Packages", value: "emi-package", route: "/trips/emi" },
    ],
  },
  "International Trips": {
    value: "international-trips",
    subcategories: [
      { label: "International Packages", value: "international-package", route: "/international-trips" },
    ],
  },
  "India Trips": {
    value: "india-trips",
    subcategories: [
      { label: "Domestic Packages", value: "domestic-package", route: "/domestic-trips" },
    ],
  },
  "Deals": {
    value: "deals",
    subcategories: [
      { label: "Seasonal Deals", value: "seasonal", route: "/deals/seasonal" },
      { label: "Limited Time Offers", value: "limited", route: "/deals/limited" },
    ],
  },
  "Travel Styles": {
    value: "travel-styles",
    subcategories: [
      { label: "Pilgrimage Trips", value: "pilgrimage", route: "/trips/pilgrimage" },
      { label: "Solo Trips", value: "solo", route: "/style/solo" },
      { label: "Group Trips", value: "group", route: "/trips/group" },
      { label: "Weekend Trips", value: "weekend", route: "/trips/weekend" },
      { label: "Adventure Trips", value: "adventure", route: "/style/adventure" },
      { label: "Cruise Trips", value: "cruise", route: "/trips/cruise" },
      { label: "Customised Trips", value: "customised", route: "/custom" },
    ],
  },
  "Combo Trips": {
    value: "combo-trips",
    subcategories: [
      { label: "Combo Packages", value: "combo", route: "/trips/combo" },
    ],
  },
  "Retreats & Healings": {
    value: "retreats",
    subcategories: [
      { label: "Retreats", value: "meditation", route: "/retreats/meditation" },
      { label: "Healings", value: "wellness", route: "/retreats/wellness" },
    ],
  },
};

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
    tripType: "",
    tripRoute: "",
    duration: "",
    description: "",
    price: "",
    originalPrice: "",
    discount: "",
    status: "Active",
    image: "",
    inclusions: [""],
    exclusions: [""],
    notes: [""],
    itinerary: [{ day: 1, title: "", highlights: [""] }] as ItineraryDay[],
    dates: [{ date: "", price: 0, available: 20 }] as TripDate[],
    tags: "",
    hasGoodies: false,
  });

  const [currentTab, setCurrentTab] = useState(0);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]); // Changed to array
  const [availableTypes, setAvailableTypes] = useState<any[]>([]);
  const [availableDestinations, setAvailableDestinations] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);

  const tabs = ["Basic Info", "Categories & Type", "Pricing", "Itinerary", "Inclusions", "Dates"];

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
          tripType: trip.tripType,
          tripRoute: trip.tripRoute,
          duration: trip.duration,
          description: trip.description,
          price: trip.price.toString(),
          originalPrice: trip.originalPrice.toString(),
          discount: trip.discount.toString(),
          status: trip.status,
          image: trip.image,
          inclusions: trip.inclusions.length > 0 ? trip.inclusions : [""],
          exclusions: trip.exclusions.length > 0 ? trip.exclusions : [""],
          notes: trip.notes.length > 0 ? trip.notes : [""],
          itinerary: trip.itinerary.length > 0 ? trip.itinerary : [{ day: 1, title: "", highlights: [""] }],
          dates: trip.dates.length > 0 ? trip.dates : [{ date: "", price: 0, available: 20 }],
          tags: trip.tags || "",
          hasGoodies: trip.hasGoodies || false,
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

  const handleTypeChange = (type: string) => {
    const selectedType = availableTypes.find((t) => t.value === type);
    setFormData((prev) => ({
      ...prev,
      tripType: type,
      tripRoute: selectedType?.route || "",
    }));
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

  // Array handlers
  const addArrayItem = (field: "inclusions" | "exclusions" | "notes") => {
    setFormData((prev) => ({
      ...prev,
      [field]: [...prev[field], ""],
    }));
  };

  const updateArrayItem = (
    field: "inclusions" | "exclusions" | "notes",
    index: number,
    value: string
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: prev[field].map((item, i) => (i === index ? value : item)),
    }));
  };

  const removeArrayItem = (field: "inclusions" | "exclusions" | "notes", index: number) => {
    setFormData((prev) => ({
      ...prev,
      [field]: prev[field].filter((_, i) => i !== index),
    }));
  };

  // Itinerary handlers
  const addItineraryDay = () => {
    setFormData((prev) => ({
      ...prev,
      itinerary: [
        ...prev.itinerary,
        { day: prev.itinerary.length + 1, title: "", highlights: [""] },
      ],
    }));
  };

  const handleItineraryChange = (
    dayIndex: number,
    field: string,
    value: string,
    highlightIndex?: number
  ) => {
    setFormData((prev) => ({
      ...prev,
      itinerary: prev.itinerary.map((day, i) => {
        if (i === dayIndex) {
          if (field === "highlights" && highlightIndex !== undefined) {
            return {
              ...day,
              highlights: day.highlights.map((h, hi) => (hi === highlightIndex ? value : h)),
            };
          }
          return { ...day, [field]: value };
        }
        return day;
      }),
    }));
  };

  const addItineraryHighlight = (dayIndex: number) => {
    setFormData((prev) => ({
      ...prev,
      itinerary: prev.itinerary.map((day, i) =>
        i === dayIndex ? { ...day, highlights: [...day.highlights, ""] } : day
      ),
    }));
  };

  const removeItineraryHighlight = (dayIndex: number, highlightIndex: number) => {
    setFormData((prev) => ({
      ...prev,
      itinerary: prev.itinerary.map((day, i) =>
        i === dayIndex
          ? { ...day, highlights: day.highlights.filter((_, hi) => hi !== highlightIndex) }
          : day
      ),
    }));
  };

  // Date handlers
  const addDate = () => {
    setFormData((prev) => ({
      ...prev,
      dates: [...prev.dates, { date: "", price: 0, available: 20 }],
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Filter out empty strings from arrays
      const cleanedData = {
        ...formData,
        inclusions: formData.inclusions.filter((item) => item.trim() !== ""),
        exclusions: formData.exclusions.filter((item) => item.trim() !== ""),
        notes: formData.notes.filter((item) => item.trim() !== ""),
        itinerary: formData.itinerary.map((day) => ({
          ...day,
          highlights: day.highlights.filter((h) => h.trim() !== ""),
        })),
        dates: formData.dates.filter((date) => date.date !== ""),
        price: parseFloat(formData.price),
        originalPrice: parseFloat(formData.originalPrice),
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

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" onClick={() => navigate("/admin/trips")}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          <div>
            <h1 className="text-3xl font-display font-bold">
              {isEdit ? "Edit Trip" : "Create New Trip"}
            </h1>
            <p className="text-muted-foreground mt-1">
              {isEdit ? "Update trip information" : "Add a new trip package"}
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Tabs */}
          <div className="flex gap-2 overflow-x-auto pb-2">
            {tabs.map((tab, index) => (
              <Button
                key={tab}
                type="button"
                variant={currentTab === index ? "default" : "outline"}
                size="sm"
                onClick={() => setCurrentTab(index)}
                className="whitespace-nowrap"
              >
                {tab}
              </Button>
            ))}
          </div>

          {/* Tab Content */}
          <div className="bg-card rounded-xl border border-border p-6">
            {/* Basic Info Tab */}
            {currentTab === 0 && (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Trip Name *</label>
                  <Input
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="Enter trip name..."
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Destination *</label>
                  <Input
                    name="destination"
                    value={formData.destination}
                    onChange={handleInputChange}
                    placeholder="Enter destination..."
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Duration *</label>
                  <Input
                    name="duration"
                    value={formData.duration}
                    onChange={handleInputChange}
                    placeholder="e.g., 5 Days 4 Nights"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Description *</label>
                  <Textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    placeholder="Enter trip description..."
                    rows={6}
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Tags (comma separated)</label>
                  <Input
                    name="tags"
                    value={formData.tags}
                    onChange={handleInputChange}
                    placeholder="e.g., adventure, beach, cultural"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Trip Image</label>
                  <div className="flex items-center gap-4">
                    <Input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="flex-1"
                    />
                    {formData.image && (
                      <img
                        src={formData.image}
                        alt="Preview"
                        className="w-20 h-20 object-cover rounded"
                      />
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Status</label>
                  <select
                    name="status"
                    value={formData.status}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, status: e.target.value }))
                    }
                    className="w-full p-2 border border-border rounded-md bg-background"
                  >
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                    <option value="Draft">Draft</option>
                  </select>
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    name="hasGoodies"
                    checked={formData.hasGoodies}
                    onChange={handleInputChange}
                    className="w-4 h-4"
                  />
                  <label className="text-sm font-medium">Has Goodies/Special Offers</label>
                </div>
              </div>
            )}

            {/* Categories & Type Tab */}
            {currentTab === 1 && (
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium mb-3">
                    Select Categories * (You can select multiple)
                  </label>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                    {Object.entries(TRIP_CATEGORIES).map(([label, category]) => (
                      <div
                        key={category.value}
                        onClick={() => handleCategoryToggle(category.value)}
                        className={cn(
                          "p-4 border-2 rounded-lg cursor-pointer transition-all hover:shadow-md",
                          selectedCategories.includes(category.value)
                            ? "border-primary bg-primary/5"
                            : "border-border hover:border-primary/50"
                        )}
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-medium">{label}</span>
                          {selectedCategories.includes(category.value) && (
                            <div className="w-5 h-5 bg-primary rounded-full flex items-center justify-center">
                              <svg
                                className="w-3 h-3 text-white"
                                fill="none"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                              >
                                <path d="M5 13l4 4L19 7"></path>
                              </svg>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                  {selectedCategories.length > 0 && (
                    <p className="text-sm text-muted-foreground mt-2">
                      Selected: {selectedCategories.map(cat => 
                        Object.entries(TRIP_CATEGORIES).find(([, c]) => c.value === cat)?.[0]
                      ).join(", ")}
                    </p>
                  )}
                </div>

                {/* Country grouping - drives the Explore Destinations cards on the
                    homepage. Does NOT affect navbar placement. */}
                <div className="pt-2 border-t border-border">
                  <label className="block text-sm font-medium mb-1">
                    Countries / Destinations (You can select multiple)
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
                        <div
                          key={dest._id}
                          onClick={() => handleDestinationToggle(dest._id)}
                          className={cn(
                            "p-3 border-2 rounded-lg cursor-pointer transition-all hover:shadow-sm flex items-center justify-between gap-2",
                            formData.destinations.includes(dest._id)
                              ? "border-primary bg-primary/5"
                              : "border-border hover:border-primary/50"
                          )}
                        >
                          <span className="text-sm font-medium truncate">
                            {dest.name}
                          </span>
                          {formData.destinations.includes(dest._id) && (
                            <div className="w-4 h-4 bg-primary rounded-full flex items-center justify-center shrink-0">
                              <svg
                                className="w-2.5 h-2.5 text-white"
                                fill="none"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="3"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                              >
                                <path d="M5 13l4 4L19 7"></path>
                              </svg>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                  {formData.destinations.length > 0 && (
                    <p className="text-sm text-muted-foreground mt-2">
                      Selected:{" "}
                      {availableDestinations
                        .filter((d) => formData.destinations.includes(d._id))
                        .map((d) => d.name)
                        .join(", ")}
                    </p>
                  )}
                </div>

                {availableTypes.length > 0 && (
                  <div>
                    <label className="block text-sm font-medium mb-2">Trip Type *</label>
                    <select
                      value={formData.tripType}
                      onChange={(e) => handleTypeChange(e.target.value)}
                      className="w-full p-2 border border-border rounded-md bg-background"
                      required
                    >
                      <option value="">Select trip type</option>
                      {availableTypes.map((type) => (
                        <option key={type.value} value={type.value}>
                          {type.label}
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                {formData.tripRoute && (
                  <div>
                    <label className="block text-sm font-medium mb-2">Trip Route</label>
                    <Input value={formData.tripRoute} disabled className="bg-muted" />
                  </div>
                )}
              </div>
            )}

            {/* Pricing Tab */}
            {currentTab === 2 && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Current Price (₹) *
                    </label>
                    <Input
                      name="price"
                      type="number"
                      value={formData.price}
                      onChange={handleInputChange}
                      placeholder="Enter current price"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Original Price (₹)
                    </label>
                    <Input
                      name="originalPrice"
                      type="number"
                      value={formData.originalPrice}
                      onChange={handleInputChange}
                      placeholder="Enter original price"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Discount (%)</label>
                    <Input
                      name="discount"
                      type="number"
                      value={
                        formData.originalPrice && formData.price
                          ? (
                              ((parseFloat(formData.originalPrice) -
                                parseFloat(formData.price)) /
                                parseFloat(formData.originalPrice)) *
                              100
                            ).toFixed(0)
                          : 0}
                      disabled
                      className="bg-muted"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Itinerary Tab */}
            {currentTab === 3 && (
              <div className="space-y-4">
                {formData.itinerary.map((day, dayIndex) => (
                  <div key={dayIndex} className="border border-border rounded-lg p-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <h3 className="font-semibold">Day {day.day}</h3>
                    </div>
                    <Input
                      value={day.title}
                      onChange={(e) => handleItineraryChange(dayIndex, "title", e.target.value)}
                      placeholder="Day title..."
                    />
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Highlights:</label>
                      {day.highlights.map((highlight, highlightIndex) => (
                        <div key={highlightIndex} className="flex gap-2">
                          <Input
                            value={highlight}
                            onChange={(e) =>
                              handleItineraryChange(dayIndex, "highlights", e.target.value, highlightIndex)
                            }
                            placeholder="Highlight..."
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => removeItineraryHighlight(dayIndex, highlightIndex)}
                          >
                            <X className="w-4 h-4" />
                          </Button>
                        </div>
                      ))}
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => addItineraryHighlight(dayIndex)}
                      >
                        <Plus className="w-4 h-4 mr-2" />
                        Add Highlight
                      </Button>
                    </div>
                  </div>
                ))}
                <Button
                  type="button"
                  variant="outline"
                  onClick={addItineraryDay}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Day
                </Button>
              </div>
            )}

            {/* Inclusions Tab */}
            {currentTab === 4 && (
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium mb-2">Inclusions</label>
                  {formData.inclusions.map((item, index) => (
                    <div key={index} className="flex gap-2 mb-2">
                      <Input
                        value={item}
                        onChange={(e) => updateArrayItem("inclusions", index, e.target.value)}
                        placeholder="Included item..."
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeArrayItem("inclusions", index)}
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => addArrayItem("inclusions")}
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add Inclusion
                  </Button>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Exclusions</label>
                  {formData.exclusions.map((item, index) => (
                    <div key={index} className="flex gap-2 mb-2">
                      <Input
                        value={item}
                        onChange={(e) => updateArrayItem("exclusions", index, e.target.value)}
                        placeholder="Excluded item..."
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeArrayItem("exclusions", index)}
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => addArrayItem("exclusions")}
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add Exclusion
                  </Button>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Important Notes</label>
                  {formData.notes.map((item, index) => (
                    <div key={index} className="flex gap-2 mb-2">
                      <Input
                        value={item}
                        onChange={(e) => updateArrayItem("notes", index, e.target.value)}
                        placeholder="Note..."
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeArrayItem("notes", index)}
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => addArrayItem("notes")}
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add Note
                  </Button>
                </div>
              </div>
            )}

            {/* Dates Tab with Improved Labels */}
            {currentTab === 5 && (
              <div className="space-y-4">
                <div className="mb-4">
                  <h3 className="text-lg font-semibold mb-1">Trip Availability Dates</h3>
                  <p className="text-sm text-muted-foreground">
                    Add all available dates for this trip with specific pricing and group sizes
                  </p>
                </div>
                
                {formData.dates.map((dateItem, index) => (
                  <div key={index} className="border border-border rounded-lg p-4 space-y-3">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-muted-foreground">
                        Date #{index + 1}
                      </span>
                      {formData.dates.length > 1 && (
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => removeDate(index)}
                        >
                          <X className="w-4 h-4 text-destructive" />
                        </Button>
                      )}
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-sm font-medium mb-2">
                          Date *
                        </label>
                        <Input
                          type="date"
                          value={dateItem.date}
                          onChange={(e) => handleDateChange(index, "date", e.target.value)}
                          required
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium mb-2">
                          Starting Price (₹) *
                        </label>
                        <Input
                          type="number"
                          value={dateItem.price}
                          onChange={(e) => handleDateChange(index, "price", parseInt(e.target.value))}
                          placeholder="Enter price"
                          required
                          min="0"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium mb-2">
                          Group Size (Available Seats) *
                        </label>
                        <Input
                          type="number"
                          value={dateItem.available}
                          onChange={(e) => handleDateChange(index, "available", parseInt(e.target.value))}
                          placeholder="Enter available seats"
                          required
                          min="1"
                        />
                      </div>
                    </div>
                  </div>
                ))}
                
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

          {/* Step navigation + Submit */}
          <div className="flex flex-col gap-4 mt-6 lg:flex-row lg:items-center lg:justify-between">
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
              <span className="text-sm text-muted-foreground ml-1 whitespace-nowrap">
                Step {currentTab + 1} of {tabs.length}
              </span>
            </div>

            {/* Cancel / Save - available on every step */}
            <div className="flex gap-4 justify-end">
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