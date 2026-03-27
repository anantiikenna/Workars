"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Card, CardContent, CardHeader } from "@/components/ui/Card";
import { Search, MapPin, Star, ShieldCheck, Filter, ChevronRight, Lock, Zap } from "lucide-react";
import { REGIONS } from "@/constants/regions";
import { supabase } from "@/lib/supabase";
import Link from "next/link";

export default function Marketplace() {
  const [selectedRegion, setSelectedRegion] = useState("All");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [search, setSearch] = useState("");
  const [artisans, setArtisans] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      setIsLoading(true);
      
      // Fetch categories
      const { data: catData } = await supabase.from('categories').select('*');
      if (catData) setCategories(catData);

      // Fetch artisans
      let query = supabase
        .from('artisans')
        .select(`
          *,
          profiles (
            full_name,
            avatar_url
          ),
          categories (
             name
          )
        `)
        .eq('is_verified', true);

      if (selectedRegion !== "All") {
        query = query.eq('location_name', selectedRegion);
      }

      if (selectedCategory !== "All") {
        query = query.eq('category_id', selectedCategory);
      }

      const { data: artData } = await query;
      if (artData) setArtisans(artData);
      
      setIsLoading(false);
    }

    fetchData();
  }, [selectedRegion, selectedCategory]);

  const filteredArtisans = artisans.filter(a => {
    const fullName = a.profiles?.full_name?.toLowerCase() || "";
    const categoryName = a.categories?.name?.toLowerCase() || "";
    return fullName.includes(search.toLowerCase()) || categoryName.includes(search.toLowerCase());
  });

  return (
    <div className="flex flex-col min-h-screen bg-slate-50">
      <header className="px-4 lg:px-6 h-16 flex items-center border-b bg-white sticky top-0 z-50">
        <Link href="/" className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
          Workars
        </Link>
        <div className="ml-8 hidden md:flex items-center bg-slate-100 rounded-full px-4 h-10 w-96">
          <Search className="h-4 w-4 text-slate-400 mr-2" />
          <input 
            className="bg-transparent border-none focus:outline-none text-sm w-full" 
            placeholder="Search by name or skill..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="ml-auto flex gap-4">
           <Button variant="ghost" asChild><Link href="/auth?role=worker">Artisan Login</Link></Button>
           <Button variant="outline" asChild><Link href="/auth?role=customer">Sign Up</Link></Button>
        </div>
      </header>

      <main className="container px-4 py-8 md:px-6">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Sidebar Filters */}
          <aside className="w-full md:w-64 space-y-6">
            <div>
              <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400 mb-4 flex items-center">
                <MapPin className="h-4 w-4 mr-2" />
                Lagos Regions
              </h3>
              <div className="space-y-1">
                <button 
                  onClick={() => setSelectedRegion("All")}
                  className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${selectedRegion === "All" ? "bg-blue-600 text-white font-medium shadow-sm" : "hover:bg-white text-slate-600"}`}
                >
                  All Regions
                </button>
                {REGIONS.map(r => (
                  <button 
                    key={r}
                    onClick={() => setSelectedRegion(r)}
                    className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${selectedRegion === r ? "bg-blue-600 text-white font-medium shadow-sm" : "hover:bg-white text-slate-600"}`}
                  >
                    {r}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400 mb-4 flex items-center">
                <Filter className="h-4 w-4 mr-2" />
                Categories
              </h3>
              <div className="space-y-1">
                <button 
                  onClick={() => setSelectedCategory("All")}
                  className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${selectedCategory === "All" ? "bg-blue-600 text-white font-medium shadow-sm" : "hover:bg-white text-slate-600"}`}
                >
                  All Skills
                </button>
                {categories.map(cat => (
                  <button 
                    key={cat.id}
                    onClick={() => setSelectedCategory(cat.id)}
                    className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${selectedCategory === cat.id ? "bg-blue-600 text-white font-medium shadow-sm" : "hover:bg-white text-slate-600"}`}
                  >
                    {cat.name}
                  </button>
                ))}
              </div>
            </div>
          </aside>

          {/* Artisan Listing */}
          <section className="flex-1">
            <div className="flex items-center justify-between mb-6">
               <h2 className="text-2xl font-bold">
                 {isLoading ? "Finding Professionals..." : `${filteredArtisans.length} Professionals Found`}
               </h2>
            </div>

            {isLoading ? (
               <div className="grid gap-6 opacity-50">
                  {[1,2,3].map(i => (
                    <div key={i} className="h-40 bg-white rounded-2xl animate-pulse" />
                  ))}
               </div>
            ) : (
              <div className="grid gap-6">
                {filteredArtisans.map(artisan => (
                  <Card key={artisan.id} className="overflow-hidden border-none shadow-sm hover:shadow-md transition-all group rounded-2xl">
                    <div className="flex flex-col sm:flex-row">
                      <div className="p-6 flex-1">
                        <div className="flex items-start justify-between">
                          <div className="flex items-center space-x-4">
                            <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold text-xl shadow-inner">
                              {artisan.profiles?.full_name?.charAt(0) || "W"}
                            </div>
                            <div>
                              <div className="flex items-center space-x-2">
                                <h3 className="text-xl font-bold text-slate-900">{artisan.profiles?.full_name}</h3>
                                {artisan.is_verified && <ShieldCheck className="h-5 w-5 text-blue-500" />}
                              </div>
                              <p className="text-blue-600 font-semibold text-sm">{artisan.categories?.name}</p>
                            </div>
                          </div>
                          <div className="flex items-center bg-amber-50 px-2 py-1 rounded-lg">
                             <Star className="h-4 w-4 text-amber-500 fill-amber-500 mr-1" />
                             <span className="text-sm font-bold text-amber-700">4.9</span>
                          </div>
                        </div>
                        
                        <div className="mt-6 flex items-center space-x-6 text-sm text-slate-500 font-medium">
                          <div className="flex items-center">
                            <MapPin className="h-4 w-4 mr-1 text-slate-400" />
                            {artisan.location_name || "Lagos"}
                          </div>
                          <div className="flex items-center">
                            <Zap className="h-4 w-4 mr-1 text-emerald-500" />
                            {artisan.experience_years || 0} Years Experience
                          </div>
                        </div>
                      </div>
                      
                      <div className="bg-slate-50 border-t sm:border-t-0 sm:border-l p-6 w-full sm:w-64 flex flex-col justify-between">
                         <div className="space-y-2">
                            <p className="text-xs uppercase font-extrabold text-slate-400 tracking-wider">Contact Details</p>
                            <div className="flex items-center text-slate-400">
                               <Lock className="h-3.5 w-3.5 mr-2" />
                               <span className="text-sm italic font-medium">Locked</span>
                            </div>
                         </div>
                         <Button className="w-full mt-4 group-hover:bg-blue-700 h-12 rounded-xl shadow-sm transition-all" asChild>
                           <Link href={`/worker/${artisan.id}`}>
                             View Profile <ChevronRight className="ml-2 h-4 w-4" />
                           </Link>
                         </Button>
                      </div>
                    </div>
                  </Card>
                ))}
                
                {filteredArtisans.length === 0 && !isLoading && (
                  <div className="py-24 text-center bg-white rounded-3xl border-2 border-dashed border-slate-100">
                    <p className="text-slate-400 text-lg font-medium">No artisans match your search criteria.</p>
                    <Button variant="link" className="mt-2 text-blue-600 font-bold" onClick={() => {setSelectedRegion("All"); setSelectedCategory("All"); setSearch("");}}>
                      Clear all filters
                    </Button>
                  </div>
                )}
              </div>
            )}
          </section>
        </div>
      </main>
    </div>
  );
}
