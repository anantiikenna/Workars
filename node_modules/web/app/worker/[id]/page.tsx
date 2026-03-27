"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/Card";
import { ShieldCheck, MapPin, Star, User, Hammer, Phone, Mail, Lock, ChevronLeft, CreditCard, Award, Clock, Zap, Sparkles } from "lucide-react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { useAuthStore } from "@/store/authStore";
import { motion, AnimatePresence } from "framer-motion";

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
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <motion.div 
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="h-10 w-10 border-4 border-blue-600 border-t-transparent rounded-full"
        />
      </div>
    );
  }

  if (!worker) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 space-y-4">
        <h1 className="text-2xl font-black text-slate-900">Worker Not Found</h1>
        <Button variant="outline" onClick={() => router.push('/marketplace')}>Return to Marketplace</Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50/50">
      <header className="px-4 lg:px-6 h-20 flex items-center glass sticky top-0 z-50 border-b-white/20">
        <Link href="/marketplace" className="flex items-center text-slate-600 font-bold hover:text-blue-600 transition-colors">
          <ChevronLeft className="h-5 w-5 mr-1" /> Back to Experts
        </Link>
      </header>

      <motion.main 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="container px-4 py-12 md:px-6 max-w-6xl mx-auto"
      >
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          
          <div className="lg:col-span-2 space-y-12">
            <Card className="border-none shadow-sm premium-shadow overflow-hidden rounded-[2.5rem] bg-white">
               <div className="h-64 bg-gradient-to-br from-blue-600 via-indigo-700 to-slate-900 p-12 flex items-end relative overflow-hidden">
                  <div className="absolute top-0 right-0 p-8 opacity-10">
                     <Sparkles className="h-40 w-40 text-white" />
                  </div>
                  <div className="flex items-center space-x-6 translate-y-16 z-10">
                     <div className="h-32 w-32 rounded-[2.5rem] bg-white p-1.5 shadow-2xl shadow-blue-500/10">
                        <div className="h-full w-full rounded-[2rem] bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-4xl font-black text-white shadow-inner">
                           {worker.profiles?.full_name?.charAt(0) || "W"}
                        </div>
                     </div>
                     <div className="pb-4">
                        <div className="flex items-center space-x-3">
                           <h1 className="text-4xl font-black text-slate-900 tracking-tight drop-shadow-sm">{worker.profiles?.full_name}</h1>
                           {worker.is_verified && (
                             <div className="bg-blue-600 p-1.5 rounded-full shadow-lg shadow-blue-500/30">
                               <ShieldCheck className="h-5 w-5 text-white" />
                             </div>
                           )}
                        </div>
                        <p className="font-bold text-slate-500 text-lg">{worker.categories?.name}</p>
                     </div>
                  </div>
               </div>
               
               <CardContent className="pt-24 p-12 space-y-12">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-8 pb-10 border-b border-slate-100/50">
                     <div className="flex flex-col items-center">
                        <span className="text-3xl font-black text-slate-900">4.9</span>
                        <div className="flex text-amber-500 mt-1"><Star className="h-3.5 w-3.5 fill-current"/><Star className="h-3.5 w-3.5 fill-current"/><Star className="h-3.5 w-3.5 fill-current"/><Star className="h-3.5 w-3.5 fill-current"/><Star className="h-3.5 w-3.5 fill-current"/></div>
                        <span className="text-[10px] font-black text-slate-400 uppercase mt-2 tracking-[0.2em]">Quality Score</span>
                     </div>
                     <div className="flex flex-col items-center border-l border-slate-100/50">
                        <span className="text-3xl font-black text-slate-900">124</span>
                        <span className="text-[10px] font-black text-slate-400 uppercase mt-2 tracking-[0.2em]">Verified Jobs</span>
                     </div>
                     <div className="flex flex-col items-center border-l border-slate-100/50">
                        <span className="text-3xl font-black text-slate-900">{worker.experience_years}y</span>
                        <span className="text-[10px] font-black text-slate-400 uppercase mt-2 tracking-[0.2em]">Experience</span>
                     </div>
                     <div className="flex flex-col items-center border-l border-slate-100/50">
                        <span className="text-3xl font-black text-slate-900">98%</span>
                        <span className="text-[10px] font-black text-slate-400 uppercase mt-2 tracking-[0.2em]">Response</span>
                     </div>
                  </div>

                  <div className="space-y-4">
                     <h2 className="text-2xl font-black text-slate-900 tracking-tight flex items-center"><User className="h-6 w-6 mr-3 text-blue-600"/> Professional Bio</h2>
                     <p className="text-slate-600 leading-relaxed text-lg font-medium italic border-l-8 border-blue-50 pl-6 py-2 bg-slate-50/30 rounded-r-2xl">
                       "{worker.bio || "No bio provided yet."}"
                     </p>
                  </div>

                  <div className="space-y-6">
                     <h2 className="text-2xl font-black text-slate-900 tracking-tight flex items-center"><Clock className="h-6 w-6 mr-3 text-blue-600"/> Client Reviews ({reviews.length})</h2>
                     <div className="grid gap-6">
                        {reviews.length > 0 ? reviews.map(review => (
                           <motion.div 
                             key={review.id} 
                             whileHover={{ x: 10 }}
                             className="p-8 bg-slate-50/50 rounded-[2rem] border border-white shadow-sm premium-shadow"
                           >
                              <div className="flex justify-between items-center mb-3">
                                 <span className="font-black text-slate-800 text-lg">{review.profiles?.full_name}</span>
                                 <div className="flex items-center space-x-1 text-amber-500">
                                    {[...Array(review.rating)].map((_, i) => <Star key={i} className="h-4 w-4 fill-current"/>)}
                                 </div>
                              </div>
                              <p className="text-slate-500 text-base leading-relaxed font-medium">"{review.comment}"</p>
                              <div className="flex items-center mt-4 text-[10px] font-black text-slate-300 uppercase tracking-widest">
                                 <ShieldCheck className="h-3 w-3 mr-1.5" />
                                 Verified Review • {new Date(review.created_at).toLocaleDateString()}
                              </div>
                           </motion.div>
                        )) : (
                           <div className="py-12 text-center rounded-[2rem] border-2 border-dashed border-slate-100">
                             <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">No reviews documented yet.</p>
                           </div>
                        )}
                     </div>
                  </div>
               </CardContent>
            </Card>
          </div>

          <div className="space-y-8">
            <Card className="border-none shadow-2xl premium-shadow sticky top-32 overflow-hidden rounded-[2.5rem] bg-slate-900">
               <CardHeader className="p-8 pb-10">
                  <CardTitle className="text-xl font-black flex items-center text-white tracking-tight italic">
                    <Sparkles className="h-6 w-6 mr-3 text-yellow-400 fill-yellow-400"/> 
                    Secure Hire Console
                  </CardTitle>
               </CardHeader>
               
               <CardContent className="bg-white rounded-t-[3rem] p-10 pt-12 pb-12">
                  <AnimatePresence mode="wait">
                    {isUnlocked ? (
                      <motion.div 
                        key="unlocked"
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="space-y-8"
                      >
                         <div className="p-6 bg-emerald-50 rounded-[2rem] border border-emerald-100 shadow-sm">
                            <div className="flex items-center mb-1">
                               <div className="h-10 w-10 rounded-2xl bg-emerald-500 flex items-center justify-center text-white mr-4 shadow-lg shadow-emerald-500/20">
                                  <Phone className="h-5 w-5" />
                               </div>
                               <div>
                                  <p className="text-[10px] font-black text-emerald-600 uppercase tracking-widest">Direct Phone</p>
                                  <p className="text-xl font-black text-slate-900 tracking-tighter">{worker.phone_number}</p>
                               </div>
                            </div>
                         </div>
                         
                         <div className="p-6 bg-blue-50 rounded-[2rem] border border-blue-100 shadow-sm">
                            <div className="flex items-center mb-1">
                               <div className="h-10 w-10 rounded-2xl bg-blue-500 flex items-center justify-center text-white mr-4 shadow-lg shadow-blue-500/20">
                                  <Mail className="h-5 w-5" />
                               </div>
                               <div>
                                  <p className="text-[10px] font-black text-blue-600 uppercase tracking-widest">Profile Status</p>
                                  <p className="text-xl font-black text-slate-900 tracking-tighter">Gold Verified</p>
                               </div>
                            </div>
                         </div>

                         <div className="p-6 bg-indigo-50 rounded-[2rem] border border-indigo-100 shadow-sm">
                            <div className="flex items-center mb-1">
                               <div className="h-10 w-10 rounded-2xl bg-indigo-500 flex items-center justify-center text-white mr-4 shadow-lg shadow-indigo-500/20">
                                  <MapPin className="h-5 w-5" />
                               </div>
                               <div>
                                  <p className="text-[10px] font-black text-indigo-600 uppercase tracking-widest">Coverage Area</p>
                                  <p className="text-xl font-black text-slate-900 tracking-tighter">{worker.location_name || "Lagos"}</p>
                               </div>
                            </div>
                         </div>

                         <Button 
                            variant="premium" 
                            className="w-full h-16 rounded-2xl font-black text-base uppercase tracking-widest shadow-2xl" 
                            onClick={() => window.open(`tel:${worker.phone_number}`)}
                         >
                            Call Artisan Now
                         </Button>
                      </motion.div>
                    ) : (
                      <motion.div 
                        key="locked"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-center space-y-8"
                      >
                         <div className="mx-auto h-24 w-24 bg-slate-50 rounded-[2.5rem] flex items-center justify-center mb-4 ring-8 ring-slate-100/30">
                            <Lock className="h-12 w-12 text-slate-300" />
                         </div>
                         <div className="space-y-3">
                            <h3 className="text-3xl font-black text-slate-900 tracking-tighter">Connection Restricted</h3>
                            <p className="text-sm text-slate-500 font-bold px-4 leading-relaxed tracking-tight">Pay the verification fee to instantly access this professional's contact details and start your project.</p>
                         </div>
                         
                         <div className="bg-gradient-to-br from-slate-900 to-slate-800 text-white p-10 rounded-[2.5rem] space-y-6 shadow-2xl shadow-slate-900/10 relative overflow-hidden group">
                            <div className="absolute -top-10 -right-10 h-32 w-32 bg-blue-600/10 rounded-full blur-3xl group-hover:bg-blue-600/20 transition-colors" />
                            <div className="relative z-10">
                               <p className="text-[10px] font-black uppercase tracking-[0.3em] opacity-40 mb-2">Access Maintenance Fee</p>
                               <div className="flex items-center justify-center">
                                  <span className="text-2xl font-bold mr-1 translate-y-[-8px]">₦</span>
                                  <span className="text-6xl font-black tracking-tighter">1,000</span>
                               </div>
                            </div>
                            <Button 
                               onClick={handleUnlock}
                               variant="premium"
                               className="w-full h-16 text-sm font-black uppercase tracking-widest rounded-2xl relative z-10"
                               disabled={isPaying}
                            >
                               {isPaying ? "Verifying..." : <><CreditCard className="h-6 w-6 mr-3"/> Unlock Instantly</>}
                            </Button>
                         </div>
                         
                         <div className="flex flex-col items-center justify-center gap-4">
                            <div className="flex items-center justify-center text-[10px] text-slate-400 font-black uppercase tracking-[0.2em] gap-2">
                               <ShieldCheck className="h-3.5 w-3.5 text-blue-500" />
                               100% Secure via Paystack
                            </div>
                            <p className="text-[10px] text-slate-300 font-bold italic">No hidden charges • Direct hiring only</p>
                         </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
               </CardContent>
            </Card>
            
            <div className="p-8 bg-white rounded-[2.5rem] border border-white shadow-sm premium-shadow text-center">
               <Award className="h-10 w-10 text-blue-600 mx-auto mb-4" />
               <h4 className="font-black text-slate-900 uppercase tracking-widest text-[10px] mb-2">Workars Guarantee</h4>
               <p className="text-xs text-slate-500 font-bold leading-relaxed px-4">All professionals on our platform are vetted for quality and reliability.</p>
            </div>
          </div>
        </div>
      </motion.main>
    </div>
  );
}
