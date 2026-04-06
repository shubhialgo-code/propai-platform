"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { MapPin, BedDouble, Bath, Square, Heart, Share2, Shield, Calendar, Phone, Mail } from "lucide-react";
import axios from "axios";
import Navbar from "@/components/Navbar";

export default function PropertyDetail() {
  const { id } = useParams();
  const [property, setProperty] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchProperty = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/properties/${id}`);
        const p = response.data;
        // Parse JSON strings from SQLite
        setProperty({
          ...p,
          images: typeof p.images === "string" ? JSON.parse(p.images) : p.images,
          amenities: typeof p.amenities === "string" ? JSON.parse(p.amenities) : p.amenities,
        });
      } catch (error) {
        console.error("Error fetching property", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchProperty();
  }, [id]);

  if (isLoading) return <div className="p-10 text-center animate-pulse">Loading property details...</div>;
  if (!property) return <div className="p-10 text-center">Property not found.</div>;

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="container mx-auto px-4 py-8 md:px-8">
        {/* Header Section */}
        <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-extrabold text-slate-900">{property.title}</h1>
            <div className="mt-2 flex items-center gap-1 text-slate-500">
              <MapPin className="h-4 w-4" />
              <span>{property.location_city}, Hyderabad</span>
            </div>
          </div>
          <div className="flex items-center gap-3">
             <button className="flex h-10 w-10 items-center justify-center rounded-full border bg-white hover:bg-slate-50">
               <Share2 className="h-5 w-5 text-slate-600" />
             </button>
             <button className="flex h-10 w-10 items-center justify-center rounded-full border bg-white hover:bg-slate-50">
               <Heart className="h-5 w-5 text-slate-600 hover:text-red-500" />
             </button>
          </div>
        </div>

        {/* Gallery Placeholder */}
        <div className="mb-12 grid gap-4 md:grid-cols-4 md:grid-rows-2 h-[500px]">
          <div className="md:col-span-2 md:row-span-2 rounded-3xl bg-slate-200 overflow-hidden flex items-center justify-center text-slate-400 font-bold">Main Image</div>
          <div className="rounded-3xl bg-slate-200 flex items-center justify-center text-slate-400 font-bold">Image 2</div>
          <div className="rounded-3xl bg-slate-200 flex items-center justify-center text-slate-400 font-bold">Image 3</div>
          <div className="rounded-3xl bg-slate-200 flex items-center justify-center text-slate-400 font-bold">Image 4</div>
          <div className="rounded-3xl bg-slate-200 flex items-center justify-center text-slate-400 font-bold text-xs">View all (12)</div>
        </div>

        <div className="grid gap-8 lg:grid-cols-[1fr_380px]">
          {/* Main Content */}
          <div className="space-y-10">
            <div className="rounded-3xl border bg-white p-8 shadow-sm">
                <h2 className="mb-6 text-xl font-bold text-slate-900 border-b pb-4">Property Highlights</h2>
                <div className="grid grid-cols-2 gap-6 sm:grid-cols-4">
                  <div className="flex flex-col items-center gap-2 p-4 rounded-2xl bg-slate-50">
                    <BedDouble className="h-6 w-6 text-indigo-600" />
                    <span className="text-sm font-bold">{property.bedrooms} Bedrooms</span>
                  </div>
                  <div className="flex flex-col items-center gap-2 p-4 rounded-2xl bg-slate-50">
                    <Bath className="h-6 w-6 text-indigo-600" />
                    <span className="text-sm font-bold">{property.bathrooms} Bathrooms</span>
                  </div>
                  <div className="flex flex-col items-center gap-2 p-4 rounded-2xl bg-slate-50">
                    <Square className="h-6 w-6 text-indigo-600" />
                    <span className="text-sm font-bold">{property.area_sqft} Sqft</span>
                  </div>
                  <div className="flex flex-col items-center gap-2 p-4 rounded-2xl bg-slate-50">
                    <Shield className="h-6 w-6 text-indigo-600" />
                    <span className="text-sm font-bold">RERA Regd.</span>
                  </div>
                </div>
                
                <div className="mt-10">
                  <h3 className="mb-4 text-lg font-bold">Description</h3>
                  <p className="text-slate-600 leading-relaxed font-medium">
                    {property.description || "This stunning property offers a perfect blend of luxury and comfort. Situated in one of the most sought-after neighborhoods, it provides easy access to key business hubs, international schools, and premium healthcare facilities. Ideal for families looking for a modern lifestyle with state-of-the-art amenities."}
                  </p>
                </div>
            </div>

            <div className="rounded-3xl border bg-white p-8 shadow-sm">
               <h2 className="mb-6 text-xl font-bold text-slate-900">Amenities</h2>
               <div className="grid grid-cols-2 gap-y-4 gap-x-8 md:grid-cols-3">
                  {(Array.isArray(property.amenities) ? property.amenities : ["Swimming Pool", "Gymnasium", "24/7 Security", "Power Backup", "Clubhouse", "Gated Community"]).map((amenity: string) => (
                    <div key={amenity} className="flex items-center gap-3 text-sm font-medium text-slate-600">
                       <div className="h-1.5 w-1.5 rounded-full bg-indigo-500" />
                       {amenity}
                    </div>
                  ))}
               </div>
            </div>
          </div>

          {/* Pricing & Inquiry Sidebar */}
          <aside className="space-y-6">
            <div className="sticky top-24 rounded-3xl border bg-white p-8 shadow-xl">
               <div className="mb-6">
                  <span className="text-sm font-bold text-slate-500 uppercase tracking-widest">Pricing</span>
                  <div className="text-3xl font-extrabold text-indigo-600 mt-1">₹{(property.price / 100000).toFixed(2)} Lakh</div>
               </div>
               
               <div className="h-px bg-slate-100 my-6"></div>
               
               <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); alert('Inquiry sent! The seller will contact you soon.'); }}>
                  <h3 className="text-md font-bold text-slate-800">Interested? Ask for details</h3>
                  <div className="space-y-2">
                     <label className="text-xs font-bold text-slate-400 uppercase">Your Name</label>
                     <input required className="w-full border-b py-2 focus:border-indigo-600 outline-none text-sm transition-colors" placeholder="e.g. Rahul Sharma" />
                  </div>
                  <div className="space-y-2">
                     <label className="text-xs font-bold text-slate-400 uppercase">Email/Phone</label>
                     <input required className="w-full border-b py-2 focus:border-indigo-600 outline-none text-sm transition-colors" placeholder="you@example.com" />
                  </div>
                  <button type="submit" className="mt-4 w-full rounded-2xl bg-indigo-600 py-4 font-bold text-white shadow-lg transition-all hover:bg-indigo-700 active:scale-95 flex items-center justify-center gap-2">
                    <Mail className="h-5 w-5" /> Request Info
                  </button>
               </form>
               
               <div className="mt-8 pt-8 border-t space-y-4">
                  <div className="flex items-center gap-4">
                    <div className="h-12 w-12 rounded-full bg-slate-100 p-3 flex items-center justify-center font-bold text-indigo-600">SG</div>
                    <div>
                      <div className="text-sm font-bold">Property Owner</div>
                      <div className="text-xs text-slate-400">Verfied Seller</div>
                    </div>
                  </div>
                  <button onClick={() => alert('Call feature coming soon! You can use the inquiry form for now.')} className="w-full rounded-2xl border border-indigo-200 bg-indigo-50 py-3 text-sm font-bold text-indigo-600 hover:bg-indigo-100 transition-colors flex items-center justify-center gap-2">
                    <Phone className="h-4 w-4" /> Call Seller
                  </button>
               </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
