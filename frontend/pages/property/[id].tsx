"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { ArrowLeft, MapPin, BedDouble, Bath, Square, Heart, Share2, Shield, Mail, Phone } from "lucide-react";
import Image from "next/image";
import { propertyService, favoriteService } from "@/services/api.service";

interface Property {
  id: string;
  title: string;
  price: number;
  location_city: string;
  location_state?: string;
  bedrooms: number;
  bathrooms: number;
  area_sqft: number;
  images?: string | string[];
  property_type: string;
  description?: string;
  amenities?: string | string[];
}

const DEFAULT_USER_ID = "5459b8b1-85ac-41a1-b1c7-ddfa11a57c99";

export default function PropertyDetail() {
  const router = useRouter();
  const { id } = router.query;
  const [property, setProperty] = useState<Property | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaved, setIsSaved] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    // Wait for router to be ready and id to be available
    if (!router.isReady || !id) return;
    
    const fetchProperty = async () => {
      try {
        const data = await propertyService.getById(id as string);
        // Robust parsing for SQLite JSON strings
        const images = typeof data.images === "string" ? JSON.parse(data.images) : (data.images || []);
        const amenities = typeof data.amenities === "string" ? JSON.parse(data.amenities) : (data.amenities || []);
        
        setProperty({
          ...data,
          images,
          amenities,
        });

        // Check if already favorited
        const favorites = await favoriteService.getByUser(DEFAULT_USER_ID);
        const alreadySaved = favorites.some((f: any) => f.propertyId === id);
        setIsSaved(alreadySaved);
      } catch (error) {
        console.error("Error fetching property", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchProperty();
  }, [id, router.isReady]);

  const toggleFavorite = async () => {
    if (!property || isSaving) return;
    setIsSaving(true);
    try {
      await favoriteService.save(DEFAULT_USER_ID, property.id);
      setIsSaved(!isSaved);
    } catch (error) {
      console.error("Error toggling favorite", error);
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center p-10 text-center">
      <div className="h-12 w-12 animate-spin rounded-full border-4 border-indigo-600 border-t-transparent"></div>
      <p className="mt-4 font-bold text-slate-400">Loading property details...</p>
    </div>
  );
  
  if (!property) return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center p-10 text-center">
        <h2 className="text-2xl font-bold text-slate-800">Property not found.</h2>
        <button onClick={() => router.back()} className="mt-4 text-indigo-600 font-bold hover:underline">Go Back</button>
      </div>
  );

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="container mx-auto px-4 py-8 md:px-8">
        <button onClick={() => router.back()} className="mb-6 flex items-center gap-2 text-sm font-bold text-slate-400 hover:text-indigo-600 transition-colors">
          <ArrowLeft className="h-4 w-4" /> Back to Search
        </button>

        <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <div className="mb-2 inline-flex rounded-lg bg-indigo-600 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-white shadow-lg shadow-indigo-200">
               {property.property_type}
            </div>
            <h1 className="text-3xl font-black text-slate-900 md:text-4xl">{property.title}</h1>
            <div className="mt-2 flex items-center gap-1 text-slate-500 font-medium">
              <MapPin className="h-4 w-4 text-indigo-500" />
              <span>{property.location_city}, {property.location_state || 'Hyderabad'}</span>
            </div>
          </div>
          <div className="flex items-center gap-3">
             <button className="flex h-12 w-12 items-center justify-center rounded-2xl border bg-white shadow-sm hover:bg-slate-50 transition-all active:scale-95">
               <Share2 className="h-5 w-5 text-slate-600" />
             </button>
             <button 
              onClick={toggleFavorite}
              disabled={isSaving}
              className={`flex h-12 w-12 items-center justify-center rounded-2xl border bg-white shadow-sm transition-all active:scale-95 ${isSaved ? 'border-red-100 bg-red-50' : 'hover:bg-slate-50'}`}
             >
               <Heart className={`h-5 w-5 transition-colors ${isSaved ? 'fill-red-500 text-red-500' : 'text-slate-600 hover:text-red-500'}`} />
             </button>
          </div>
        </div>

        <div className="mb-12 grid gap-4 md:grid-cols-4 md:grid-rows-2 h-[500px]">
          {property.images && Array.isArray(property.images) && property.images.length > 0 ? (
            <>
              {/* Main Image */}
              <div className="relative md:col-span-2 md:row-span-2 rounded-3xl overflow-hidden bg-slate-200 shadow-xl">
                <Image src={property.images[0]} alt="Main" fill priority className="object-cover transition-transform hover:scale-105 duration-700" />
              </div>
              {/* Other Images up to 4 */}
              {(property.images as string[]).slice(1, 5).map((imgUrl: string, idx: number) => (
                <div key={idx} className="relative rounded-3xl overflow-hidden bg-slate-200 shadow-lg">
                  <Image src={imgUrl} alt={`Image ${idx + 2}`} fill className="object-cover hover:scale-110 transition-transform duration-500" />
                  {idx === 3 && (property.images as string[]).length > 5 && (
                    <div className="absolute inset-0 bg-black/60 flex items-center justify-center text-white font-bold cursor-pointer hover:bg-black/70 transition-colors">
                      View all ({(property.images as string[]).length})
                    </div>
                  )}
                </div>
              ))}
              {/* If only one image, show layout spacers */}
              {property.images.length === 1 && (
                <div className="md:col-span-2 md:row-span-2 grid grid-cols-2 grid-rows-2 gap-4">
                   <div className="rounded-3xl bg-indigo-50/30 border border-dashed border-indigo-200 flex items-center justify-center p-4 text-center">
                     <span className="text-[10px] font-black uppercase text-indigo-300">Premium Gallery View</span>
                   </div>
                   <div className="rounded-3xl bg-slate-100/50 border border-dashed border-slate-200 flex items-center justify-center p-4 text-center">
                     <span className="text-[10px] font-black uppercase text-slate-300">Exterior Perspective</span>
                   </div>
                   <div className="rounded-3xl bg-slate-100/50 border border-dashed border-slate-200 flex items-center justify-center p-4 text-center">
                     <span className="text-[10px] font-black uppercase text-slate-300">Interior Detail</span>
                   </div>
                   <div className="rounded-3xl bg-slate-100/50 border border-dashed border-slate-200 flex items-center justify-center p-4 text-center">
                     <span className="text-[10px] font-black uppercase text-slate-300">Floor Plan View</span>
                   </div>
                </div>
              )}
            </>
          ) : (
            <div className="md:col-span-4 md:row-span-2 rounded-3xl bg-slate-200 flex items-center justify-center text-slate-400 font-bold">
              No Images Available
            </div>
          )}
        </div>

        <div className="grid gap-8 lg:grid-cols-[1fr_380px]">
          <div className="space-y-10">
            <div className="rounded-[40px] border bg-white p-10 shadow-sm transition-all hover:shadow-md">
                <h2 className="mb-8 text-2xl font-black text-slate-900">Property Highlights</h2>
                <div className="grid grid-cols-2 gap-6 sm:grid-cols-4">
                  <div className="flex flex-col items-center gap-3 p-6 rounded-3xl bg-indigo-50/50 group hover:bg-indigo-600 transition-all">
                    <BedDouble className="h-7 w-7 text-indigo-600 group-hover:text-white" />
                    <span className="text-xs font-black uppercase tracking-widest text-slate-400 group-hover:text-indigo-100">Bedrooms</span>
                    <span className="text-lg font-black group-hover:text-white">{property.bedrooms}</span>
                  </div>
                  <div className="flex flex-col items-center gap-3 p-6 rounded-3xl bg-emerald-50/50 group hover:bg-emerald-600 transition-all">
                    <Bath className="h-7 w-7 text-emerald-600 group-hover:text-white" />
                    <span className="text-xs font-black uppercase tracking-widest text-slate-400 group-hover:text-emerald-100">Bathrooms</span>
                    <span className="text-lg font-black group-hover:text-white">{property.bathrooms}</span>
                  </div>
                  <div className="flex flex-col items-center gap-3 p-6 rounded-3xl bg-orange-50/50 group hover:bg-orange-600 transition-all">
                    <Square className="h-7 w-7 text-orange-600 group-hover:text-white" />
                    <span className="text-xs font-black uppercase tracking-widest text-slate-400 group-hover:text-orange-100">Area (sqft)</span>
                    <span className="text-lg font-black group-hover:text-white">{property.area_sqft}</span>
                  </div>
                  <div className="flex flex-col items-center gap-3 p-6 rounded-3xl bg-blue-50/50 group hover:bg-blue-600 transition-all">
                    <Shield className="h-7 w-7 text-blue-600 group-hover:text-white" />
                    <span className="text-xs font-black uppercase tracking-widest text-slate-400 group-hover:text-blue-100">Verified</span>
                    <span className="text-lg font-black group-hover:text-white">Yes</span>
                  </div>
                </div>
                
                <div className="mt-12">
                  <h3 className="mb-4 text-xl font-black text-slate-900 flex items-center gap-2">
                    <div className="h-2 w-2 rounded-full bg-indigo-600" /> About this Home
                  </h3>
                  <p className="text-slate-600 leading-relaxed font-medium text-lg italic">
                    {property.description || "This stunning property offers a perfect blend of luxury and comfort."}
                  </p>
                </div>
            </div>

            <div className="rounded-[40px] border bg-white p-10 shadow-sm">
               <h2 className="mb-8 text-2xl font-black text-slate-900">Amenities & Features</h2>
               <div className="grid grid-cols-2 gap-y-6 gap-x-12 md:grid-cols-3">
                  {(Array.isArray(property.amenities) ? property.amenities : ["Swimming Pool", "Gymnasium", "24/7 Security", "Power Backup", "Clubhouse", "Gated Community"]).map((amenity: string) => (
                    <div key={amenity} className="flex items-center gap-4 text-sm font-black text-slate-700 hover:text-indigo-600 transition-colors cursor-default">
                       <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
                         <div className="h-2 w-2 rounded-full bg-current" />
                       </div>
                       {amenity}
                    </div>
                  ))}
               </div>
            </div>
          </div>
          
          <aside className="space-y-6">
            <div className="sticky top-24 rounded-[40px] border bg-white p-10 shadow-2xl border-indigo-100">
               <div className="mb-8">
                  <span className="block text-xs font-black text-slate-400 uppercase tracking-[0.2em] mb-2">Offer Price</span>
                  <div className="text-4xl font-black text-indigo-600 tracking-tighter italic">₹{(property.price / 100000).toFixed(2)} Lakh</div>
                  <div className="mt-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Inclusive of all taxes & maintenance</div>
               </div>
               
               <div className="h-px bg-slate-100 my-8"></div>
               
               <form className="space-y-6" onSubmit={(e) => { e.preventDefault(); alert('Your inquiry has been sent to our premium agents!'); }}>
                  <h3 className="text-lg font-black text-slate-800">Interested in this property?</h3>
                  <div className="space-y-2">
                     <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Your Full Name</label>
                     <input required className="w-full border-b-2 bg-transparent py-3 focus:border-indigo-600 outline-none text-sm font-bold transition-all placeholder:text-slate-200" placeholder="e.g. Rahul Sharma" />
                  </div>
                  <div className="space-y-2">
                     <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Phone Number / Email</label>
                     <input required className="w-full border-b-2 bg-transparent py-3 focus:border-indigo-600 outline-none text-sm font-bold transition-all placeholder:text-slate-200" placeholder="+91 9988776655" />
                  </div>
                  <button type="submit" className="mt-6 w-full rounded-3xl bg-indigo-600 py-5 font-black text-white shadow-xl shadow-indigo-100 transition-all hover:bg-indigo-700 hover:-translate-y-1 active:scale-95 flex items-center justify-center gap-3 uppercase tracking-tighter italic">
                    <Mail className="h-5 w-5" /> Send Premium Inquiry
                  </button>
               </form>
               
               <div className="mt-10 pt-10 border-t space-y-6">
                  <div className="flex items-center gap-5 p-4 rounded-3xl bg-slate-50 border border-slate-100">
                    <div className="h-14 w-14 overflow-hidden rounded-2xl bg-indigo-100 flex items-center justify-center font-black text-indigo-600 text-xl italic">PA</div>
                    <div>
                      <div className="text-xs font-black uppercase tracking-widest text-slate-400">Listed By</div>
                      <div className="text-md font-black text-slate-800">PropAI Premium Agent</div>
                    </div>
                  </div>
                  <button onClick={() => alert('Agent contact initialized!')} className="w-full rounded-2xl border-2 border-slate-900 bg-white py-4 text-xs font-black text-slate-900 hover:bg-slate-900 hover:text-white transition-all flex items-center justify-center gap-3 uppercase tracking-widest">
                    <Phone className="h-4 w-4" /> Direct Contact
                  </button>
               </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
