"use client";

import { useState } from "react";
import { Upload, Home, MapPin, IndianRupee, Bed, Bath, Square, Type } from "lucide-react";
import { propertyService } from "@/services/api.service";

export default function SubmitProperty() {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    price: "",
    location_city: "Hyderabad",
    bedrooms: "3",
    bathrooms: "2",
    area_sqft: "",
    property_type: "Apartment",
    ownerId: "5459b8b1-85ac-41a1-b1c7-ddfa11a57c99", // Valid owner ID from DB
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await propertyService.create({
        ...formData,
        price: parseFloat(formData.price),
        bedrooms: parseInt(formData.bedrooms),
        bathrooms: parseInt(formData.bathrooms),
        area_sqft: parseFloat(formData.area_sqft),
      });
      setSuccess(true);
    } catch (err: unknown) {
      const error = err as { response?: { data?: { error?: string } }; message: string };
      alert("Error submitting property: " + (error.response?.data?.error || error.message));
    } finally {
      setIsSubmitting(false);
    }
  };

  if (success) {
    return (
      <div className="container mx-auto max-w-2xl py-20 px-4 text-center">
        <div className="mb-6 inline-flex h-16 w-16 items-center justify-center rounded-full bg-green-100 text-green-600">
          <Home className="h-8 w-8" />
        </div>
        <h1 className="mb-4 text-3xl font-bold">Property Listed Successfully!</h1>
        <p className="mb-8 text-slate-600">Your property is now live and our AI will start recommending it to potential buyers.</p>
        <button onClick={() => setSuccess(false)} className="rounded-full bg-indigo-600 px-8 py-3 font-bold text-white hover:bg-indigo-700">
          List Another Property
        </button>
      </div>
    );
  }

  return (
    <div className="container mx-auto max-w-3xl py-12 px-4">
      <h1 className="mb-8 text-3xl font-bold text-slate-900 text-center">List Your Property</h1>
      
      <form onSubmit={handleSubmit} className="space-y-6 rounded-2xl border bg-white p-8 shadow-sm">
        <div className="grid gap-6 md:grid-cols-2">
          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700 flex items-center gap-1">
              <Type className="h-4 w-4" /> Title
            </label>
            <input
              required
              placeholder="e.g. Modern 3BHK Apartment"
              className="w-full rounded-xl border px-4 py-2 focus:ring-2 focus:ring-indigo-500 outline-none"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700 flex items-center gap-1">
              <IndianRupee className="h-4 w-4" /> Price (in ₹)
            </label>
            <input
              required
              type="number"
              placeholder="e.g. 7500000"
              className="w-full rounded-xl border px-4 py-2 focus:ring-2 focus:ring-indigo-500 outline-none"
              value={formData.price}
              onChange={(e) => setFormData({ ...formData, price: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700 flex items-center gap-1">
              <MapPin className="h-4 w-4" /> Location
            </label>
            <input
              required
              value={formData.location_city}
              className="w-full rounded-xl border px-4 py-2 bg-slate-50 outline-none text-slate-500"
              readOnly
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700 flex items-center gap-1">
               Property Type
            </label>
            <select
              className="w-full rounded-xl border px-4 py-2 focus:ring-2 focus:ring-indigo-500 outline-none h-[42px]"
              value={formData.property_type}
              onChange={(e) => setFormData({ ...formData, property_type: e.target.value })}
            >
              <option>Apartment</option>
              <option>Villa</option>
              <option>Independent House</option>
              <option>Plot</option>
            </select>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700 flex items-center gap-1">
              <Bed className="h-4 w-4" /> Bedrooms
            </label>
            <input
              type="number"
              className="w-full rounded-xl border px-4 py-2 focus:ring-2 focus:ring-indigo-500 outline-none"
              value={formData.bedrooms}
              onChange={(e) => setFormData({ ...formData, bedrooms: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700 flex items-center gap-1">
              <Bath className="h-4 w-4" /> Bathrooms
            </label>
            <input
              type="number"
              className="w-full rounded-xl border px-4 py-2 focus:ring-2 focus:ring-indigo-500 outline-none"
              value={formData.bathrooms}
              onChange={(e) => setFormData({ ...formData, bathrooms: e.target.value })}
            />
          </div>
          <div className="space-y-2 md:col-span-2">
            <label className="text-sm font-semibold text-slate-700 flex items-center gap-1">
              <Square className="h-4 w-4" /> Area (sqft)
            </label>
            <input
              required
              type="number"
              placeholder="e.g. 1500"
              className="w-full rounded-xl border px-4 py-2 focus:ring-2 focus:ring-indigo-500 outline-none"
              value={formData.area_sqft}
              onChange={(e) => setFormData({ ...formData, area_sqft: e.target.value })}
            />
          </div>
          <div className="space-y-2 md:col-span-2">
             <label className="text-sm font-semibold text-slate-700">Description</label>
             <textarea
               rows={4}
               className="w-full rounded-xl border px-4 py-2 focus:ring-2 focus:ring-indigo-500 outline-none resize-none"
               placeholder="Describe your property (amenities, nearby landmarks, etc.)"
               value={formData.description}
               onChange={(e) => setFormData({ ...formData, description: e.target.value })}
             />
          </div>
        </div>
        
        <div className="border-2 border-dashed rounded-2xl py-12 text-center text-slate-400 bg-slate-50">
          <Upload className="h-8 w-8 mx-auto mb-2" />
          <p className="text-sm font-medium">Click to upload images of your property</p>
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full rounded-xl bg-indigo-600 py-4 font-bold text-white hover:bg-indigo-700 disabled:opacity-50 transition-all shadow-lg active:scale-95"
        >
          {isSubmitting ? "Listing..." : "Submit Property Listing"}
        </button>
      </form>
    </div>
  );
}
