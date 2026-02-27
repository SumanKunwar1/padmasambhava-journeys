// src/pages/admin/AdminAgentTrips.tsx
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { agentTripsService, AgentTrip, CreateAgentTripData, OccupancyPrice } from "@/services/agentTrips";
import {
  Plus,
  Search,
  Edit,
  Trash2,
  Eye,
  X,
  Save,
  ImagePlus,
  Calendar,
  DollarSign,
  Percent,
  MapPin,
  Clock,
  Tag,
  Gift,
  Loader2,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";
import { toast } from "react-toastify";

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

const DEFAULT_OCCUPANCY_TYPES = [
  "Triple Sharing",
  "Double Sharing",
  "Single Occupancy",
  "Extra Bed",
];

const EMPTY_TRIP: Omit<CreateAgentTripData, "price" | "b2bPrice"> & {
  price: number;
  b2bPrice: number;
} = {
  name: "",
  destination: "",
  duration: "",
  description: "",
  price: 0,
  b2bPrice: 0,
  originalPrice: 0,
  discount: 0,
  commission: 0,
  image: "",
  inclusions: [],
  exclusions: [],
  notes: [],
  itinerary: [],
  dates: [],
  occupancyPricing: [],
  hasGoodies: false,
  tripCategory: "india-trips",
  tripType: "",
};

export default function AdminAgentTrips() {
  const [trips, setTrips] = useState<AgentTrip[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTrip, setEditingTrip] = useState<AgentTrip | null>(null);
  const [formData, setFormData] = useState<typeof EMPTY_TRIP>(EMPTY_TRIP);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [expandedSections, setExpandedSections] = useState({
    basic: true,
    pricing: true,
    occupancy: true,
    details: false,
    itinerary: false,
    dates: false,
  });

  // Temporary inputs for arrays
  const [inclusionInput, setInclusionInput] = useState("");
  const [exclusionInput, setExclusionInput] = useState("");
  const [noteInput, setNoteInput] = useState("");
  const [highlightInput, setHighlightInput] = useState("");
  const [currentDayIndex, setCurrentDayIndex] = useState<number | null>(null);

  useEffect(() => {
    fetchTrips();
  }, []);

  const fetchTrips = async () => {
    try {
      setLoading(true);
      const response = await agentTripsService.getAllTrips({ limit: 100 });
      
      if (response.status === 'success') {
        setTrips(response.data.trips);
      }
    } catch (error: any) {
      console.error('Error fetching trips:', error);
      toast.error(error.response?.data?.message || 'Failed to load trips');
    } finally {
      setLoading(false);
    }
  };

  const filteredTrips = trips.filter(
    (trip) =>
      trip.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      trip.destination.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleCreate = () => {
    setEditingTrip(null);
    setFormData(EMPTY_TRIP);
    setIsModalOpen(true);
  };

  const handleEdit = (trip: AgentTrip) => {
    setEditingTrip(trip);
    setFormData({
      name: trip.name,
      destination: trip.destination,
      duration: trip.duration,
      description: trip.description,
      price: trip.price,
      b2bPrice: trip.b2bPrice,
      originalPrice: trip.originalPrice,
      discount: trip.discount,
      commission: trip.commission,
      image: trip.image,
      inclusions: [...trip.inclusions],
      exclusions: [...trip.exclusions],
      notes: [...trip.notes],
      itinerary: [...trip.itinerary],
      dates: [...trip.dates],
      occupancyPricing: trip.occupancyPricing ? [...trip.occupancyPricing] : [],
      hasGoodies: trip.hasGoodies,
      tripCategory: trip.tripCategory,
      tripType: trip.tripType,
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this trip?")) {
      try {
        await agentTripsService.deleteTrip(id);
        setTrips(trips.filter((trip) => trip._id !== id));
        toast.success("Trip deleted successfully!");
      } catch (error: any) {
        console.error('Error deleting trip:', error);
        toast.error(error.response?.data?.message || 'Failed to delete trip');
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Validation
    if (!formData.name || !formData.destination || !formData.duration) {
      toast.error("Please fill all required fields");
      setIsSubmitting(false);
      return;
    }

    if (!formData.price || !formData.b2bPrice) {
      toast.error("Please provide both retail and B2B prices");
      setIsSubmitting(false);
      return;
    }

    try {
      if (editingTrip) {
        // Update existing trip
        const response = await agentTripsService.updateTrip(editingTrip._id, formData);
        
        if (response.status === 'success') {
          setTrips(
            trips.map((trip) =>
              trip._id === editingTrip._id ? response.data.trip : trip
            )
          );
          toast.success("Trip updated successfully!");
        }
      } else {
        // Create new trip
        const response = await agentTripsService.createTrip(formData as CreateAgentTripData);
        
        if (response.status === 'success') {
          setTrips([response.data.trip, ...trips]);
          toast.success("Trip created successfully!");
        }
      }

      setIsModalOpen(false);
      setFormData(EMPTY_TRIP);
      setEditingTrip(null);
    } catch (error: any) {
      console.error('Error saving trip:', error);
      toast.error(error.response?.data?.message || 'Failed to save trip. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const addInclusion = () => {
    if (inclusionInput.trim()) {
      setFormData({
        ...formData,
        inclusions: [...formData.inclusions, inclusionInput.trim()],
      });
      setInclusionInput("");
    }
  };

  const removeInclusion = (index: number) => {
    setFormData({
      ...formData,
      inclusions: formData.inclusions.filter((_, i) => i !== index),
    });
  };

  const addExclusion = () => {
    if (exclusionInput.trim()) {
      setFormData({
        ...formData,
        exclusions: [...formData.exclusions, exclusionInput.trim()],
      });
      setExclusionInput("");
    }
  };

  const removeExclusion = (index: number) => {
    setFormData({
      ...formData,
      exclusions: formData.exclusions.filter((_, i) => i !== index),
    });
  };

  const addNote = () => {
    if (noteInput.trim()) {
      setFormData({
        ...formData,
        notes: [...formData.notes, noteInput.trim()],
      });
      setNoteInput("");
    }
  };

  const removeNote = (index: number) => {
    setFormData({
      ...formData,
      notes: formData.notes.filter((_, i) => i !== index),
    });
  };

  const addItineraryDay = () => {
    const newDay: ItineraryDay = {
      day: formData.itinerary.length + 1,
      title: "",
      highlights: [],
    };
    setFormData({
      ...formData,
      itinerary: [...formData.itinerary, newDay],
    });
  };

  const updateItineraryDay = (index: number, field: string, value: string) => {
    const updated = [...formData.itinerary];
    updated[index] = { ...updated[index], [field]: value };
    setFormData({ ...formData, itinerary: updated });
  };

  const addHighlight = (dayIndex: number) => {
    if (highlightInput.trim()) {
      const updated = [...formData.itinerary];
      updated[dayIndex].highlights.push(highlightInput.trim());
      setFormData({ ...formData, itinerary: updated });
      setHighlightInput("");
      setCurrentDayIndex(null);
    }
  };

  const removeHighlight = (dayIndex: number, highlightIndex: number) => {
    const updated = [...formData.itinerary];
    updated[dayIndex].highlights = updated[dayIndex].highlights.filter(
      (_, i) => i !== highlightIndex
    );
    setFormData({ ...formData, itinerary: updated });
  };

  const removeItineraryDay = (index: number) => {
    setFormData({
      ...formData,
      itinerary: formData.itinerary.filter((_, i) => i !== index),
    });
  };

  const addDate = () => {
    const newDate: TripDate = {
      date: "",
      price: formData.price,
      available: 10,
    };
    setFormData({
      ...formData,
      dates: [...formData.dates, newDate],
    });
  };

  const updateDate = (
    index: number,
    field: keyof TripDate,
    value: string | number
  ) => {
    const updated = [...formData.dates];
    updated[index] = { ...updated[index], [field]: value };
    setFormData({ ...formData, dates: updated });
  };

  const removeDate = (index: number) => {
    setFormData({
      ...formData,
      dates: formData.dates.filter((_, i) => i !== index),
    });
  };

  const addOccupancyRow = () => {
    const usedTypes = (formData.occupancyPricing || []).map((o) => o.type);
    const nextType = DEFAULT_OCCUPANCY_TYPES.find((t) => !usedTypes.includes(t)) || "Custom";
    const newRow: OccupancyPrice = {
      type: nextType,
      b2bPrice: formData.b2bPrice || 0,
      retailPrice: formData.price || 0,
      isSupplementary: nextType === "Extra Bed",
    };
    setFormData({ ...formData, occupancyPricing: [...(formData.occupancyPricing || []), newRow] });
  };

  const updateOccupancyRow = (index: number, field: keyof OccupancyPrice, value: string | number | boolean) => {
    const updated = [...(formData.occupancyPricing || [])];
    updated[index] = { ...updated[index], [field]: value };
    setFormData({ ...formData, occupancyPricing: updated });
  };

  const removeOccupancyRow = (index: number) => {
    setFormData({
      ...formData,
      occupancyPricing: (formData.occupancyPricing || []).filter((_, i) => i !== index),
    });
  };

  // Auto-calculate commission percentage when prices change
  useEffect(() => {
    if (formData.price > 0 && formData.b2bPrice > 0) {
      const commissionPercent = Math.round(
        ((formData.price - formData.b2bPrice) / formData.price) * 100
      );
      setFormData((prev) => ({ ...prev, commission: commissionPercent }));
    }
  }, [formData.price, formData.b2bPrice]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-md border border-slate-200 p-6 mb-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-display font-bold text-foreground mb-2">
                Agent Trips Management
              </h1>
              <p className="text-muted-foreground">
                Manage B2B trips for travel agents
              </p>
            </div>
            <Button
              onClick={handleCreate}
              className="gap-2 shadow-lg hover:shadow-xl"
            >
              <Plus className="w-5 h-5" />
              Add New Trip
            </Button>
          </div>

          {/* Search */}
          <div className="mt-6 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input
              placeholder="Search trips by name or destination..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 h-12"
            />
          </div>
        </div>

        {/* Trips List */}
        <div className="bg-white rounded-xl shadow-md border border-slate-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-100 border-b border-slate-200">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">
                    Trip Details
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">
                    Destination
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">
                    B2B Price
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">
                    Retail Price
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">
                    Commission
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">
                    Dates
                  </th>
                  <th className="px-6 py-4 text-right text-sm font-semibold text-foreground">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {filteredTrips.map((trip) => (
                  <tr key={trip._id} className="hover:bg-slate-50">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-4">
                        <img
                          src={trip.image}
                          alt={trip.name}
                          className="w-16 h-16 rounded-lg object-cover"
                        />
                        <div>
                          <p className="font-semibold text-foreground line-clamp-1">
                            {trip.name}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {trip.duration}
                          </p>
                          {trip.hasGoodies && (
                            <span className="inline-flex items-center gap-1 text-xs bg-accent/20 text-accent-foreground px-2 py-0.5 rounded-full mt-1">
                              <Gift className="w-3 h-3" />
                              Goodies
                            </span>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <MapPin className="w-4 h-4" />
                        {trip.destination}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <p className="font-semibold text-primary">
                        ₹{trip.b2bPrice.toLocaleString()}
                      </p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="font-medium">
                        ₹{trip.price.toLocaleString()}
                      </p>
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center gap-1 bg-green-100 text-green-700 px-2 py-1 rounded-full text-sm font-medium">
                        <Percent className="w-3 h-3" />
                        {trip.commission}%
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm text-muted-foreground">
                        {trip.dates.length} departure{trip.dates.length > 1 ? "s" : ""}
                      </p>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          onClick={() => handleEdit(trip)}
                          variant="ghost"
                          size="sm"
                          className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          onClick={() => handleDelete(trip._id)}
                          variant="ghost"
                          size="sm"
                          className="text-red-600 hover:text-red-700 hover:bg-red-50"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {filteredTrips.length === 0 && (
              <div className="text-center py-12">
                <p className="text-muted-foreground">No trips found</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Create/Edit Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => !isSubmitting && setIsModalOpen(false)}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
            />

            {/* Modal */}
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="pointer-events-auto w-full max-w-4xl max-h-[90vh] bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col"
              >
                {/* Modal Header */}
                <div className="flex items-center justify-between p-6 border-b border-slate-200 shrink-0">
                  <h2 className="text-2xl font-display font-bold text-foreground">
                    {editingTrip ? "Edit Trip" : "Add New Trip"}
                  </h2>
                  <button
                    onClick={() => !isSubmitting && setIsModalOpen(false)}
                    className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
                    disabled={isSubmitting}
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>

                {/* Modal Content - Scrollable */}
                <div className="flex-1 overflow-y-auto p-6">
                  <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Basic Information */}
                    <div className="bg-slate-50 rounded-lg p-4">
                      <button
                        type="button"
                        onClick={() => toggleSection("basic")}
                        className="flex items-center justify-between w-full mb-4"
                      >
                        <h3 className="text-lg font-semibold text-foreground">
                          Basic Information
                        </h3>
                        {expandedSections.basic ? (
                          <ChevronUp className="w-5 h-5" />
                        ) : (
                          <ChevronDown className="w-5 h-5" />
                        )}
                      </button>

                      {expandedSections.basic && (
                        <div className="space-y-4">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <Label htmlFor="name">
                                Trip Name <span className="text-red-500">*</span>
                              </Label>
                              <Input
                                id="name"
                                value={formData.name}
                                onChange={(e) =>
                                  setFormData({ ...formData, name: e.target.value })
                                }
                                placeholder="Enter trip name"
                                required
                              />
                            </div>
                            <div>
                              <Label htmlFor="destination">
                                Destination <span className="text-red-500">*</span>
                              </Label>
                              <Input
                                id="destination"
                                value={formData.destination}
                                onChange={(e) =>
                                  setFormData({
                                    ...formData,
                                    destination: e.target.value,
                                  })
                                }
                                placeholder="E.g., Bhutan, Nepal"
                                required
                              />
                            </div>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <Label htmlFor="duration">
                                Duration <span className="text-red-500">*</span>
                              </Label>
                              <Input
                                id="duration"
                                value={formData.duration}
                                onChange={(e) =>
                                  setFormData({ ...formData, duration: e.target.value })
                                }
                                placeholder="E.g., 6 Days / 5 Nights"
                                required
                              />
                            </div>
                            <div>
                              <Label htmlFor="image">Image URL</Label>
                              <Input
                                id="image"
                                value={formData.image}
                                onChange={(e) =>
                                  setFormData({ ...formData, image: e.target.value })
                                }
                                placeholder="https://example.com/image.jpg"
                              />
                            </div>
                          </div>

                          <div>
                            <Label htmlFor="description">Description</Label>
                            <Textarea
                              id="description"
                              value={formData.description}
                              onChange={(e) =>
                                setFormData({
                                  ...formData,
                                  description: e.target.value,
                                })
                              }
                              placeholder="Enter trip description"
                              rows={3}
                            />
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <Label htmlFor="tripCategory">Trip Category</Label>
                              <select
                                id="tripCategory"
                                value={formData.tripCategory}
                                onChange={(e) =>
                                  setFormData({
                                    ...formData,
                                    tripCategory: e.target.value,
                                  })
                                }
                                className="w-full h-10 px-3 rounded-md border border-input bg-background"
                              >
                                <option value="india-trips">India Trips</option>
                                <option value="travel-styles">Travel Styles</option>
                                <option value="international">International</option>
                              </select>
                            </div>
                            <div>
                              <Label htmlFor="tripType">Trip Type</Label>
                              <Input
                                id="tripType"
                                value={formData.tripType}
                                onChange={(e) =>
                                  setFormData({ ...formData, tripType: e.target.value })
                                }
                                placeholder="E.g., pilgrimage, adventure"
                              />
                            </div>
                          </div>

                          <div className="flex items-center gap-2">
                            <Checkbox
                              id="hasGoodies"
                              checked={formData.hasGoodies}
                              onCheckedChange={(checked) =>
                                setFormData({
                                  ...formData,
                                  hasGoodies: checked as boolean,
                                })
                              }
                            />
                            <Label htmlFor="hasGoodies" className="cursor-pointer">
                              Include Free Goodies
                            </Label>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Pricing Information */}
                    <div className="bg-slate-50 rounded-lg p-4">
                      <button
                        type="button"
                        onClick={() => toggleSection("pricing")}
                        className="flex items-center justify-between w-full mb-4"
                      >
                        <h3 className="text-lg font-semibold text-foreground">
                          Pricing Information
                        </h3>
                        {expandedSections.pricing ? (
                          <ChevronUp className="w-5 h-5" />
                        ) : (
                          <ChevronDown className="w-5 h-5" />
                        )}
                      </button>

                      {expandedSections.pricing && (
                        <div className="space-y-4">
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div>
                              <Label htmlFor="b2bPrice">
                                B2B Price (Agent Cost){" "}
                                <span className="text-red-500">*</span>
                              </Label>
                              <Input
                                id="b2bPrice"
                                type="number"
                                value={formData.b2bPrice}
                                onChange={(e) =>
                                  setFormData({
                                    ...formData,
                                    b2bPrice: Number(e.target.value),
                                  })
                                }
                                placeholder="38000"
                                required
                              />
                            </div>
                            <div>
                              <Label htmlFor="price">
                                Retail Price <span className="text-red-500">*</span>
                              </Label>
                              <Input
                                id="price"
                                type="number"
                                value={formData.price}
                                onChange={(e) =>
                                  setFormData({
                                    ...formData,
                                    price: Number(e.target.value),
                                  })
                                }
                                placeholder="45000"
                                required
                              />
                            </div>
                            <div>
                              <Label htmlFor="originalPrice">Original Price</Label>
                              <Input
                                id="originalPrice"
                                type="number"
                                value={formData.originalPrice}
                                onChange={(e) =>
                                  setFormData({
                                    ...formData,
                                    originalPrice: Number(e.target.value),
                                  })
                                }
                                placeholder="55000"
                              />
                            </div>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <Label htmlFor="discount">Discount Amount</Label>
                              <Input
                                id="discount"
                                type="number"
                                value={formData.discount}
                                onChange={(e) =>
                                  setFormData({
                                    ...formData,
                                    discount: Number(e.target.value),
                                  })
                                }
                                placeholder="10000"
                              />
                            </div>
                            <div>
                              <Label htmlFor="commission">
                                Commission % (Auto-calculated)
                              </Label>
                              <Input
                                id="commission"
                                type="number"
                                value={formData.commission}
                                readOnly
                                className="bg-slate-100"
                              />
                            </div>
                          </div>

                          {formData.price > 0 && formData.b2bPrice > 0 && (
                            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                              <p className="text-sm text-green-800">
                                <strong>Agent Earning:</strong> ₹
                                {(formData.price - formData.b2bPrice).toLocaleString()}{" "}
                                per booking
                              </p>
                            </div>
                          )}
                        </div>
                      )}
                    </div>

                    {/* Occupancy Pricing */}
                    <div className="bg-slate-50 rounded-lg p-4">
                      <button
                        type="button"
                        onClick={() => toggleSection("occupancy")}
                        className="flex items-center justify-between w-full mb-4"
                      >
                        <div>
                          <h3 className="text-lg font-semibold text-foreground text-left">
                            Occupancy Pricing
                          </h3>
                          <p className="text-xs text-muted-foreground text-left mt-0.5">
                            Set specific B2B &amp; retail prices per room/bed type
                          </p>
                        </div>
                        {expandedSections.occupancy ? (
                          <ChevronUp className="w-5 h-5 shrink-0" />
                        ) : (
                          <ChevronDown className="w-5 h-5 shrink-0" />
                        )}
                      </button>

                      {expandedSections.occupancy && (
                        <div className="space-y-3">
                          <Button
                            type="button"
                            onClick={addOccupancyRow}
                            variant="outline"
                            className="w-full"
                          >
                            <Plus className="w-4 h-4 mr-2" />
                            Add Occupancy Type
                          </Button>

                          {(formData.occupancyPricing || []).length === 0 && (
                            <p className="text-sm text-center text-muted-foreground py-3 bg-white rounded-lg border border-dashed border-slate-300">
                              No occupancy pricing added. Click above to add types like Triple Sharing, Double Sharing, etc.
                            </p>
                          )}

                          {(formData.occupancyPricing || []).map((row, idx) => (
                            <div key={idx} className="bg-white rounded-lg p-4 border border-slate-200">
                              <div className="flex items-center justify-between mb-3">
                                <span className="text-sm font-semibold text-foreground">
                                  Occupancy {idx + 1}
                                </span>
                                <button
                                  type="button"
                                  onClick={() => removeOccupancyRow(idx)}
                                  className="text-red-500 hover:text-red-700"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>

                              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
                                <div>
                                  <Label className="text-sm">Type Name</Label>
                                  <select
                                    value={row.type}
                                    onChange={(e) => updateOccupancyRow(idx, "type", e.target.value)}
                                    className="w-full h-10 px-3 rounded-md border border-input bg-background text-sm mt-1"
                                  >
                                    {DEFAULT_OCCUPANCY_TYPES.map((t) => (
                                      <option key={t} value={t}>{t}</option>
                                    ))}
                                    <option value="Custom">Custom...</option>
                                  </select>
                                </div>
                                <div className="flex items-end gap-2">
                                  <label className="flex items-center gap-2 cursor-pointer mt-5">
                                    <input
                                      type="checkbox"
                                      checked={row.isSupplementary}
                                      onChange={(e) => updateOccupancyRow(idx, "isSupplementary", e.target.checked)}
                                      className="w-4 h-4 rounded border-slate-300"
                                    />
                                    <span className="text-sm text-muted-foreground">Mark as Supplementary</span>
                                  </label>
                                </div>
                              </div>

                              {row.type === "Custom" && (
                                <div className="mb-3">
                                  <Label className="text-sm">Custom Type Name</Label>
                                  <Input
                                    value={row.type === "Custom" ? "" : row.type}
                                    onChange={(e) => updateOccupancyRow(idx, "type", e.target.value)}
                                    placeholder="E.g., Family Room"
                                    className="mt-1"
                                  />
                                </div>
                              )}

                              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                <div>
                                  <Label className="text-sm">B2B Price (Agent Cost) ₹</Label>
                                  <Input
                                    type="number"
                                    value={row.b2bPrice}
                                    onChange={(e) => updateOccupancyRow(idx, "b2bPrice", Number(e.target.value))}
                                    placeholder="0"
                                    className="mt-1"
                                  />
                                </div>
                                <div>
                                  <Label className="text-sm">Retail Price (Selling Price) ₹</Label>
                                  <Input
                                    type="number"
                                    value={row.retailPrice}
                                    onChange={(e) => updateOccupancyRow(idx, "retailPrice", Number(e.target.value))}
                                    placeholder="0"
                                    className="mt-1"
                                  />
                                </div>
                              </div>

                              {row.b2bPrice > 0 && row.retailPrice > 0 && (
                                <div className="mt-3 bg-green-50 rounded-md px-3 py-2 text-sm text-green-800">
                                  Agent earns <strong>₹{(row.retailPrice - row.b2bPrice).toLocaleString()}</strong> per person for {row.type}
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Inclusions & Exclusions */}
                    <div className="bg-slate-50 rounded-lg p-4">
                      <button
                        type="button"
                        onClick={() => toggleSection("details")}                        className="flex items-center justify-between w-full mb-4"
                      >
                        <h3 className="text-lg font-semibold text-foreground">
                          Inclusions, Exclusions & Notes
                        </h3>
                        {expandedSections.details ? (
                          <ChevronUp className="w-5 h-5" />
                        ) : (
                          <ChevronDown className="w-5 h-5" />
                        )}
                      </button>

                      {expandedSections.details && (
                        <div className="space-y-4">
                          {/* Inclusions */}
                          <div>
                            <Label>Inclusions</Label>
                            <div className="flex gap-2 mt-2">
                              <Input
                                value={inclusionInput}
                                onChange={(e) => setInclusionInput(e.target.value)}
                                placeholder="Add inclusion"
                                onKeyPress={(e) => {
                                  if (e.key === "Enter") {
                                    e.preventDefault();
                                    addInclusion();
                                  }
                                }}
                              />
                              <Button
                                type="button"
                                onClick={addInclusion}
                                variant="outline"
                              >
                                <Plus className="w-4 h-4" />
                              </Button>
                            </div>
                            <div className="flex flex-wrap gap-2 mt-2">
                              {formData.inclusions.map((item, index) => (
                                <span
                                  key={index}
                                  className="inline-flex items-center gap-1 bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm"
                                >
                                  {item}
                                  <button
                                    type="button"
                                    onClick={() => removeInclusion(index)}
                                    className="hover:text-green-900"
                                  >
                                    <X className="w-3 h-3" />
                                  </button>
                                </span>
                              ))}
                            </div>
                          </div>

                          {/* Exclusions */}
                          <div>
                            <Label>Exclusions</Label>
                            <div className="flex gap-2 mt-2">
                              <Input
                                value={exclusionInput}
                                onChange={(e) => setExclusionInput(e.target.value)}
                                placeholder="Add exclusion"
                                onKeyPress={(e) => {
                                  if (e.key === "Enter") {
                                    e.preventDefault();
                                    addExclusion();
                                  }
                                }}
                              />
                              <Button
                                type="button"
                                onClick={addExclusion}
                                variant="outline"
                              >
                                <Plus className="w-4 h-4" />
                              </Button>
                            </div>
                            <div className="flex flex-wrap gap-2 mt-2">
                              {formData.exclusions.map((item, index) => (
                                <span
                                  key={index}
                                  className="inline-flex items-center gap-1 bg-red-100 text-red-800 px-3 py-1 rounded-full text-sm"
                                >
                                  {item}
                                  <button
                                    type="button"
                                    onClick={() => removeExclusion(index)}
                                    className="hover:text-red-900"
                                  >
                                    <X className="w-3 h-3" />
                                  </button>
                                </span>
                              ))}
                            </div>
                          </div>

                          {/* Notes */}
                          <div>
                            <Label>Important Notes</Label>
                            <div className="flex gap-2 mt-2">
                              <Input
                                value={noteInput}
                                onChange={(e) => setNoteInput(e.target.value)}
                                placeholder="Add note"
                                onKeyPress={(e) => {
                                  if (e.key === "Enter") {
                                    e.preventDefault();
                                    addNote();
                                  }
                                }}
                              />
                              <Button type="button" onClick={addNote} variant="outline">
                                <Plus className="w-4 h-4" />
                              </Button>
                            </div>
                            <div className="space-y-2 mt-2">
                              {formData.notes.map((note, index) => (
                                <div
                                  key={index}
                                  className="flex items-center justify-between bg-blue-50 px-3 py-2 rounded-lg"
                                >
                                  <span className="text-sm text-blue-900">{note}</span>
                                  <button
                                    type="button"
                                    onClick={() => removeNote(index)}
                                    className="text-blue-700 hover:text-blue-900"
                                  >
                                    <X className="w-4 h-4" />
                                  </button>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Itinerary */}
                    <div className="bg-slate-50 rounded-lg p-4">
                      <button
                        type="button"
                        onClick={() => toggleSection("itinerary")}
                        className="flex items-center justify-between w-full mb-4"
                      >
                        <h3 className="text-lg font-semibold text-foreground">
                          Itinerary
                        </h3>
                        {expandedSections.itinerary ? (
                          <ChevronUp className="w-5 h-5" />
                        ) : (
                          <ChevronDown className="w-5 h-5" />
                        )}
                      </button>

                      {expandedSections.itinerary && (
                        <div className="space-y-4">
                          <Button
                            type="button"
                            onClick={addItineraryDay}
                            variant="outline"
                            className="w-full"
                          >
                            <Plus className="w-4 h-4 mr-2" />
                            Add Day
                          </Button>

                          {formData.itinerary.map((day, dayIndex) => (
                            <div
                              key={dayIndex}
                              className="bg-white rounded-lg p-4 border border-slate-200"
                            >
                              <div className="flex items-center justify-between mb-3">
                                <span className="font-semibold text-foreground">
                                  Day {day.day}
                                </span>
                                <button
                                  type="button"
                                  onClick={() => removeItineraryDay(dayIndex)}
                                  className="text-red-600 hover:text-red-700"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>

                              <Input
                                value={day.title}
                                onChange={(e) =>
                                  updateItineraryDay(dayIndex, "title", e.target.value)
                                }
                                placeholder="Day title"
                                className="mb-3"
                              />

                              <div>
                                <Label className="text-sm">Highlights</Label>
                                <div className="flex gap-2 mt-2">
                                  <Input
                                    value={
                                      currentDayIndex === dayIndex
                                        ? highlightInput
                                        : ""
                                    }
                                    onChange={(e) => {
                                      setHighlightInput(e.target.value);
                                      setCurrentDayIndex(dayIndex);
                                    }}
                                    placeholder="Add highlight"
                                    onKeyPress={(e) => {
                                      if (e.key === "Enter") {
                                        e.preventDefault();
                                        addHighlight(dayIndex);
                                      }
                                    }}
                                  />
                                  <Button
                                    type="button"
                                    onClick={() => addHighlight(dayIndex)}
                                    variant="outline"
                                    size="sm"
                                  >
                                    <Plus className="w-4 h-4" />
                                  </Button>
                                </div>
                                <ul className="space-y-1 mt-2">
                                  {day.highlights.map((highlight, hIndex) => (
                                    <li
                                      key={hIndex}
                                      className="flex items-center justify-between bg-slate-50 px-2 py-1 rounded text-sm"
                                    >
                                      <span>• {highlight}</span>
                                      <button
                                        type="button"
                                        onClick={() =>
                                          removeHighlight(dayIndex, hIndex)
                                        }
                                        className="text-red-600 hover:text-red-700"
                                      >
                                        <X className="w-3 h-3" />
                                      </button>
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Departure Dates */}
                    <div className="bg-slate-50 rounded-lg p-4">
                      <button
                        type="button"
                        onClick={() => toggleSection("dates")}
                        className="flex items-center justify-between w-full mb-4"
                      >
                        <h3 className="text-lg font-semibold text-foreground">
                          Departure Dates
                        </h3>
                        {expandedSections.dates ? (
                          <ChevronUp className="w-5 h-5" />
                        ) : (
                          <ChevronDown className="w-5 h-5" />
                        )}
                      </button>

                      {expandedSections.dates && (
                        <div className="space-y-4">
                          <Button
                            type="button"
                            onClick={addDate}
                            variant="outline"
                            className="w-full"
                          >
                            <Plus className="w-4 h-4 mr-2" />
                            Add Departure Date
                          </Button>

                          {formData.dates.map((date, dateIndex) => (
                            <div
                              key={dateIndex}
                              className="bg-white rounded-lg p-4 border border-slate-200"
                            >
                              <div className="flex items-center justify-between mb-3">
                                <span className="font-semibold text-foreground">
                                  Date {dateIndex + 1}
                                </span>
                                <button
                                  type="button"
                                  onClick={() => removeDate(dateIndex)}
                                  className="text-red-600 hover:text-red-700"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>

                              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                                <div>
                                  <Label className="text-sm">Date</Label>
                                  <Input
                                    type="date"
                                    value={date.date}
                                    onChange={(e) =>
                                      updateDate(dateIndex, "date", e.target.value)
                                    }
                                  />
                                </div>
                                <div>
                                  <Label className="text-sm">Price</Label>
                                  <Input
                                    type="number"
                                    value={date.price}
                                    onChange={(e) =>
                                      updateDate(
                                        dateIndex,
                                        "price",
                                        Number(e.target.value)
                                      )
                                    }
                                  />
                                </div>
                                <div>
                                  <Label className="text-sm">Available Seats</Label>
                                  <Input
                                    type="number"
                                    value={date.available}
                                    onChange={(e) =>
                                      updateDate(
                                        dateIndex,
                                        "available",
                                        Number(e.target.value)
                                      )
                                    }
                                  />
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </form>
                </div>

                {/* Modal Footer */}
                <div className="border-t border-slate-200 p-6 shrink-0 bg-white">
                  <div className="flex items-center justify-end gap-3">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => !isSubmitting && setIsModalOpen(false)}
                      disabled={isSubmitting}
                    >
                      Cancel
                    </Button>
                    <Button
                      onClick={handleSubmit}
                      disabled={isSubmitting}
                      className="gap-2"
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          Saving...
                        </>
                      ) : (
                        <>
                          <Save className="w-4 h-4" />
                          {editingTrip ? "Update Trip" : "Create Trip"}
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              </motion.div>
            </div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}