"use client";

import { useState, useEffect } from "react";
import { Search, MapPin } from "lucide-react";
import { useRouter } from "next/navigation";
import { propertyService } from "@/services/api.service";

interface Property {
  location_city: string;
}

export default function Hero() {
  const [query, setQuery] = useState("");
  const [availableLocations, setAvailableLocations] = useState<string[]>([]);
  const router = useRouter();

  useEffect(() => {
    const fetchLocations = async () => {
      try {
        const props = await propertyService.getAll({});
        const locs = Array.from(new Set(props.map((p: Property) => p.location_city).filter(Boolean))) as string[];
        setAvailableLocations(locs);
      } catch (e) {
        console.error("Failed to fetch locations", e);
      }
    };
    fetchLocations();
  }, []);

  const handleSearch = () => {
    if (query.trim()) {
      router.push(`/search?q=${encodeURIComponent(query)}`);
    } else {
      router.push("/search");
    }
  };

  const quickSearch = (term: string) => {
    router.push(`/search?q=${encodeURIComponent(term)}`);
  };

  return (
    <div className="relative py-20 px-4 md:px-8">
      <div className="container mx-auto max-w-4xl text-center">
        <h1 className="mb-6 text-4xl font-extrabold tracking-tight text-slate-900 md:text-6xl">
          Find Your Perfect <span className="text-indigo-600">Dream Home</span> with AI
        </h1>
        <p className="mb-10 text-lg text-slate-600 md:text-xl">
          The most advanced AI-powered real estate platform in Hyderabad. 
          Discover luxury villas, modern apartments, and more.
        </p>

        <div className="relative mx-auto max-w-2xl rounded-2xl bg-white p-2 shadow-2xl border">
          <div className="flex flex-col md:flex-row gap-2">
            <div className="flex flex-1 items-center gap-2 px-4 py-2">
              <MapPin className="h-5 w-5 text-indigo-500" />
              <input
                type="text"
                list="hero-locations"
                placeholder="Where do you want to live? (e.g. Gachibowli)"
                className="w-full text-sm font-medium focus:outline-none"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              />
              <datalist id="hero-locations">
                {availableLocations.map((loc) => (
                  <option key={loc} value={loc} />
                ))}
              </datalist>
            </div>
            <div className="h-px bg-slate-100 md:h-8 md:w-px"></div>
            <button 
              onClick={handleSearch}
              className="flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-8 py-3 text-sm font-bold text-white transition-all hover:bg-indigo-700 shadow-md active:scale-95"
            >
              <Search className="h-4 w-4" />
              Search
            </button>
          </div>
        </div>
        
        <div className="mt-8 flex flex-wrap justify-center gap-4 text-sm font-medium text-slate-500">
          <span>Popular:</span>
          <button onClick={() => quickSearch("2BHK Gachibowli")} className="hover:text-indigo-600 underline decoration-indigo-200 transition-colors">2BHK Gachibowli</button>
          <button onClick={() => quickSearch("Luxury Villas Jubilee Hills")} className="hover:text-indigo-600 underline decoration-indigo-200 transition-colors">Luxury Villas Jubilee Hills</button>
          <button onClick={() => quickSearch("Affordable Kondapur")} className="hover:text-indigo-600 underline decoration-indigo-200 transition-colors">Affordable Kondapur</button>
        </div>
      </div>
    </div>
  );
}
