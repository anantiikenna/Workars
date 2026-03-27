"use client";

import React, { useState, useEffect } from "react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { ShieldCheck, Hammer, CheckCircle, BarChart3, Users, DollarSign, AlertCircle } from "lucide-react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('approvals');
  
  // States
  const [pendingWorkers, setPendingWorkers] = useState<any[]>([]);
  const [allUsers, setAllUsers] = useState<any[]>([]);
  const [allJobs, setAllJobs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const [stats, setStats] = useState({ revenue: 0, activeWorkers: 0, totalCustomers: 0 });

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    setLoading(true);
    
    // 1. Pending workers (is_verified = false)
    const { data: pending } = await supabase
      .from('workers')
      .select('*, profiles(full_name, phone_number), categories(name)')
      .eq('is_verified', false);
    if (pending) setPendingWorkers(pending);

    // 2. All Users
    const { data: usersData } = await supabase
      .from('profiles')
      .select('*')
      .order('created_at', { ascending: false });
    if (usersData) setAllUsers(usersData);

    // 3. All Jobs
    const { data: jobsData } = await supabase
      .from('jobs')
      .select('*, worker:profiles!worker_id(full_name), customer:profiles!customer_id(full_name)')
      .order('created_at', { ascending: false });
    if (jobsData) setAllJobs(jobsData);
    
    // 4. Calculate Stats
    let rev = 0;
    jobsData?.forEach(j => { if (j.payment_status === 'released') rev += Number(j.price || 0); });
    const active = usersData?.filter(u => u.role === 'worker')?.length || 0;
    const totals = usersData?.filter(u => u.role === 'customer')?.length || 0;
    
    setStats({ revenue: rev, activeWorkers: active, totalCustomers: totals });
    setLoading(false);
  };

  const handleApproveWorker = async (id: string) => {
    const { error } = await supabase.from('workers').update({ is_verified: true }).eq('id', id);
    if (!error) {
      setPendingWorkers(pendingWorkers.filter(w => w.id !== id));
      alert("Worker Verified!");
    }
  };

  const handleReleasePayment = async (jobId: string) => {
    const { error } = await supabase.from('jobs').update({ payment_status: 'released' }).eq('id', jobId);
    if (!error) {
      alert("Payment Released to Worker!");
      fetchDashboardData();
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-slate-900 text-white flex flex-col p-6 space-y-8 hidden md:flex">
        <Link href="/" className="text-2xl font-black tracking-tighter text-blue-400">
           WORKARS.ADMIN
        </Link>
        <nav className="flex-1 space-y-2">
           <button onClick={() => setActiveTab('stats')} className={`w-full flex items-center p-3 rounded-xl transition-colors ${activeTab === 'stats' ? 'bg-blue-600 font-bold' : 'hover:bg-slate-800 text-slate-400'}`}>
              <BarChart3 className="h-5 w-5 mr-3" /> Dashboard
           </button>
           <button onClick={() => setActiveTab('approvals')} className={`w-full flex items-center p-3 rounded-xl transition-colors ${activeTab === 'approvals' ? 'bg-blue-600 font-bold' : 'hover:bg-slate-800 text-slate-400'}`}>
              <ShieldCheck className="h-5 w-5 mr-3" /> Approvals
              {pendingWorkers.length > 0 && (
                <span className="ml-auto bg-red-500 text-white text-[10px] px-1.5 py-0.5 rounded-full font-bold animate-pulse">
                   {pendingWorkers.length}
                </span>
              )}
           </button>
           <button onClick={() => setActiveTab('users')} className={`w-full flex items-center p-3 rounded-xl transition-colors ${activeTab === 'users' ? 'bg-blue-600 font-bold' : 'hover:bg-slate-800 text-slate-400'}`}>
              <Users className="h-5 w-5 mr-3" /> All Users
           </button>
           <button onClick={() => setActiveTab('finance')} className={`w-full flex items-center p-3 rounded-xl transition-colors ${activeTab === 'finance' ? 'bg-blue-600 font-bold' : 'hover:bg-slate-800 text-slate-400'}`}>
              <DollarSign className="h-5 w-5 mr-3" /> Jobs & Escrow
           </button>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto p-4 md:p-10 space-y-10">
        <header className="flex items-center justify-between">
           <div>
              <h1 className="text-3xl font-black text-slate-900 uppercase tracking-tight">System Oversight</h1>
              <p className="text-slate-500 font-medium">Monitoring Workars Platform Health & Growth</p>
           </div>
        </header>

        {loading ? (
          <div className="flex justify-center items-center h-64"><p className="text-xl font-bold animate-pulse">Loading System Data...</p></div>
        ) : (
          <>
            {/* Top Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
               <Card className="border-none shadow-sm bg-indigo-600 text-white overflow-hidden p-6 relative">
                  <div className="relative z-10">
                     <p className="text-indigo-100 font-bold text-xs uppercase tracking-widest mb-2">Total Platform Payouts</p>
                     <h2 className="text-4xl font-black">N{stats.revenue.toLocaleString()}</h2>
                  </div>
                  <DollarSign className="absolute -right-4 -bottom-4 h-32 w-32 text-white opacity-10" />
               </Card>
               <Card className="border-none shadow-sm p-6 relative bg-white">
                  <p className="text-slate-400 font-bold text-xs uppercase tracking-widest mb-2">Total Workers</p>
                  <h2 className="text-4xl font-black text-slate-900">{stats.activeWorkers}</h2>
                  <Hammer className="absolute -right-4 -bottom-4 h-32 w-32 text-blue-600 opacity-5" />
               </Card>
               <Card className="border-none shadow-sm p-6 relative bg-white">
                  <p className="text-slate-400 font-bold text-xs uppercase tracking-widest mb-2">Total Customers</p>
                  <h2 className="text-4xl font-black text-slate-900">{stats.totalCustomers}</h2>
                  <Users className="absolute -right-4 -bottom-4 h-32 w-32 text-indigo-600 opacity-5" />
               </Card>
            </div>

            {/* Approvals Tab */}
            {activeTab === 'approvals' && (
               <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                  <h2 className="text-xl font-black uppercase tracking-tight flex items-center mb-6">
                     <ShieldCheck className="h-6 w-6 mr-2 text-blue-600" /> Artisan Approval Queue
                  </h2>
                  <div className="bg-white rounded-3xl shadow-sm border overflow-hidden">
                     <div className="grid grid-cols-4 bg-slate-50 p-4 font-bold text-xs text-slate-400 uppercase tracking-widest border-b">
                        <div className="col-span-2">Professional</div>
                        <div>Category / Location</div>
                        <div className="text-right">Action</div>
                     </div>
                     <div className="divide-y">
                        {pendingWorkers.length > 0 ? pendingWorkers.map((worker) => (
                           <div key={worker.id} className="grid grid-cols-4 p-4 items-center gap-4 hover:bg-slate-50 transition-colors">
                              <div className="col-span-2">
                                 <p className="font-bold text-slate-900">{worker.profiles?.full_name || worker.profiles?.phone_number || 'Unknown'}</p>
                                 <p className="text-xs text-slate-400 font-bold">Joined: {new Date(worker.created_at).toLocaleDateString()}</p>
                              </div>
                              <div className="text-sm font-bold text-slate-600">{worker.categories?.name || 'Any'} • {worker.location_name || 'N/A'}</div>
                              <div className="flex items-center justify-end space-x-2">
                                 <Button onClick={() => handleApproveWorker(worker.id)} className="bg-emerald-600 hover:bg-emerald-700 h-9 px-3">
                                    <CheckCircle className="h-4 w-4 mr-2" /> Verify
                                 </Button>
                              </div>
                           </div>
                        )) : (
                           <div className="py-20 text-center space-y-4">
                              <p className="text-slate-400 font-bold">Queue Clear! All workers have been processed.</p>
                           </div>
                        )}
                     </div>
                  </div>
               </div>
            )}

            {/* Users Tab */}
            {activeTab === 'users' && (
               <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                  <h2 className="text-xl font-black uppercase tracking-tight flex items-center mb-6">
                     <Users className="h-6 w-6 mr-2 text-blue-600" /> All Registered Users
                  </h2>
                  <div className="bg-white rounded-3xl shadow-sm border overflow-hidden">
                     <div className="divide-y">
                        {allUsers.map((u) => (
                           <div key={u.id} className="p-4 flex justify-between items-center hover:bg-slate-50">
                             <div>
                               <p className="font-bold text-slate-900">{u.full_name || u.phone_number}</p>
                               <p className="text-xs text-slate-500">Joined: {new Date(u.created_at).toLocaleDateString()}</p>
                             </div>
                             <span className={`px-3 py-1 text-xs font-bold rounded-full uppercase ${u.role === 'worker' ? 'bg-orange-100 text-orange-700' : 'bg-blue-100 text-blue-700'}`}>
                                {u.role}
                             </span>
                           </div>
                        ))}
                     </div>
                  </div>
               </div>
            )}

            {/* Finance / Jobs Tab */}
            {activeTab === 'finance' && (
               <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                  <h2 className="text-xl font-black uppercase tracking-tight flex items-center mb-6">
                     <DollarSign className="h-6 w-6 mr-2 text-indigo-600" /> Jobs & Escrow Management
                  </h2>
                  <div className="bg-white rounded-3xl shadow-sm border overflow-hidden divide-y">
                     {allJobs.map((job) => (
                        <div key={job.id} className="p-4 flex justify-between items-center hover:bg-slate-50">
                          <div className="max-w-md">
                            <p className="font-bold text-slate-900">{job.description}</p>
                            <p className="text-xs text-slate-500">
                               Customer: {job.customer?.full_name || 'N/A'} • Worker: {job.worker?.full_name || 'N/A'} • 
                               Price: N{job.price}
                            </p>
                            <p className="text-xs font-bold mt-1 text-blue-600">Status: {job.status.toUpperCase()}</p>
                          </div>
                          
                          <div className="text-right flex flex-col items-end gap-2">
                             <span className={`px-2 py-1 text-[10px] font-bold rounded uppercase ${job.payment_status === 'escrowed' ? 'bg-yellow-100 text-yellow-700' : 'bg-emerald-100 text-emerald-700'}`}>
                               Payment: {job.payment_status}
                             </span>
                             {job.status === 'completed' && job.payment_status === 'escrowed' && (
                                <Button size="sm" onClick={() => handleReleasePayment(job.id)} className="bg-emerald-600 h-7 text-xs">
                                   Release Pay
                                </Button>
                             )}
                          </div>
                        </div>
                     ))}
                  </div>
               </div>
            )}
            
            {/* Stats Tab */}
            {activeTab === 'stats' && (
               <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                   <h2 className="text-xl font-black uppercase tracking-tight flex items-center mb-6">
                     <AlertCircle className="h-6 w-6 mr-2 text-indigo-600" /> Platform Overview
                  </h2>
                  <p className="text-slate-500">Welcome to the Workars Admin Dashboard. Use the sidebar to navigate the system modules.</p>
               </div>
            )}

          </>
        )}
      </main>
    </div>
  );
}
