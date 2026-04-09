import { useState, useEffect } from "react";
import { Heart, ArrowRight } from "lucide-react";
import Link from "next/link";
import PropertyCard from "@/components/PropertyCard";

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
}

export default function FavoritesPage() {
  const [favorites, setFavorites] = useState<Property[]>([]);

  useEffect(() => {
    const fetchFavorites = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/favorites?userId=user-123");
        const data = await res.json();
        // The API returns an array of { id, userId, propertyId, property: { ... } }
        setFavorites(data.map((fav: { property: Property }) => fav.property));
      } catch (err) {
        console.error("Error fetching favorites", err);
      }
    };
    fetchFavorites();
  }, []);

  return (
    <div className="container mx-auto px-4 py-12 md:px-8">
      <div className="mb-8 flex items-center gap-3">
        <Heart className="h-8 w-8 text-red-500 fill-red-500" />
        <h1 className="text-3xl font-bold text-slate-900">My Favorites</h1>
      </div>

      {favorites.length > 0 ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {favorites.map((p: Property) => (
            <PropertyCard key={p.id} property={p} />
          ))}
        </div>
      ) : (
        <div className="flex min-h-[400px] flex-col items-center justify-center rounded-3xl border-2 border-dashed bg-white p-12 text-center">
          <div className="mb-4 rounded-full bg-slate-50 p-6">
            <Heart className="h-12 w-12 text-slate-200" />
          </div>
          <h2 className="mb-2 text-2xl font-bold">No saved properties yet</h2>
          <p className="mb-8 max-sm text-slate-500">
            Keep track of the homes you love. Click the heart icon on any property to save it for later.
          </p>
          <Link 
            href="/search" 
            className="flex items-center gap-2 rounded-full bg-indigo-600 px-8 py-3 font-bold text-white transition-all hover:bg-indigo-700 shadow-lg"
          >
            Start Discovering <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      )}
      
      <div className="mt-16 rounded-3xl bg-slate-900 p-12 text-white">
        <div className="max-w-xl">
           <h3 className="mb-4 text-2xl font-bold">Get personalized alerts</h3>
           <p className="mb-6 text-slate-400">Our AI will notify you as soon as properties similar to your favorites hit the market.</p>
           <button className="rounded-full bg-white px-8 py-3 font-bold text-slate-900 hover:bg-slate-100 transition-colors">
             Enable AI Alerts
           </button>
        </div>
      </div>
    </div>
  );
}
