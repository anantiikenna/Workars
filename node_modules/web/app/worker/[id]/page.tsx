"use client";

import React, { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/Card";
import { ShieldCheck, MapPin, Star, User, Hammer, Phone, Mail, Lock, ChevronLeft, CreditCard, Award, Languages, Clock } from "lucide-react";
import Link from "next/link";

export default function WorkerProfile() {
  const { id } = useParams();
  const router = useRouter();
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [isPaying, setIsPaying] = useState(false);

  // Mock data for the specific worker
  const worker = {
    id: id,
    name: "James Wilson",
    skill: "Electrician",
    region: "Festac",
    rating: 4.8,
    jobs: 124,
    phone: "0801 234 5678",
    email: "james.w@workars.ng",
    bio: "Certified electrician with over 10 years of experience in residential and commercial wiring. Specializing in fault detection, generator maintenance, and solar installations.",
    skills: ["House Wiring", "Fault Detection", "Generator Service", "Solar Panel Installation"],
    reviews: [
      { id: "1", user: "Tunde K.", rating: 5, comment: "Very professional and arrived on time. Highly recommended!" },
      { id: "2", user: "Sarah O.", rating: 4, comment: "Good work, fixed my generator issues quickly." }
    ]
  };

  const handleUnlock = () => {
    setIsPaying(true);
    // Mock Paystack Payment
    setTimeout(() => {
      setIsPaying(false);
      setIsUnlocked(true);
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="px-4 lg:px-6 h-16 flex items-center border-b bg-white sticky top-0 z-50">
        <Link href="/marketplace" className="flex items-center text-blue-600 font-medium">
          <ChevronLeft className="h-4 w-4 mr-1" /> Back to Marketplace
        </Link>
      </header>

      <main className="container px-4 py-8 md:px-6 max-w-5xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left Column: Basic Info & Bio */}
          <div className="lg:col-span-2 space-y-8">
            <Card className="border-none shadow-sm overflow-hidden">
               <div className="h-48 bg-gradient-to-r from-blue-600 to-indigo-700 p-8 flex items-end">
                  <div className="flex items-center space-x-4 translate-y-12">
                     <div className="h-24 w-24 rounded-3xl bg-white p-1 shadow-xl">
                        <div className="h-full w-full rounded-[20px] bg-slate-200 flex items-center justify-center text-3xl font-bold text-blue-600">
                           JW
                        </div>
                     </div>
                     <div className="pb-2">
                        <div className="flex items-center space-x-2">
                           <h1 className="text-3xl font-extrabold text-slate-900 drop-shadow-sm">{worker.name}</h1>
                           <ShieldCheck className="h-6 w-6 text-blue-600" />
                        </div>
                        <p className="font-semibold text-slate-500">{worker.skill}</p>
                     </div>
                  </div>
               </div>
               
               <CardContent className="pt-20 space-y-6">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pb-6 border-b border-slate-100">
                     <div className="flex flex-col items-center">
                        <span className="text-2xl font-bold text-slate-900">{worker.rating}</span>
                        <div className="flex text-amber-500"><Star className="h-3 w-3 fill-current"/><Star className="h-3 w-3 fill-current"/><Star className="h-3 w-3 fill-current"/><Star className="h-3 w-3 fill-current"/><Star className="h-3 w-3 fill-current"/></div>
                        <span className="text-xs font-bold text-slate-400 uppercase mt-1">Rating</span>
                     </div>
                     <div className="flex flex-col items-center border-l border-slate-100">
                        <span className="text-2xl font-bold text-slate-900">{worker.jobs}</span>
                        <span className="text-xs font-bold text-slate-400 uppercase">Jobs Done</span>
                     </div>
                     <div className="flex flex-col items-center border-l border-slate-100">
                        <span className="text-2xl font-bold text-slate-900">10y</span>
                        <span className="text-xs font-bold text-slate-400 uppercase">Experience</span>
                     </div>
                     <div className="flex flex-col items-center border-l border-slate-100">
                        <span className="text-2xl font-bold text-slate-900">Fast</span>
                        <span className="text-xs font-bold text-slate-400 uppercase">Response</span>
                     </div>
                  </div>

                  <div>
                     <h2 className="text-xl font-bold mb-3 flex items-center"><User className="h-5 w-5 mr-2 text-blue-600"/> About</h2>
                     <p className="text-slate-600 leading-relaxed italic">"{worker.bio}"</p>
                  </div>

                  <div>
                     <h2 className="text-xl font-bold mb-4 flex items-center"><Award className="h-5 w-5 mr-2 text-blue-600"/> Specialized Skills</h2>
                     <div className="flex flex-wrap gap-2">
                        {worker.skills.map(skill => (
                           <span key={skill} className="px-3 py-1.5 bg-blue-50 text-blue-700 text-sm font-semibold rounded-full border border-blue-100">
                              {skill}
                           </span>
                        ))}
                     </div>
                  </div>

                  <div>
                     <h2 className="text-xl font-bold mb-4 flex items-center"><Clock className="h-5 w-5 mr-2 text-blue-600"/> Reviews ({worker.reviews.length})</h2>
                     <div className="space-y-4">
                        {worker.reviews.map(review => (
                           <div key={review.id} className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                              <div className="flex justify-between items-center mb-2">
                                 <span className="font-bold">{review.user}</span>
                                 <div className="flex text-amber-500">
                                    {[...Array(review.rating)].map((_, i) => <Star key={i} className="h-3 w-3 fill-current"/>)}
                                 </div>
                              </div>
                              <p className="text-slate-500 text-sm">"{review.comment}"</p>
                           </div>
                        ))}
                     </div>
                  </div>
               </CardContent>
            </Card>
          </div>

          {/* Right Column: Contact & Action */}
          <div className="space-y-6">
            <Card className="border-none shadow-xl sticky top-24 overflow-hidden">
               <CardHeader className="bg-slate-900 text-white pb-8">
                  <CardTitle className="text-lg flex items-center"><Phone className="h-5 w-5 mr-2"/> Contact Information</CardTitle>
               </CardHeader>
               
               <CardContent className="-mt-6 bg-white rounded-t-3xl pt-8 pb-8">
                  {isUnlocked ? (
                    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                       <div className="flex items-center p-4 bg-emerald-50 rounded-2xl border border-emerald-100">
                          <div className="h-10 w-10 rounded-full bg-emerald-500 flex items-center justify-center text-white mr-4">
                             <Phone className="h-5 w-5" />
                          </div>
                          <div>
                             <p className="text-xs font-bold text-emerald-600 uppercase">Phone Number</p>
                             <p className="text-lg font-bold text-slate-900">{worker.phone}</p>
                          </div>
                       </div>
                       <div className="flex items-center p-4 bg-blue-50 rounded-2xl border border-blue-100">
                          <div className="h-10 w-10 rounded-full bg-blue-500 flex items-center justify-center text-white mr-4">
                             <Mail className="h-5 w-5" />
                          </div>
                          <div>
                             <p className="text-xs font-bold text-blue-600 uppercase">Email Address</p>
                             <p className="text-lg font-bold text-slate-900">{worker.email}</p>
                          </div>
                       </div>
                       <div className="flex items-center p-4 bg-slate-50 rounded-2xl border border-slate-100">
                          <div className="h-10 w-10 rounded-full bg-indigo-500 flex items-center justify-center text-white mr-4">
                             <MapPin className="h-5 w-5" />
                          </div>
                          <div>
                             <p className="text-xs font-bold text-indigo-600 uppercase">Region</p>
                             <p className="text-lg font-bold text-slate-900">{worker.region}, Lagos</p>
                          </div>
                       </div>
                    </div>
                  ) : (
                    <div className="text-center py-6 space-y-6">
                       <div className="mx-auto h-20 w-20 bg-slate-100 rounded-full flex items-center justify-center mb-4">
                          <Lock className="h-10 w-10 text-slate-400" />
                       </div>
                       <div className="space-y-2">
                          <h3 className="text-xl font-bold text-slate-900">Contact Details Locked</h3>
                          <p className="text-sm text-slate-500">To protect our artisans, you must pay a small fee to unlock their contact information.</p>
                       </div>
                       
                       <div className="bg-blue-600 text-white px-4 py-8 rounded-3xl space-y-4">
                          <div>
                             <p className="text-xs font-bold uppercase tracking-widest opacity-80">Unlock Fee</p>
                             <p className="text-4xl font-black">N1,000</p>
                          </div>
                          <Button 
                             onClick={handleUnlock}
                             className="w-full bg-white text-blue-600 hover:bg-slate-100 h-14 text-lg font-bold shadow-2xl transition-transform active:scale-95"
                             disabled={isPaying}
                          >
                             {isPaying ? "Processing..." : <><CreditCard className="h-5 w-5 mr-2"/> Pay via Paystack</>}
                          </Button>
                       </div>
                       
                       <p className="text-[10px] text-slate-400 font-medium">
                          100% Secure Transaction • No recurring charges
                       </p>
                    </div>
                  )}
               </CardContent>
               <CardFooter className="bg-slate-50 py-4 border-t border-slate-100 flex justify-center space-x-4">
                  <ShieldCheck className="h-4 w-4 text-slate-300" />
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Workars Verified Professional</span>
               </CardFooter>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
