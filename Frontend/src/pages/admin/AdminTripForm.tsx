// src/pages/admin/AdminTripForm.tsx
import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { Save, ArrowLeft, Plus, X, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import AdminLayout from "@/components/admin/AdminLayout";
import { cn } from "@/lib/utils";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api/v1";

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
      { label: "Combo Packages", value: "combo", route: "/trips/emi" },
    ],
  },
"International Trips": {
    value: "international-trips",
    subcategories: [
      { label: "Combo Packages", value: "combo", route: "/international-trips" },
    ],
  },
  "India Trips": {
    value: "india-trips",
    subcategories: [
      { label: "Combo Packages", value: "combo", route: "/domestic-trips" },
    ],
  },

  "Group Trips": {
    value: "group-trips",
    subcategories: [
      { label: "Upcoming Group Trips", value: "upcoming", route: "/trips/upcoming" },
      { label: "Fixed Departure Trips", value: "fixed-departure", route: "/trips/fixed-departure" },
      { label: "Group Travel", value: "group", route: "/trips/group" },
    ],
  },
  "Travel Styles": {
    value: "travel-styles",
    subcategories: [
      { label: "Pilgrimage Trips", value: "pilgrimage", route: "/trips/pilgrimage" },
      { label: "Solo Trips", value: "solo", route: "/style/solo" },
      { label: "Weekend Trips", value: "weekend", route: "/trips/weekend" },
      { label: "Adventure Trips", value: "adventure", route: "/style/adventure" },
      { label: "Cruise Trips", value: "cruise", route: "/trips/cruise" },

    ],
  },
  "Destinations": {
    value: "destinations",
    subcategories: [
      { label: "Domestic Trips", value: "domestic", route: "/domestic-trips" },
      { label: "International Trips", value: "international", route: "/international-trips" },
    ],
  },
  "Combo Trips": {
    value: "combo-trips",
    subcategories: [
      { label: "Combo Packages", value: "combo", route: "/trips/combo" },
    ],
  },
  "Retreats": {
    value: "retreats",
    subcategories: [
      { label: "Meditation Retreats", value: "meditation", route: "/retreats/meditation" },
      { label: "Spiritual Retreats", value: "spiritual", route: "/retreats/spiritual" },
      { label: "Wellness Retreats", value: "wellness", route: "/retreats/wellness" },
      { label: "Yoga Retreats", value: "yoga", route: "/retreats/yoga" },
    ],
  },
  "Customised Trips": {
    value: "customised",
    subcategories: [
      { label: "Custom Packages", value: "custom", route: "/custom" },
    ],
  },
  "Deals": {
    value: "deals",
    subcategories: [
      { label: "Seasonal Deals", value: "seasonal", route: "/deals/seasonal" },
      { label: "Limited Time Offers", value: "limited", route: "/deals/limited" },
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
    tripCategory: "",
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
  const [selectedCategory, setSelectedCategory] = useState("");
  const [availableTypes, setAvailableTypes] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);

  const tabs = ["Basic Info", "Category & Type", "Pricing", "Itinerary", "Inclusions", "Dates"];

  // Load trip data if editing
  useEffect(() => {
    if (isEdit && id) {
      fetchTripData(id);
    }
  }, [id, isEdit]);

  const fetchTripData = async (tripId: string) => {
    try {
      const token = localStorage.getItem("adminToken");
      const response = await axios.get(`${API_URL}/trips/${tripId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      
      if (response.data.status === 'success') {
        const trip = response.data.data.trip;
        setFormData({
          name: trip.name,
          destination: trip.destination,
          tripCategory: trip.tripCategory,
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
        setSelectedCategory(trip.tripCategory);
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

  // Update available types when category changes
  useEffect(() => {
    if (selectedCategory) {
      const category = Object.values(TRIP_CATEGORIES).find(
        (cat) => cat.value === selectedCategory
      );
      if (category) {
        setAvailableTypes(category.subcategories);
      }
    }
  }, [selectedCategory]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
    setFormData((prev) => ({
      ...prev,
      tripCategory: category,
      tripType: "",
      tripRoute: "",
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

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImageFile(e.target.files[0]);
      const reader = new FileReader();
      reader.onload = (event) => {
        setFormData((prev) => ({ ...prev, image: event.target?.result as string }));
      };
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  const addArrayItem = (field: "inclusions" | "exclusions" | "notes") => {
    setFormData((prev) => ({ ...prev, [field]: [...prev[field], ""] }));
  };

  const updateArrayItem = (
    field: "inclusions" | "exclusions" | "notes",
    index: number,
    value: string
  ) => {
    const newArray = [...formData[field]];
    newArray[index] = value;
    setFormData((prev) => ({ ...prev, [field]: newArray }));
  };

  const removeArrayItem = (
    field: "inclusions" | "exclusions" | "notes",
    index: number
  ) => {
    const newArray = formData[field].filter((_, i) => i !== index);
    setFormData((prev) => ({ ...prev, [field]: newArray }));
  };

  const handleItineraryChange = (
    dayIndex: number,
    field: "title" | "highlights",
    value: string,
    highlightIndex?: number
  ) => {
    const newItinerary = [...formData.itinerary];
    if (field === "title") {
      newItinerary[dayIndex].title = value;
    } else if (field === "highlights" && highlightIndex !== undefined) {
      newItinerary[dayIndex].highlights[highlightIndex] = value;
    }
    setFormData((prev) => ({ ...prev, itinerary: newItinerary }));
  };

  const addItineraryDay = () => {
    setFormData((prev) => ({
      ...prev,
      itinerary: [
        ...prev.itinerary,
        { day: prev.itinerary.length + 1, title: "", highlights: [""] },
      ],
    }));
  };

  const addItineraryHighlight = (dayIndex: number) => {
    const newItinerary = [...formData.itinerary];
    newItinerary[dayIndex].highlights.push("");
    setFormData((prev) => ({ ...prev, itinerary: newItinerary }));
  };

  const removeItineraryHighlight = (dayIndex: number, highlightIndex: number) => {
    const newItinerary = [...formData.itinerary];
    newItinerary[dayIndex].highlights = newItinerary[dayIndex].highlights.filter(
      (_, i) => i !== highlightIndex
    );
    setFormData((prev) => ({ ...prev, itinerary: newItinerary }));
  };

  const handleDateChange = (
    index: number,
    field: "date" | "price" | "available",
    value: string | number
  ) => {
    const newDates = [...formData.dates];
    newDates[index] = { ...newDates[index], [field]: value };
    setFormData((prev) => ({ ...prev, dates: newDates }));
  };

  const addDate = () => {
    setFormData((prev) => ({
      ...prev,
      dates: [...prev.dates, { date: "", price: 0, available: 20 }],
    }));
  };

  const removeDate = (index: number) => {
    const newDates = formData.dates.filter((_, i) => i !== index);
    setFormData((prev) => ({ ...prev, dates: newDates }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Validate required fields
      if (!formData.name || !formData.destination || !formData.price) {
        toast({
          title: "Validation Error",
          description: "Please fill in all required fields",
          variant: "destructive",
        });
        setIsLoading(false);
        return;
      }

      if (!formData.tripCategory || !formData.tripType) {
        toast({
          title: "Validation Error",
          description: "Please select trip category and type",
          variant: "destructive",
        });
        setIsLoading(false);
        return;
      }

      const token = localStorage.getItem("adminToken");
      
      // Prepare form data for submission
      const submitData = new FormData();
      
      // Add image file if selected
      if (imageFile) {
        submitData.append('image', imageFile);
      } else if (formData.image) {
        submitData.append('image', formData.image);
      }

      // Add all other fields
      submitData.append('name', formData.name);
      submitData.append('destination', formData.destination);
      submitData.append('tripCategory', formData.tripCategory);
      submitData.append('tripType', formData.tripType);
      submitData.append('tripRoute', formData.tripRoute);
      submitData.append('duration', formData.duration);
      submitData.append('description', formData.description);
      submitData.append('price', formData.price);
      submitData.append('originalPrice', formData.originalPrice);
      submitData.append('status', formData.status);
      submitData.append('tags', formData.tags);
      submitData.append('hasGoodies', formData.hasGoodies.toString());
      submitData.append('inclusions', JSON.stringify(formData.inclusions.filter(i => i.trim())));
      submitData.append('exclusions', JSON.stringify(formData.exclusions.filter(i => i.trim())));
      submitData.append('notes', JSON.stringify(formData.notes.filter(i => i.trim())));
      submitData.append('itinerary', JSON.stringify(formData.itinerary));
      submitData.append('dates', JSON.stringify(formData.dates));

      let response;
      if (isEdit) {
        response = await axios.patch(`${API_URL}/trips/${id}`, submitData, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'multipart/form-data',
          },
        });
      } else {
        response = await axios.post(`${API_URL}/trips`, submitData, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'multipart/form-data',
          },
        });
      }

      if (response.data.status === 'success') {
        toast({
          title: isEdit ? "Trip updated" : "Trip created",
          description: `Trip has been ${isEdit ? "updated" : "created"} successfully and will appear on ${formData.tripRoute}`,
        });
        navigate("/admin/trips");
      }
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
      <div className="max-w-5xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate("/admin/trips")}
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
            <div>
              <h1 className="text-3xl font-display font-bold">
                {isEdit ? "Edit Trip" : "Create New Trip"}
              </h1>
              <p className="text-muted-foreground mt-1">
                {isEdit ? "Update trip details" : "Add a new trip package"}
              </p>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 border-b border-border overflow-x-auto">
          {tabs.map((tab, index) => (
            <button
              key={tab}
              onClick={() => setCurrentTab(index)}
              className={cn(
                "px-4 py-3 font-medium text-sm whitespace-nowrap transition-colors border-b-2 -mb-px",
                currentTab === index
                  ? "border-primary text-primary"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              )}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit}>
          <div className="bg-card rounded-xl border border-border p-6 space-y-6">
            {/* Basic Info Tab */}
            {currentTab === 0 && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Trip Name *
                    </label>
                    <Input
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      placeholder="e.g., Spiti Valley Winter Expedition"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Destination *
                    </label>
                    <Input
                      name="destination"
                      value={formData.destination}
                      onChange={handleInputChange}
                      placeholder="e.g., Spiti Valley, Himachal Pradesh"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Duration *
                    </label>
                    <Input
                      name="duration"
                      value={formData.duration}
                      onChange={handleInputChange}
                      placeholder="e.g., 7 Days / 6 Nights"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Status
                    </label>
                    <select
                      name="status"
                      value={formData.status}
                      onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value }))}
                      className="w-full px-3 py-2 rounded-md border border-input bg-background"
                    >
                      <option value="Active">Active</option>
                      <option value="Inactive">Inactive</option>
                      <option value="Draft">Draft</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Description *
                  </label>
                  <Textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    placeholder="Describe the trip in detail..."
                    rows={5}
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Trip Image *
                  </label>
                  <div className="flex items-center gap-4">
                    <Input
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="flex-1"
                    />
                    {formData.image && (
                      <img
                        src={formData.image}
                        alt="Preview"
                        className="w-20 h-20 object-cover rounded-md"
                      />
                    )}
                  </div>
                </div>

                <div>
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      name="hasGoodies"
                      checked={formData.hasGoodies}
                      onChange={handleInputChange}
                      className="rounded"
                    />
                    <span className="text-sm font-medium">Has Free Goodies</span>
                  </label>
                </div>
              </div>
            )}

            {/* Category & Type Tab */}
            {currentTab === 1 && (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Trip Category *
                  </label>
                  <select
                    value={selectedCategory}
                    onChange={(e) => handleCategoryChange(e.target.value)}
                    className="w-full px-3 py-2 rounded-md border border-input bg-background"
                    required
                  >
                    <option value="">Select Category</option>
                    {Object.entries(TRIP_CATEGORIES).map(([label, cat]) => (
                      <option key={cat.value} value={cat.value}>
                        {label}
                      </option>
                    ))}
                  </select>
                </div>

                {availableTypes.length > 0 && (
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Trip Type *
                    </label>
                    <select
                      value={formData.tripType}
                      onChange={(e) => handleTypeChange(e.target.value)}
                      className="w-full px-3 py-2 rounded-md border border-input bg-background"
                      required
                    >
                      <option value="">Select Type</option>
                      {availableTypes.map((type) => (
                        <option key={type.value} value={type.value}>
                          {type.label}
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                {formData.tripRoute && (
                  <div className="p-4 bg-muted rounded-lg">
                    <p className="text-sm text-muted-foreground">
                      This trip will appear on: <strong>{formData.tripRoute}</strong>
                    </p>
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Tags (comma-separated)
                  </label>
                  <Input
                    name="tags"
                    value={formData.tags}
                    onChange={handleInputChange}
                    placeholder="e.g., adventure, snow, mountain, winter"
                  />
                </div>
              </div>
            )}

            {/* Pricing Tab */}
            {currentTab === 2 && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Price *
                    </label>
                    <Input
                      type="number"
                      name="price"
                      value={formData.price}
                      onChange={handleInputChange}
                      placeholder="25000"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Original Price *
                    </label>
                    <Input
                      type="number"
                      name="originalPrice"
                      value={formData.originalPrice}
                      onChange={handleInputChange}
                      placeholder="35000"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Discount
                    </label>
                    <Input
                      type="number"
                      value={formData.originalPrice && formData.price 
                        ? parseInt(formData.originalPrice) - parseInt(formData.price)
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

            {/* Dates Tab */}
            {currentTab === 5 && (
              <div className="space-y-4">
                {formData.dates.map((dateItem, index) => (
                  <div key={index} className="flex gap-4 items-center">
                    <Input
                      type="date"
                      value={dateItem.date}
                      onChange={(e) => handleDateChange(index, "date", e.target.value)}
                    />
                    <Input
                      type="number"
                      value={dateItem.price}
                      onChange={(e) => handleDateChange(index, "price", parseInt(e.target.value))}
                      placeholder="Price"
                    />
                    <Input
                      type="number"
                      value={dateItem.available}
                      onChange={(e) => handleDateChange(index, "available", parseInt(e.target.value))}
                      placeholder="Available"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removeDate(index)}
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
                <Button type="button" variant="outline" onClick={addDate}>
                  <Plus className="w-4 h-4 mr-2" />
                  Add Date
                </Button>
              </div>
            )}
          </div>

          {/* Submit Buttons */}
          <div className="flex gap-4 justify-end mt-6">
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
        </form>
      </div>
    </AdminLayout>
  );
}