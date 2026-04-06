"use client";

import { useState } from "react";
import { Heart, MapPin, BedDouble, Bath, Square, LayoutGrid } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

interface PropertyProps {
  property: {
    id: string;
    title: string;
    price: number;
    location_city: string;
    bedrooms: number;
    bathrooms: number;
    area_sqft: number;
    images?: string[];
  };
}

export default function PropertyCard({ property }: PropertyProps) {
  const [isFavorite, setIsFavorite] = useState(false);

  const toggleFavorite = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsFavorite(!isFavorite);
  };

  return (
    <div className="group overflow-hidden rounded-2xl border bg-white transition-all hover:shadow-xl">
      <Link href={`/property/${property.id}`} className="block relative aspect-[4/3] overflow-hidden bg-slate-100">
        {property.images && property.images.length > 0 ? (
          <Image
            src={property.images[0]}
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
        <button
          onClick={toggleFavorite}
          className={`absolute right-4 top-4 rounded-full p-2 backdrop-blur transition-all ${isFavorite ? "bg-red-500 text-white" : "bg-white/80 text-slate-600 hover:bg-white hover:text-red-500"
            }`}
        >
          <Heart className={`h-5 w-5 ${isFavorite ? "fill-current" : ""}`} />
        </button>
      </Link>

      <div className="p-5">
        <Link href={`/property/${property.id}`}>
          <h3 className="mb-2 text-lg font-bold text-slate-800 transition-colors group-hover:text-indigo-600">
            {property.title}
          </h3>
        </Link>
        <div className="mb-4 flex items-center gap-1 text-sm text-slate-500">
          <MapPin className="h-4 w-4" />
          <span>{property.location_city}</span>
        </div>

        <div className="mb-5 flex flex-wrap gap-4 border-y py-3 text-slate-600">
          <div className="flex items-center gap-1 text-sm font-medium">
            <BedDouble className="h-4 w-4 text-indigo-500" />
            <span>{property.bedrooms} Beds</span>
          </div>
          <div className="flex items-center gap-1 text-sm font-medium">
            <Bath className="h-4 w-4 text-indigo-500" />
            <span>{property.bathrooms} Baths</span>
          </div>
          <div className="flex items-center gap-1 text-sm font-medium">
            <Square className="h-4 w-4 text-indigo-500" />
            <span>{property.area_sqft} sqft</span>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="text-xl font-bold text-indigo-600">
            ₹{(property.price / 100000).toFixed(2)} Lakh
          </div>
          <Link href={`/property/${property.id}`} className="text-sm font-semibold text-indigo-600 hover:underline">
            View Details
          </Link>
        </div>
      </div>
    </div>
  );
}
