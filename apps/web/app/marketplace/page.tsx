"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Card, CardContent, CardHeader } from "@/components/ui/Card";
import { Search, MapPin, Star, ShieldCheck, Filter, ChevronRight, Lock, Zap, Sparkles } from "lucide-react";
import { REGIONS } from "@/constants/regions";
import { supabase } from "@/lib/supabase";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

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
      
      const { data: catData } = await supabase.from('categories').select('*');
      if (catData) setCategories(catData);

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

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <div className="flex flex-col min-h-screen bg-slate-50/50">
      <header className="px-4 lg:px-6 h-20 flex items-center glass sticky top-0 z-50 border-b-white/20">
        <Link href="/" className="flex items-center space-x-2">
            <div className="h-10 w-10 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/20">
                <Sparkles className="h-6 w-6 text-white" />
            </div>
            <span className="text-2xl font-black tracking-tight text-slate-900">Workars</span>
        </Link>
        <div className="ml-12 hidden md:flex items-center bg-white/50 border border-white rounded-2xl px-4 h-12 w-[400px] shadow-sm focus-within:ring-2 ring-blue-500/20 transition-all">
          <Search className="h-4 w-4 text-slate-400 mr-2" />
          <input 
            className="bg-transparent border-none focus:outline-none text-sm w-full font-medium" 
            placeholder="Search by name, skill, or service..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="ml-auto flex gap-4">
           <Button variant="ghost" className="font-bold text-slate-600" asChild><Link href="/auth?role=worker">Artisan Login</Link></Button>
           <Button variant="premium" className="rounded-2xl px-6" asChild><Link href="/auth?role=customer">Get Started</Link></Button>
        </div>
      </header>

      <main className="container px-4 py-12 md:px-6 max-w-7xl mx-auto">
        <div className="flex flex-col lg:flex-row gap-12">
          {/* Sidebar Filters */}
          <aside className="w-full lg:w-72 space-y-8">
            <div className="bg-white p-6 rounded-[2rem] border border-white shadow-sm premium-shadow">
              <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-6 flex items-center">
                <MapPin className="h-3 w-3 mr-2 text-blue-500" />
                Select Region
              </h3>
              <div className="space-y-1.5">
                <button 
                  onClick={() => setSelectedRegion("All")}
                  className={`w-full text-left px-4 py-3 rounded-2xl text-sm font-bold transition-all ${selectedRegion === "All" ? "bg-slate-900 text-white shadow-xl shadow-slate-900/10" : "hover:bg-slate-50 text-slate-600"}`}
                >
                  All Lagos
                </button>
                {REGIONS.map(r => (
                  <button 
                    key={r}
                    onClick={() => setSelectedRegion(r)}
                    className={`w-full text-left px-4 py-3 rounded-2xl text-sm font-bold transition-all ${selectedRegion === r ? "bg-slate-900 text-white shadow-xl shadow-slate-900/10" : "hover:bg-slate-50 text-slate-600"}`}
                  >
                    {r}
                  </button>
                ))}
              </div>
            </div>

            <div className="bg-white p-6 rounded-[2rem] border border-white shadow-sm premium-shadow">
              <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-6 flex items-center">
                <Filter className="h-3 w-3 mr-2 text-blue-500" />
                Specialties
              </h3>
              <div className="space-y-1.5">
                <button 
                  onClick={() => setSelectedCategory("All")}
                  className={`w-full text-left px-4 py-3 rounded-2xl text-sm font-bold transition-all ${selectedCategory === "All" ? "bg-slate-900 text-white shadow-xl shadow-slate-900/10" : "hover:bg-slate-50 text-slate-600"}`}
                >
                  All Services
                </button>
                {categories.map(cat => (
                  <button 
                    key={cat.id}
                    onClick={() => setSelectedCategory(cat.id)}
                    className={`w-full text-left px-4 py-3 rounded-2xl text-sm font-bold transition-all ${selectedCategory === cat.id ? "bg-slate-900 text-white shadow-xl shadow-slate-900/10" : "hover:bg-slate-50 text-slate-600"}`}
                  >
                    {cat.name}
                  </button>
                ))}
              </div>
            </div>
          </aside>

          {/* Artisan Listing */}
          <section className="flex-1">
            <div className="flex items-center justify-between mb-8">
               <div>
                  <h2 className="text-3xl font-black tracking-tight text-slate-900">
                    {isLoading ? "Finding Experts..." : "Verified Artisans"}
                  </h2>
                  <p className="text-slate-500 font-medium mt-1">
                    {filteredArtisans.length} vetted professionals ready to work
                  </p>
               </div>
            </div>

            <AnimatePresence mode="wait">
              {isLoading ? (
                 <motion.div 
                   key="loading"
                   initial={{ opacity: 0 }}
                   animate={{ opacity: 1 }}
                   exit={{ opacity: 0 }}
                   className="grid gap-6"
                 >
                    {[1,2,3].map(i => (
                      <div key={i} className="h-44 bg-white/50 border border-white rounded-3xl animate-pulse" />
                    ))}
                 </motion.div>
              ) : (
                <motion.div 
                  key="results"
                  variants={container}
                  initial="hidden"
                  animate="show"
                  className="grid gap-6"
                >
                  {filteredArtisans.map(artisan => (
                    <motion.div key={artisan.id} variants={item}>
                      <Card className="overflow-hidden border-none shadow-sm hover:premium-shadow transition-all duration-500 group rounded-[2rem] bg-white">
                        <div className="flex flex-col sm:flex-row">
                          <div className="p-8 flex-1">
                            <div className="flex items-start justify-between">
                              <div className="flex items-center space-x-5">
                                <div className="h-20 w-20 rounded-[2rem] bg-gradient-to-br from-blue-600 to-indigo-700 flex items-center justify-center text-white font-black text-2xl shadow-xl shadow-blue-500/20 rotate-3 group-hover:rotate-0 transition-transform duration-500">
                                  {artisan.profiles?.full_name?.charAt(0) || "W"}
                                </div>
                                <div>
                                  <div className="flex items-center space-x-2">
                                    <h3 className="text-2xl font-black text-slate-900 tracking-tight">{artisan.profiles?.full_name}</h3>
                                    {artisan.is_verified && (
                                      <div className="bg-blue-50 p-1 rounded-full">
                                        <ShieldCheck className="h-4 w-4 text-blue-600" />
                                      </div>
                                    )}
                                  </div>
                                  <span className="inline-flex items-center px-3 py-1 bg-blue-50 text-blue-700 text-xs font-black uppercase tracking-widest rounded-full mt-1">
                                    {artisan.categories?.name}
                                  </span>
                                </div>
                              </div>
                              <div className="flex items-center bg-amber-50 px-3 py-1.5 rounded-2xl border border-amber-100/50 shadow-sm shadow-amber-500/5">
                                 <Star className="h-4 w-4 text-amber-500 fill-amber-500 mr-1.5" />
                                 <span className="text-sm font-black text-amber-700">4.9</span>
                              </div>
                            </div>
                            
                            <div className="mt-8 flex items-center space-x-8">
                              <div className="flex items-center">
                                <div className="h-8 w-8 rounded-full bg-slate-50 flex items-center justify-center mr-3 text-slate-400">
                                  <MapPin className="h-4 w-4" />
                                </div>
                                <span className="text-sm font-bold text-slate-600">{artisan.location_name || "Lagos"}</span>
                              </div>
                              <div className="flex items-center">
                                <div className="h-8 w-8 rounded-full bg-emerald-50 flex items-center justify-center mr-3 text-emerald-500">
                                  <Zap className="h-4 w-4" />
                                </div>
                                <span className="text-sm font-bold text-slate-600">{artisan.experience_years || 0} Years Exp.</span>
                              </div>
                            </div>
                          </div>
                          
                          <div className="bg-slate-50/50 border-t sm:border-t-0 sm:border-l border-slate-100 p-8 w-full sm:w-64 flex flex-col justify-center items-center">
                             <div className="text-center mb-6">
                                <p className="text-[10px] uppercase font-black text-slate-400 tracking-[0.2em] mb-3">Professional Status</p>
                                <div className="flex items-center justify-center text-slate-400 gap-2">
                                   <Lock className="h-3 w-3" />
                                   <span className="text-xs font-bold uppercase tracking-widest">Contact Locked</span>
                                </div>
                             </div>
                             <Button className="w-full h-14 rounded-2xl font-black text-sm uppercase tracking-widest shadow-lg shadow-blue-500/20 group-hover:scale-[1.02] transition-all bg-slate-900" asChild>
                               <Link href={`/worker/${artisan.id}`}>
                                 Open Profile <ChevronRight className="ml-2 h-4 w-4" />
                               </Link>
                             </Button>
                          </div>
                        </div>
                      </Card>
                    </motion.div>
                  ))}
                  
                  {filteredArtisans.length === 0 && !isLoading && (
                    <motion.div 
                      key="empty"
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="py-32 text-center bg-white rounded-[3rem] border-2 border-dashed border-slate-100"
                    >
                      <div className="mx-auto h-20 w-20 bg-slate-50 rounded-full flex items-center justify-center mb-6">
                         <Filter className="h-10 w-10 text-slate-200" />
                      </div>
                      <p className="text-slate-400 text-xl font-black tracking-tight">No experts found in this area.</p>
                      <p className="text-slate-400 font-medium mt-1">Try broadening your search or choosing a different region.</p>
                      <Button variant="link" className="mt-8 text-blue-600 font-black uppercase tracking-widest text-xs" onClick={() => {setSelectedRegion("All"); setSelectedCategory("All"); setSearch("");}}>
                        Reset All Filters
                      </Button>
                    </motion.div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </section>
        </div>
      </main>
    </div>
  );
}
