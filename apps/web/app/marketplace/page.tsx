"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/Card";
import { Search, MapPin, Star, ShieldCheck, Filter, ChevronRight, Lock } from "lucide-react";
import { REGIONS } from "@/constants/regions";
import { SKILLS } from "@/constants/skills";
import Link from "next/link";

// Mock Data
const MOCK_WORKERS = [
  { id: "1", name: "James Wilson", skill: "Electrician", region: "Festac", rating: 4.8, jobs: 124, logo: "JW" },
  { id: "2", name: "Babatunde Obi", skill: "Plumber", region: "Lekki", rating: 4.5, jobs: 89, logo: "BO" },
  { id: "3", name: "Chioma Ade", skill: "Carpenter", region: "Ikeja", rating: 4.9, jobs: 210, logo: "CA" },
  { id: "4", name: "Samuel Edet", skill: "Electrician", region: "Surulere", rating: 4.7, jobs: 56, logo: "SE" },
  { id: "5", name: "Joy Okon", skill: "Painter", region: "Yaba", rating: 4.6, jobs: 112, logo: "JO" },
];

export default function Marketplace() {
  const [selectedRegion, setSelectedRegion] = useState("All");
  const [selectedSkill, setSelectedSkill] = useState("All");
  const [search, setSearch] = useState("");

  const filteredWorkers = MOCK_WORKERS.filter(w => {
    return (selectedRegion === "All" || w.region === selectedRegion) &&
           (selectedSkill === "All" || w.skill === selectedSkill) &&
           (w.name.toLowerCase().includes(search.toLowerCase()) || w.skill.toLowerCase().includes(search.toLowerCase()))
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
            onChangeText={(e) => setSearch(e.target.value)}
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
              <div className="space-y-2">
                <button 
                  onClick={() => setSelectedRegion("All")}
                  className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${selectedRegion === "All" ? "bg-blue-600 text-white" : "hover:bg-white"}`}
                >
                  All Regions
                </button>
                {REGIONS.map(r => (
                  <button 
                    key={r}
                    onClick={() => setSelectedRegion(r)}
                    className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${selectedRegion === r ? "bg-blue-600 text-white" : "hover:bg-white"}`}
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
              <div className="space-y-2">
                <button 
                  onClick={() => setSelectedSkill("All")}
                  className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${selectedSkill === "All" ? "bg-blue-600 text-white" : "hover:bg-white"}`}
                >
                  All Skills
                </button>
                {SKILLS.map(s => (
                  <button 
                    key={s}
                    onClick={() => setSelectedSkill(s)}
                    className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${selectedSkill === s ? "bg-blue-600 text-white" : "hover:bg-white"}`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          </aside>

          {/* Artisan Listing */}
          <section className="flex-1">
            <div className="flex items-center justify-between mb-6">
               <h2 className="text-2xl font-bold">{filteredWorkers.length} Professionals Found</h2>
            </div>

            <div className="grid gap-6">
              {filteredWorkers.map(worker => (
                <Card key={worker.id} className="overflow-hidden border-none shadow-sm hover:shadow-md transition-shadow group">
                  <div className="flex flex-col sm:flex-row">
                    <div className="p-6 flex-1">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center space-x-4">
                          <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold text-xl">
                            {worker.logo}
                          </div>
                          <div>
                            <div className="flex items-center space-x-2">
                              <h3 className="text-xl font-bold">{worker.name}</h3>
                              <ShieldCheck className="h-5 w-5 text-blue-500" />
                            </div>
                            <p className="text-slate-500 font-medium">{worker.skill}</p>
                          </div>
                        </div>
                        <div className="flex items-center bg-amber-50 px-2 py-1 rounded-lg">
                           <Star className="h-4 w-4 text-amber-500 fill-amber-500 mr-1" />
                           <span className="text-sm font-bold text-amber-700">{worker.rating}</span>
                        </div>
                      </div>
                      
                      <div className="mt-6 flex items-center space-x-6 text-sm text-slate-400">
                        <div className="flex items-center">
                          <MapPin className="h-4 w-4 mr-1" />
                          {worker.region}, Lagos
                        </div>
                        <div className="flex items-center">
                          <Zap className="h-4 w-4 mr-1 text-emerald-500" />
                          {worker.jobs} Jobs Completed
                        </div>
                      </div>
                    </div>
                    
                    <div className="bg-slate-50 border-t sm:border-t-0 sm:border-l p-6 w-full sm:w-64 flex flex-col justify-between">
                       <div className="space-y-2">
                          <p className="text-xs uppercase font-bold text-slate-400">Contact Details</p>
                          <div className="flex items-center text-slate-400 grayscale">
                             <Lock className="h-3 w-3 mr-2" />
                             <span className="text-sm italic">Locked</span>
                          </div>
                       </div>
                       <Button className="w-full mt-4 group-hover:bg-blue-700 h-11" asChild>
                         <Link href={`/worker/${worker.id}`}>
                           View Profile <ChevronRight className="ml-2 h-4 w-4" />
                         </Link>
                       </Button>
                    </div>
                  </div>
                </Card>
              ))}
              
              {filteredWorkers.length === 0 && (
                <div className="py-24 text-center">
                  <p className="text-slate-400 text-lg">No artisans matches your search criteria.</p>
                  <Button variant="link" onClick={() => {setSelectedRegion("All"); setSelectedSkill("All"); setSearch("");}}>
                    Clear all filters
                  </Button>
                </div>
              )}
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
