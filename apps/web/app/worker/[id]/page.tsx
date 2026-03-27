"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/Card";
import { ShieldCheck, MapPin, Star, User, Hammer, Phone, Mail, Lock, ChevronLeft, CreditCard, Award, Clock, Zap } from "lucide-react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { useAuthStore } from "@/store/authStore";

export default function WorkerProfile() {
  const { id } = useParams();
  const router = useRouter();
  const currentUser = useAuthStore((state) => state.user);
  
  const [worker, setWorker] = useState<any>(null);
  const [reviews, setReviews] = useState<any[]>([]);
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isPaying, setIsPaying] = useState(false);

  useEffect(() => {
    async function fetchWorker() {
      if (!id) return;
      setIsLoading(true);

      const { data: workerData } = await supabase
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
        .eq('id', id)
        .single();
      
      if (workerData) setWorker(workerData);

      // Fetch reviews
      const { data: reviewData } = await supabase
        .from('reviews')
        .select(`
          *,
          profiles:customer_id (
            full_name
          )
        `)
        .eq('worker_id', id);
      
      if (reviewData) setReviews(reviewData);

      // Check if unlocked
      if (currentUser) {
        const { data: unlockData } = await supabase
          .from('contacts_unlocked')
          .select('*')
          .eq('customer_id', currentUser.id)
          .eq('worker_id', id)
          .single();
        
        if (unlockData) setIsUnlocked(true);
      }

      setIsLoading(false);
    }

    fetchWorker();
  }, [id, currentUser]);

  const handleUnlock = async () => {
    if (!currentUser) {
      router.push(`/auth?redirect=/worker/${id}`);
      return;
    }

    setIsPaying(true);
    // Real Paystack integration would go here
    // For now, we simulate success and insert into DB
    setTimeout(async () => {
      const { error } = await supabase
        .from('contacts_unlocked')
        .insert({
          customer_id: currentUser.id,
          worker_id: id as string,
          payment_ref: `TEST_${Date.now()}`
        });
      
      if (!error) setIsUnlocked(true);
      setIsPaying(false);
    }, 2000);
  };

  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center">Loading Profile...</div>;
  }

  if (!worker) {
    return <div className="min-h-screen flex items-center justify-center">Worker not found</div>;
  }

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
            <Card className="border-none shadow-sm overflow-hidden rounded-3xl">
               <div className="h-48 bg-gradient-to-r from-blue-600 to-indigo-700 p-8 flex items-end">
                  <div className="flex items-center space-x-4 translate-y-12">
                     <div className="h-24 w-24 rounded-3xl bg-white p-1 shadow-xl">
                        <div className="h-full w-full rounded-[20px] bg-slate-200 flex items-center justify-center text-3xl font-bold text-blue-600">
                           {worker.profiles?.full_name?.charAt(0) || "W"}
                        </div>
                     </div>
                     <div className="pb-2">
                        <div className="flex items-center space-x-2">
                           <h1 className="text-3xl font-extrabold text-slate-900 drop-shadow-sm">{worker.profiles?.full_name}</h1>
                           {worker.is_verified && <ShieldCheck className="h-6 w-6 text-blue-600" />}
                        </div>
                        <p className="font-semibold text-slate-500">{worker.categories?.name}</p>
                     </div>
                  </div>
               </div>
               
               <CardContent className="pt-20 space-y-8">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pb-6 border-b border-slate-100">
                     <div className="flex flex-col items-center">
                        <span className="text-2xl font-bold text-slate-900">4.9</span>
                        <div className="flex text-amber-500"><Star className="h-3 w-3 fill-current"/><Star className="h-3 w-3 fill-current"/><Star className="h-3 w-3 fill-current"/><Star className="h-3 w-3 fill-current"/><Star className="h-3 w-3 fill-current"/></div>
                        <span className="text-xs font-bold text-slate-400 uppercase mt-1 tracking-tighter">Rating</span>
                     </div>
                     <div className="flex flex-col items-center border-l border-slate-100">
                        <span className="text-2xl font-bold text-slate-900">124</span>
                        <span className="text-xs font-bold text-slate-400 uppercase tracking-tighter">Jobs Done</span>
                     </div>
                     <div className="flex flex-col items-center border-l border-slate-100">
                        <span className="text-2xl font-bold text-slate-900">{worker.experience_years}y</span>
                        <span className="text-xs font-bold text-slate-400 uppercase tracking-tighter">Experience</span>
                     </div>
                     <div className="flex flex-col items-center border-l border-slate-100">
                        <span className="text-2xl font-bold text-slate-900">Fast</span>
                        <span className="text-xs font-bold text-slate-400 uppercase tracking-tighter">Response</span>
                     </div>
                  </div>

                  <div>
                     <h2 className="text-xl font-bold mb-3 flex items-center text-slate-800"><User className="h-5 w-5 mr-2 text-blue-600"/> About Me</h2>
                     <p className="text-slate-600 leading-relaxed italic border-l-4 border-blue-100 pl-4 py-1">
                       {worker.bio || "No bio provided yet."}
                     </p>
                  </div>

                  <div>
                     <h2 className="text-xl font-bold mb-4 flex items-center text-slate-800"><Clock className="h-5 w-5 mr-2 text-blue-600"/> Client Reviews ({reviews.length})</h2>
                     <div className="space-y-4">
                        {reviews.length > 0 ? reviews.map(review => (
                           <div key={review.id} className="p-5 bg-white rounded-2xl shadow-sm border border-slate-50">
                              <div className="flex justify-between items-center mb-2">
                                 <span className="font-bold text-slate-800">{review.profiles?.full_name}</span>
                                 <div className="flex text-amber-500">
                                    {[...Array(review.rating)].map((_, i) => <Star key={i} className="h-3 w-3 fill-current"/>)}
                                 </div>
                              </div>
                              <p className="text-slate-500 text-sm leading-relaxed">"{review.comment}"</p>
                              <p className="text-[10px] text-slate-300 mt-2 font-bold uppercase tracking-widest">{new Date(review.created_at).toLocaleDateString()}</p>
                           </div>
                        )) : (
                           <p className="text-slate-400 italic">No reviews yet.</p>
                        )}
                     </div>
                  </div>
               </CardContent>
            </Card>
          </div>

          {/* Right Column: Contact & Action */}
          <div className="space-y-6">
            <Card className="border-none shadow-xl sticky top-24 overflow-hidden rounded-3xl">
               <CardHeader className="bg-slate-900 text-white pb-8">
                  <CardTitle className="text-lg flex items-center"><Zap className="h-5 w-5 mr-2 text-yellow-500"/> Contact Information</CardTitle>
               </CardHeader>
               
               <CardContent className="-mt-6 bg-white rounded-t-3xl pt-8 pb-8">
                  {isUnlocked ? (
                    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                       <div className="flex items-center p-4 bg-emerald-50 rounded-2xl border border-emerald-100">
                          <div className="h-10 w-10 rounded-full bg-emerald-500 flex items-center justify-center text-white mr-4 shadow-sm">
                             <Phone className="h-5 w-5" />
                          </div>
                          <div>
                             <p className="text-xs font-extrabold text-emerald-600 uppercase tracking-tighter">Phone Number</p>
                             <p className="text-lg font-bold text-slate-900">{worker.phone_number}</p>
                          </div>
                       </div>
                       <div className="flex items-center p-4 bg-blue-50 rounded-2xl border border-blue-100">
                          <div className="h-10 w-10 rounded-full bg-blue-500 flex items-center justify-center text-white mr-4 shadow-sm">
                             <Mail className="h-5 w-5" />
                          </div>
                          <div>
                             <p className="text-xs font-extrabold text-blue-600 uppercase tracking-tighter">Account Status</p>
                             <p className="text-lg font-bold text-slate-900">Verified Professional</p>
                          </div>
                       </div>
                       <div className="flex items-center p-4 bg-slate-50 rounded-2xl border border-slate-100">
                          <div className="h-10 w-10 rounded-full bg-indigo-500 flex items-center justify-center text-white mr-4 shadow-sm">
                             <MapPin className="h-5 w-5" />
                          </div>
                          <div>
                             <p className="text-xs font-extrabold text-indigo-600 uppercase tracking-tighter">Primary Region</p>
                             <p className="text-lg font-bold text-slate-900">{worker.location_name || "Lagos"}</p>
                          </div>
                       </div>
                       <Button className="w-full h-11 bg-slate-900 hover:bg-black font-bold" onClick={() => window.open(`tel:${worker.phone_number}`)}>
                          Call Now
                       </Button>
                    </div>
                  ) : (
                    <div className="text-center py-6 space-y-6">
                       <div className="mx-auto h-20 w-20 bg-slate-50 rounded-full flex items-center justify-center mb-4 ring-8 ring-slate-100/50">
                          <Lock className="h-10 w-10 text-slate-300" />
                       </div>
                       <div className="space-y-2">
                          <h3 className="text-xl font-black text-slate-900 tracking-tight">Access Restricted</h3>
                          <p className="text-sm text-slate-500 font-medium px-4">Pay a small verification fee to unlock this artisan's contact details instantly.</p>
                       </div>
                       
                       <div className="bg-gradient-to-br from-blue-600 to-indigo-700 text-white px-4 py-8 rounded-3xl space-y-5 shadow-inner">
                          <div>
                             <p className="text-[10px] font-black uppercase tracking-[0.2em] opacity-80">One-Time Fee</p>
                             <p className="text-5xl font-black">₦1,000</p>
                          </div>
                          <Button 
                             onClick={handleUnlock}
                             className="w-full bg-white text-blue-600 hover:bg-blue-50 h-14 text-lg font-bold shadow-2xl transition-all active:scale-95"
                             disabled={isPaying}
                          >
                             {isPaying ? "Verifying..." : <><CreditCard className="h-5 w-5 mr-2"/> Unlock Contact</>}
                          </Button>
                       </div>
                       
                       <div className="flex items-center justify-center text-[10px] text-slate-400 font-bold uppercase tracking-widest gap-2">
                          <ShieldCheck className="h-3 w-3" />
                          Secured by Paystack
                       </div>
                    </div>
                  )}
               </CardContent>
               <CardFooter className="bg-slate-50/50 py-4 border-t border-slate-100 flex justify-center space-x-2">
                  <ShieldCheck className="h-3.5 w-3.5 text-blue-500" />
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.1em]">Quality Guaranteed</span>
               </CardFooter>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
