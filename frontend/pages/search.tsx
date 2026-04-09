import { useState, useEffect, useCallback } from "react";
import { Search, SlidersHorizontal, LayoutGrid, List } from "lucide-react";
import PropertyCard from "@/components/PropertyCard";
import { propertyService } from "@/services/api.service";

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

interface FilterState {
  location: string;
  minPrice: string;
  maxPrice: string;
  propertyType: string;
  bedrooms: string;
}

export default function SearchPage() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [filters, setFilters] = useState<FilterState>({
    location: "",
    minPrice: "",
    maxPrice: "",
    propertyType: "All",
    bedrooms: "",
  });
  const [isLoading, setIsLoading] = useState(true);
  const [availableLocations, setAvailableLocations] = useState<string[]>([]);

  const fetchProperties = useCallback(async () => {
    setIsLoading(true);
    try {
      const params: Record<string, string> = {};
      if (filters.location) params.location = filters.location;
      if (filters.minPrice) params.minPrice = (parseFloat(filters.minPrice) * 100000).toString(); 
      if (filters.maxPrice) params.maxPrice = (parseFloat(filters.maxPrice) * 100000).toString();
      if (filters.propertyType && filters.propertyType !== "All") params.propertyType = filters.propertyType;
      if (filters.bedrooms) params.bedrooms = filters.bedrooms.replace("+", "");

      const data = await propertyService.getAll(params);
      const parsed = data.map((p: Property) => ({
        ...p,
        images: typeof p.images === "string" ? JSON.parse(p.images) : (p.images || []),
        amenities: typeof p.amenities === "string" ? JSON.parse(p.amenities) : (p.amenities || []),
      }));
      setProperties(parsed);
    } catch (error) {
      console.error("Error fetching properties", error);
    } finally {
      setIsLoading(false);
    }
  }, [filters]);

  const fetchLocations = useCallback(async () => {
    try {
      const allData = await propertyService.getAll({});
      const locs = Array.from(new Set(allData.map((p: Property) => p.location_city).filter(Boolean))) as string[];
      setAvailableLocations(locs);
    } catch (e) {
      console.error("Failed to fetch locations", e);
    }
  }, []);

  // Fetch on initial load
  useEffect(() => {
    fetchProperties();
    fetchLocations();
  }, [fetchProperties, fetchLocations]);

  const handleApplyFilters = () => {
    fetchProperties();
  };

  const handleClearFilters = () => {
    setFilters({ location: "", minPrice: "", maxPrice: "", propertyType: "All", bedrooms: "" });
    // Fetch all after clearing
    setTimeout(() => fetchProperties(), 100);
  };

  return (
    <div className="container mx-auto px-4 py-8 md:px-8">
      <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <h1 className="text-3xl font-bold text-slate-900">Search Properties</h1>
        <div className="flex items-center gap-2 rounded-xl border bg-white p-1 shadow-sm">
          <button className="rounded-lg bg-indigo-50 p-2 text-indigo-600">
            <LayoutGrid className="h-5 w-5" />
          </button>
          <button className="rounded-lg p-2 text-slate-400 hover:bg-slate-50">
            <List className="h-5 w-5" />
          </button>
        </div>
      </div>

      <div className="grid gap-8 lg:grid-cols-[280px_1fr]">
        <aside className="space-y-6">
          <div className="rounded-2xl border bg-white p-6 shadow-sm">
            <div className="mb-6 flex items-center justify-between">
              <h2 className="font-bold text-slate-900">Filters</h2>
              <SlidersHorizontal className="h-4 w-4 text-slate-400" />
            </div>

            <div className="space-y-4">
              <div>
                <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-slate-500">Location</label>
                <input
                  type="text"
                  list="search-locations"
                  placeholder="e.g. Gachibowli, Hyderabad"
                  className="w-full rounded-xl border px-4 py-2 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                  value={filters.location}
                  onChange={(e) => setFilters({ ...filters, location: e.target.value })}
                />
                <datalist id="search-locations">
                  {availableLocations.map((loc) => (
                    <option key={loc} value={loc} />
                  ))}
                </datalist>
              </div>

              <div>
                <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-slate-500">Property Type</label>
                <select 
                  className="w-full rounded-xl border px-4 py-2 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                  value={filters.propertyType}
                  onChange={(e) => setFilters({ ...filters, propertyType: e.target.value })}
                >
                  <option>All</option>
                  <option>Apartment</option>
                  <option>Villa</option>
                  <option>Plot</option>
                </select>
              </div>

              <div>
                <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-slate-500">Price Range (₹ Lakh)</label>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    placeholder="Min"
                    className="w-full rounded-xl border px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                    value={filters.minPrice}
                    onChange={(e) => setFilters({ ...filters, minPrice: e.target.value })}
                  />
                  <span className="text-slate-400">-</span>
                  <input
                    type="number"
                    placeholder="Max"
                    className="w-full rounded-xl border px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                    value={filters.maxPrice}
                    onChange={(e) => setFilters({ ...filters, maxPrice: e.target.value })}
                  />
                </div>
              </div>

              <div>
                <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-slate-500">Bedrooms</label>
                <div className="flex flex-wrap gap-2">
                  {["1", "2", "3", "4", "5+"].map((num) => (
                    <button
                      key={num}
                      onClick={() => setFilters({ ...filters, bedrooms: filters.bedrooms === num ? "" : num })}
                      className={`flex h-10 w-10 items-center justify-center rounded-xl border text-sm font-medium transition-all ${
                        filters.bedrooms === num 
                          ? "bg-indigo-600 text-white border-indigo-600 shadow-md" 
                          : "bg-white text-slate-600 hover:border-indigo-400 hover:text-indigo-600"
                      }`}
                    >
                      {num}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <button 
              onClick={handleApplyFilters}
              className="mt-8 w-full rounded-xl bg-indigo-600 py-3 text-sm font-bold text-white hover:bg-indigo-700 shadow-lg active:scale-95 transition-all"
            >
              Apply Filters
            </button>
            <button 
              onClick={handleClearFilters}
              className="mt-2 w-full text-xs font-bold text-slate-400 hover:text-indigo-600"
            >
              Clear All
            </button>
          </div>
        </aside>

        <div className="space-y-6">
          <div className="text-sm text-slate-500 font-medium">
            {!isLoading && `${properties.length} ${properties.length === 1 ? 'property' : 'properties'} found`}
          </div>
          {isLoading ? (
            <div className="grid gap-6 sm:grid-cols-2">
               {[1, 2, 3, 4].map(n => (
                 <div key={n} className="h-80 rounded-2xl bg-white border animate-pulse"></div>
               ))}
            </div>
          ) : properties.length > 0 ? (
            <div className="grid gap-6 sm:grid-cols-2">
              {properties.map((p: Property) => (
                <PropertyCard key={p.id} property={p} />
              ))}
            </div>
          ) : (
            <div className="flex h-64 flex-col items-center justify-center rounded-2xl border-2 border-dashed bg-white text-center">
              <Search className="mb-2 h-10 w-10 text-slate-300" />
              <p className="font-bold text-slate-900">No properties found</p>
              <p className="text-sm text-slate-500">Try adjusting your filters or search keywords.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
