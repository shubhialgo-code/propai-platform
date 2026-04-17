"use client";

import { useState } from "react";
import { Heart, MapPin, BedDouble, Bath, Square, LayoutGrid } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { favoriteService } from "@/services/api.service";

interface PropertyProps {
  property: {
    id: string;
    title: string;
    price: number;
    location_city: string;
    bedrooms: number;
    bathrooms: number;
    area_sqft: number;
    images?: string | string[];
    property_type: string;
    description?: string;
  };
  isSavedInitially?: boolean;
}

const DEFAULT_USER_ID = "5459b8b1-85ac-41a1-b1c7-ddfa11a57c99";

export default function PropertyCard({ property, isSavedInitially = false }: PropertyProps) {
  const [isFavorite, setIsFavorite] = useState(isSavedInitially);
  const [isSaving, setIsSaving] = useState(false);

  const toggleFavorite = async (e: React.MouseEvent) => {
    e.preventDefault();
    if (isSaving) return;
    
    setIsSaving(true);
    try {
      const resp = await favoriteService.save(DEFAULT_USER_ID, property.id);
      // Backend now returns { saved: boolean }
      if (resp && typeof resp.saved === 'boolean') {
        setIsFavorite(resp.saved);
      } else {
        setIsFavorite(!isFavorite);
      }
    } catch (error) {
      console.error("Error toggling favorite on card", error);
      // Catching error prevents the app from crashing with an overlay
    } finally {
      setIsSaving(false);
    }
  };

  // Safe parsing for SQLite JSON strings
  const imageList = typeof property.images === "string" 
    ? JSON.parse(property.images) 
    : (property.images || []);

  const thumbnail = imageList.length > 0 ? imageList[0] : null;

  return (
    <div className="group overflow-hidden rounded-2xl border bg-white transition-all hover:shadow-xl flex flex-col h-full">
      <Link href={`/property/${property.id}`} className="block relative aspect-[16/10] overflow-hidden bg-slate-100">
        {thumbnail ? (
          <Image
            src={thumbnail}
            alt={property.title}
            fill
            priority
            className="object-cover transition-transform duration-500 group-hover:scale-110"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        ) : (
          <div className="h-full w-full flex flex-col items-center justify-center text-slate-400 gap-2">
            <LayoutGrid className="h-8 w-8 opacity-20" />
            <span className="text-xs font-medium uppercase tracking-wider">No Image</span>
          </div>
        )}
        <div className="absolute left-4 top-4 rounded-lg bg-white/90 px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-indigo-600 backdrop-blur shadow-sm">
          {property.property_type}
        </div>
        <button
          onClick={toggleFavorite}
          className={`absolute right-4 top-4 rounded-full p-2 backdrop-blur transition-all shadow-sm ${isFavorite ? "bg-red-500 text-white" : "bg-white/80 text-slate-600 hover:bg-white hover:text-red-500"
            }`}
        >
          <Heart className={`h-4 w-4 ${isFavorite ? "fill-current" : ""}`} />
        </button>
      </Link>

      <div className="p-5 flex flex-col flex-grow">
        <Link href={`/property/${property.id}`}>
          <h3 className="mb-2 text-lg font-bold text-slate-800 transition-colors group-hover:text-indigo-600 line-clamp-1">
            {property.title}
          </h3>
        </Link>
        <div className="mb-3 flex items-center gap-1 text-sm text-slate-500">
          <MapPin className="h-4 w-4" />
          <span>{property.location_city}</span>
        </div>

        {property.description && (
          <p className="mb-4 text-xs text-slate-600 line-clamp-2 leading-relaxed flex-grow">
            {property.description}
          </p>
        )}

        <div className="mb-5 flex items-center justify-between border-y py-3 text-slate-600">
          <div className="flex flex-col items-center gap-0.5">
            <BedDouble className="h-4 w-4 text-indigo-500" />
            <span className="text-[10px] font-bold uppercase text-slate-400">{property.bedrooms} Bed</span>
          </div>
          <div className="flex flex-col items-center gap-0.5 border-x px-4">
            <Bath className="h-4 w-4 text-indigo-500" />
            <span className="text-[10px] font-bold uppercase text-slate-400">{property.bathrooms} Bath</span>
          </div>
          <div className="flex flex-col items-center gap-0.5">
            <Square className="h-4 w-4 text-indigo-500" />
            <span className="text-[10px] font-bold uppercase text-slate-400">{property.area_sqft} sqft</span>
          </div>
        </div>

        <div className="flex items-center justify-between mt-auto">
          <div className="text-xl font-black text-indigo-600">
            ₹{(property.price / 100000).toFixed(1)} L
          </div>
          <Link href={`/property/${property.id}`} className="rounded-xl bg-indigo-50 px-4 py-2 text-xs font-bold text-indigo-600 transition-colors hover:bg-indigo-600 hover:text-white">
            Details
          </Link>
        </div>
      </div>
    </div>
  );
}
