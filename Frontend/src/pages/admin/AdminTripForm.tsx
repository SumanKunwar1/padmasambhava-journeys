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

export default function AdminTripForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const isEdit = Boolean(id);

  const [formData, setFormData] = useState({
    name: "",
    destination: "",
    category: "Domestic",
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
  });

  const [currentTab, setCurrentTab] = useState(0);

  const tabs = ["Basic Info", "Pricing", "Itinerary", "Inclusions", "Dates"];

  useEffect(() => {
    if (isEdit) {
      // Load trip data for editing
      // This would typically come from an API
      setFormData({
        name: "Spiti Valley Winter Expedition",
        destination: "Spiti Valley",
        category: "Domestic",
        duration: "7 Days / 6 Nights",
        description: "Experience the winter wonderland of Spiti Valley...",
        price: "25000",
        originalPrice: "35000",
        discount: "10000",
        status: "Active",
        image: "",
        inclusions: ["Accommodation", "Meals", "Transport"],
        exclusions: ["Flight tickets", "Personal expenses"],
        notes: ["Carry warm clothes", "Valid ID required"],
        itinerary: [
          {
            day: 1,
            title: "Arrival in Shimla",
            highlights: ["Pick up from airport", "Hotel check-in"],
          },
        ],
        dates: [{ date: "2026-03-15", price: 25000, available: 20 }],
      });
    }
  }, [id, isEdit]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleArrayChange = (
    field: "inclusions" | "exclusions" | "notes",
    index: number,
    value: string
  ) => {
    const newArray = [...formData[field]];
    newArray[index] = value;
    setFormData((prev) => ({ ...prev, [field]: newArray }));
  };

  const addArrayItem = (field: "inclusions" | "exclusions" | "notes") => {
    setFormData((prev) => ({
      ...prev,
      [field]: [...prev[field], ""],
    }));
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

    try {
      // Validate required fields
      if (!formData.name || !formData.destination || !formData.price) {
        toast({
          title: "Validation Error",
          description: "Please fill in all required fields",
          variant: "destructive",
        });
        return;
      }

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      toast({
        title: isEdit ? "Trip updated" : "Trip created",
        description: `Trip has been ${isEdit ? "updated" : "created"} successfully`,
      });

      navigate("/admin/trips");
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save trip",
        variant: "destructive",
      });
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
          <div className="bg-card rounded-xl border border-border p-6">
            {/* Basic Info Tab */}
            {currentTab === 0 && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Trip Name *
                    </label>
                    <Input
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      placeholder="e.g., Spiti Valley Adventure"
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
                      placeholder="e.g., Spiti Valley"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Category *
                    </label>
                    <select
                      name="category"
                      value={formData.category}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 rounded-lg border border-border bg-background"
                      required
                    >
                      <option value="Domestic">Domestic</option>
                      <option value="International">International</option>
                      <option value="Pilgrimage">Pilgrimage</option>
                      <option value="Weekend">Weekend</option>
                      <option value="Retreat">Retreat</option>
                    </select>
                  </div>
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
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 rounded-lg border border-border bg-background"
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
                    placeholder="Describe the trip..."
                    rows={4}
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Trip Image
                  </label>
                  <div className="border-2 border-dashed border-border rounded-lg p-6 text-center">
                    <Upload className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
                    <p className="text-sm font-medium">Click to upload image</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      PNG, JPG up to 5MB
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Pricing Tab */}
            {currentTab === 1 && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Base Price *
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
                      Original Price
                    </label>
                    <Input
                      type="number"
                      name="originalPrice"
                      value={formData.originalPrice}
                      onChange={handleInputChange}
                      placeholder="35000"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Discount Amount
                    </label>
                    <Input
                      type="number"
                      name="discount"
                      value={formData.discount}
                      onChange={handleInputChange}
                      placeholder="10000"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Itinerary Tab */}
            {currentTab === 2 && (
              <div className="space-y-4">
                {formData.itinerary.map((day, dayIndex) => (
                  <div
                    key={dayIndex}
                    className="border border-border rounded-lg p-4 space-y-3"
                  >
                    <div className="flex items-center gap-4">
                      <span className="font-semibold">Day {day.day}</span>
                      <Input
                        value={day.title}
                        onChange={(e) =>
                          handleItineraryChange(dayIndex, "title", e.target.value)
                        }
                        placeholder="Day title"
                        className="flex-1"
                      />
                    </div>
                    <div className="space-y-2 ml-16">
                      {day.highlights.map((highlight, highlightIndex) => (
                        <div key={highlightIndex} className="flex gap-2">
                          <Input
                            value={highlight}
                            onChange={(e) =>
                              handleItineraryChange(
                                dayIndex,
                                "highlights",
                                e.target.value,
                                highlightIndex
                              )
                            }
                            placeholder="Highlight"
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() =>
                              removeItineraryHighlight(dayIndex, highlightIndex)
                            }
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
            {currentTab === 3 && (
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium mb-3">
                    Inclusions
                  </label>
                  <div className="space-y-2">
                    {formData.inclusions.map((item, index) => (
                      <div key={index} className="flex gap-2">
                        <Input
                          value={item}
                          onChange={(e) =>
                            handleArrayChange("inclusions", index, e.target.value)
                          }
                          placeholder="What's included"
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
                </div>

                <div>
                  <label className="block text-sm font-medium mb-3">
                    Exclusions
                  </label>
                  <div className="space-y-2">
                    {formData.exclusions.map((item, index) => (
                      <div key={index} className="flex gap-2">
                        <Input
                          value={item}
                          onChange={(e) =>
                            handleArrayChange("exclusions", index, e.target.value)
                          }
                          placeholder="What's not included"
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
                </div>

                <div>
                  <label className="block text-sm font-medium mb-3">Notes</label>
                  <div className="space-y-2">
                    {formData.notes.map((item, index) => (
                      <div key={index} className="flex gap-2">
                        <Input
                          value={item}
                          onChange={(e) =>
                            handleArrayChange("notes", index, e.target.value)
                          }
                          placeholder="Important note"
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
              </div>
            )}

            {/* Dates Tab */}
            {currentTab === 4 && (
              <div className="space-y-4">
                {formData.dates.map((date, index) => (
                  <div
                    key={index}
                    className="border border-border rounded-lg p-4 flex gap-4"
                  >
                    <div className="flex-1">
                      <label className="block text-sm font-medium mb-2">Date</label>
                      <Input
                        type="date"
                        value={date.date}
                        onChange={(e) =>
                          handleDateChange(index, "date", e.target.value)
                        }
                      />
                    </div>
                    <div className="flex-1">
                      <label className="block text-sm font-medium mb-2">
                        Price
                      </label>
                      <Input
                        type="number"
                        value={date.price}
                        onChange={(e) =>
                          handleDateChange(index, "price", Number(e.target.value))
                        }
                      />
                    </div>
                    <div className="flex-1">
                      <label className="block text-sm font-medium mb-2">
                        Available Seats
                      </label>
                      <Input
                        type="number"
                        value={date.available}
                        onChange={(e) =>
                          handleDateChange(
                            index,
                            "available",
                            Number(e.target.value)
                          )
                        }
                      />
                    </div>
                    <div className="flex items-end">
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeDate(index)}
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))}
                <Button type="button" variant="outline" onClick={addDate}>
                  <Plus className="w-4 h-4 mr-2" />
                  Add Date
                </Button>
              </div>
            )}
          </div>

          {/* Navigation */}
          <div className="flex items-center justify-between mt-6">
            <Button
              type="button"
              variant="outline"
              onClick={() => setCurrentTab(Math.max(0, currentTab - 1))}
              disabled={currentTab === 0}
            >
              Previous
            </Button>
            <div className="flex gap-2">
              {currentTab === tabs.length - 1 ? (
                <Button type="submit">
                  <Save className="w-4 h-4 mr-2" />
                  {isEdit ? "Update Trip" : "Create Trip"}
                </Button>
              ) : (
                <Button
                  type="button"
                  onClick={() => setCurrentTab(Math.min(tabs.length - 1, currentTab + 1))}
                >
                  Next
                </Button>
              )}
            </div>
          </div>
        </form>
      </div>
    </AdminLayout>
  );
}