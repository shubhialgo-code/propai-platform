"use client";

import { useState, useEffect } from "react";
import Hero from "@/components/Hero";
import PropertyCard from "@/components/PropertyCard";
import { propertyService } from "@/services/api.service";

export default function Home() {
  const [properties, setProperties] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        const data = await propertyService.getAll();
        // Parse JSON strings from SQLite into arrays
        const parsed = data.map((p: any) => ({
          ...p,
          images: typeof p.images === "string" ? JSON.parse(p.images) : p.images,
          amenities: typeof p.amenities === "string" ? JSON.parse(p.amenities) : p.amenities,
        }));
        setProperties(parsed);
      } catch (error) {
        console.error("Error fetching properties:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchProperties();
  }, []);

  return (
    <div className="flex flex-col min-h-screen">
      <Hero />
      
      <section className="container mx-auto px-4 py-12 md:px-8">
        <div className="mb-8 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-slate-900">Featured Properties</h2>
          <a href="/search" className="text-sm font-semibold text-indigo-600 hover:underline">
            View All
          </a>
        </div>
        
        {isLoading ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map(n => (
              <div key={n} className="h-80 rounded-2xl bg-white border animate-pulse"></div>
            ))}
          </div>
        ) : properties.length > 0 ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3">
            {properties.map((property) => (
              <PropertyCard key={property.id} property={property} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12 text-slate-500">
            <p className="text-lg font-medium">No properties available yet.</p>
            <p className="text-sm">Check back soon or submit a new listing!</p>
          </div>
        )}
      </section>

      <section className="bg-indigo-600 py-16 text-white text-center">
        <div className="container mx-auto px-4">
          <h2 className="mb-4 text-3xl font-bold">Ready to Find Your Home?</h2>
          <p className="mb-8 text-indigo-100">Our AI assistant is ready to help you discover the best deals in Hyderabad.</p>
          <a href="/search" className="inline-block rounded-full bg-white px-8 py-3 font-bold text-indigo-600 hover:bg-slate-100 transition-colors shadow-lg active:scale-95">
            Ask PropAI Now
          </a>
        </div>
      </section>
      
      <footer className="border-t py-12 bg-white text-center">
        <div className="container mx-auto px-4">
          <p className="text-slate-500">&copy; 2026 PropAI Platform. Premium Real Estate Solutions.</p>
        </div>
      </footer>
    </div>
  );
}
