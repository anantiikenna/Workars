"use client";

import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { ShieldCheck, User, Hammer, CheckCircle, XCircle, BarChart3, Users, DollarSign, Clock, Search, Filter, ArrowUpRight, TrendingUp } from "lucide-react";
import Link from "next/link";

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('approvals');

  // Mock data for artisans needing approval
  const [pendingArtisans, setPendingArtisans] = useState([
    { id: "1", name: "David Mark", skill: "Electrician", region: "Lekki", appliedAt: "2 hours ago" },
    { id: "2", name: "Sarah John", skill: "Plumber", region: "Festac", appliedAt: "5 hours ago" },
    { id: "3", name: "Olu Jacobs", skill: "Carpenter", region: "Ikeja", appliedAt: "1 day ago" },
  ]);

  const handleApprove = (id: string) => {
    setPendingArtisans(pendingArtisans.filter(a => a.id !== id));
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
              {pendingArtisans.length > 0 && (
                <span className="ml-auto bg-red-500 text-white text-[10px] px-1.5 py-0.5 rounded-full font-bold animate-pulse">
                   {pendingArtisans.length}
                </span>
              )}
           </button>
           <button onClick={() => setActiveTab('users')} className={`w-full flex items-center p-3 rounded-xl transition-colors ${activeTab === 'users' ? 'bg-blue-600 font-bold' : 'hover:bg-slate-800 text-slate-400'}`}>
              <Users className="h-5 w-5 mr-3" /> All Users
           </button>
           <button onClick={() => setActiveTab('finance')} className={`w-full flex items-center p-3 rounded-xl transition-colors ${activeTab === 'finance' ? 'bg-blue-600 font-bold' : 'hover:bg-slate-800 text-slate-400'}`}>
              <DollarSign className="h-5 w-5 mr-3" /> Payments
           </button>
        </nav>
        <div className="p-4 bg-slate-800 rounded-2xl">
           <p className="text-xs text-slate-500 font-bold uppercase tracking-widest mb-1">System Status</p>
           <p className="text-emerald-400 flex items-center text-sm">
              <span className="h-2 w-2 bg-emerald-400 rounded-full mr-2 animate-ping" /> All Systems Nominal
           </p>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto p-4 md:p-10 space-y-10">
        <header className="flex items-center justify-between">
           <div>
              <h1 className="text-3xl font-black text-slate-900 uppercase tracking-tight">System Oversight</h1>
              <p className="text-slate-500 font-medium">Monitoring Workars Platform Health & Growth</p>
           </div>
           <div className="flex gap-4">
              <div className="h-12 w-12 rounded-full bg-white shadow-sm flex items-center justify-center text-slate-400">
                 <Search className="h-5 w-5" />
              </div>
              <div className="h-12 w-12 rounded-full bg-blue-600 shadow-lg text-white font-black flex items-center justify-center">
                 A
              </div>
           </div>
        </header>

        {/* Top Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
           <Card className="border-none shadow-sm bg-indigo-600 text-white overflow-hidden p-6 relative">
              <div className="relative z-10">
                 <p className="text-indigo-100 font-bold text-xs uppercase tracking-widest mb-2">Total Platform Revenue</p>
                 <h2 className="text-4xl font-black">N342,500</h2>
                 <p className="text-emerald-300 text-sm font-bold flex items-center mt-4">
                    <TrendingUp className="h-4 w-4 mr-1" /> +12.5% this week
                 </p>
              </div>
              <DollarSign className="absolute -right-4 -bottom-4 h-32 w-32 text-white opacity-10" />
           </Card>
           <Card className="border-none shadow-sm p-6 relative bg-white">
              <p className="text-slate-400 font-bold text-xs uppercase tracking-widest mb-2">Active Artisans</p>
              <h2 className="text-4xl font-black text-slate-900">1,248</h2>
              <p className="text-slate-400 text-sm font-bold flex items-center mt-4">
                 Verified Professionals in Lagos
              </p>
              <Hammer className="absolute -right-4 -bottom-4 h-32 w-32 text-blue-600 opacity-5" />
           </Card>
           <Card className="border-none shadow-sm p-6 relative bg-white">
              <p className="text-slate-400 font-bold text-xs uppercase tracking-widest mb-2">Total Customers</p>
              <h2 className="text-4xl font-black text-slate-900">4,892</h2>
              <p className="text-slate-400 text-sm font-bold flex items-center mt-4">
                 Growth rate: 22 / day
              </p>
              <Users className="absolute -right-4 -bottom-4 h-32 w-32 text-indigo-600 opacity-5" />
           </Card>
        </div>

        {/* Content Tabs */}
        {(activeTab === 'approvals' || activeTab === 'stats') && (
           <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="flex items-center justify-between mb-6">
                 <h2 className="text-xl font-black uppercase tracking-tight flex items-center focus-within:">
                    <ShieldCheck className="h-6 w-6 mr-2 text-blue-600" /> Artisan Approval Queue
                 </h2>
                 <Button variant="outline" size="sm">View History</Button>
              </div>
              
              <div className="bg-white rounded-3xl shadow-sm border overflow-hidden">
                 <div className="grid grid-cols-5 bg-slate-50 p-4 font-bold text-xs text-slate-400 uppercase tracking-widest border-b">
                    <div className="col-span-2">Professional</div>
                    <div>Category/Skill</div>
                    <div>Region</div>
                    <div className="text-right">Action</div>
                 </div>
                 <div className="divide-y">
                    {pendingArtisans.length > 0 ? pendingArtisans.map((artisan) => (
                       <div key={artisan.id} className="grid grid-cols-5 p-4 items-center gap-4 hover:bg-slate-50 transition-colors">
                          <div className="col-span-2 flex items-center space-x-3">
                             <div className="h-10 w-10 rounded-xl bg-blue-100 flex items-center justify-center text-blue-600 font-bold">
                                {artisan.name.split(' ').map(n => n[0]).join('')}
                             </div>
                             <div>
                                <p className="font-bold text-slate-900">{artisan.name}</p>
                                <p className="text-xs text-slate-400 font-bold">Applied {artisan.appliedAt}</p>
                             </div>
                          </div>
                          <div className="text-sm font-bold text-slate-600">{artisan.skill}</div>
                          <div className="text-sm font-bold text-slate-600">{artisan.region}</div>
                          <div className="flex items-center justify-end space-x-2">
                             <Button onClick={() => handleApprove(artisan.id)} className="bg-emerald-600 hover:bg-emerald-700 h-9 px-3">
                                <CheckCircle className="h-4 w-4 mr-2" /> Approve
                             </Button>
                             <Button variant="ghost" className="text-red-500 hover:text-red-700 hover:bg-red-50 h-9 w-9 p-0">
                                <XCircle className="h-5 w-5" />
                             </Button>
                          </div>
                       </div>
                    )) : (
                       <div className="py-20 text-center space-y-4">
                          <div className="mx-auto h-16 w-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center">
                             <CheckCircle className="h-10 w-10" />
                          </div>
                          <p className="text-slate-400 font-bold">Queue Clear! All artisans have been processed.</p>
                       </div>
                    )}
                 </div>
              </div>
           </div>
        )}

        {/* Platform Logs / Recent Activity */}
        <div className="animate-in fade-in slide-in-from-bottom-6 duration-700">
           <h2 className="text-xl font-black uppercase tracking-tight flex items-center mb-6">
              <Clock className="h-6 w-6 mr-2 text-indigo-600" /> Recent Platform Activity
           </h2>
           <div className="grid gap-4">
              {[
                { type: 'payment', title: 'New Contact Unlock', user: 'Mike Peters', amount: 'N1,000', time: '14 mins ago' },
                { type: 'payment', title: 'Monthly Subscription', user: 'Dante Ali', amount: 'N5,000', time: '42 mins ago' },
                { type: 'auth', title: 'New User Registered', user: 'Linda Okafor', amount: 'Customer', time: '1 hour ago' },
              ].map((log, i) => (
                <div key={i} className="bg-white p-4 rounded-2xl flex items-center border border-slate-100 hover:border-slate-200 transition-colors shadow-sm">
                   <div className={`h-10 w-10 rounded-full flex items-center justify-center mr-4 ${log.type === 'payment' ? 'bg-emerald-100 text-emerald-600' : 'bg-blue-100 text-blue-600'}`}>
                      {log.type === 'payment' ? <DollarSign className="h-5 w-5" /> : <User className="h-5 w-5" />}
                   </div>
                   <div className="flex-1">
                      <p className="text-sm font-black text-slate-900 leading-none mb-1">{log.title}</p>
                      <p className="text-xs text-slate-500 font-bold">{log.user}</p>
                   </div>
                   <div className="text-right">
                      <p className="text-sm font-black text-slate-900 leading-none mb-1">{log.amount}</p>
                      <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">{log.time}</p>
                   </div>
                </div>
              ))}
           </div>
        </div>
      </main>
    </div>
  );
}
