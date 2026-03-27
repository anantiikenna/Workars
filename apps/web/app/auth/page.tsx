"use client";

import React, { useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { ShieldCheck, User, Hammer, Mail, Phone, Lock, ChevronLeft } from "lucide-react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { useAuthStore } from "@/store/authStore";

export default function AuthPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const initialRole = searchParams.get("role") === "worker" ? "worker" : "customer";
  
  const [role, setRole] = useState<'customer' | 'worker'>(initialRole as 'customer' | 'worker');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form states
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const { data, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
            role: role
          }
        }
      });

      if (authError) throw authError;

      if (data.user) {
        // Create profile
        const { error: profileError } = await supabase
          .from('profiles')
          .insert({
            id: data.user.id,
            full_name: fullName,
            role: role
          });
        
        if (profileError) throw profileError;

        // If worker, create artisan entry
        if (role === 'worker') {
            await supabase.from('artisans').insert({
                id: data.user.id,
                phone_number: phone
            });
        }

        router.push(role === 'worker' ? '/worker/dashboard' : '/marketplace');
      }
    } catch (err: any) {
      setError(err.message || "An error occurred during authentication");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4">
      <Link href="/" className="mb-8 flex items-center text-blue-600 hover:text-blue-700 font-medium">
        <ChevronLeft className="h-4 w-4 mr-1" /> Back to Home
      </Link>
      
      <Card className="w-full max-w-md border-none shadow-2xl">
        <CardHeader className="text-center space-y-2">
          <Link href="/" className="mx-auto block w-fit">
            <span className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              Workars
            </span>
          </Link>
          <CardTitle className="text-2xl pt-4">Welcome Back</CardTitle>
          <CardDescription>
            Join Nigeria's fastest growing artisan marketplace
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          <div className="flex p-1 bg-slate-100 rounded-xl mb-8">
            <button 
              onClick={() => setRole('customer')}
              className={`flex-1 flex items-center justify-center py-2.5 rounded-lg text-sm font-semibold transition-all ${role === 'customer' ? "bg-white shadow-sm text-blue-600" : "text-slate-500"}`}
            >
              <User className="h-4 w-4 mr-2" /> Customer
            </button>
            <button 
              onClick={() => setRole('worker')}
              className={`flex-1 flex items-center justify-center py-2.5 rounded-lg text-sm font-semibold transition-all ${role === 'worker' ? "bg-white shadow-sm text-blue-600" : "text-slate-500"}`}
            >
              <Hammer className="h-4 w-4 mr-2" /> Artisan
            </button>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-100 text-red-600 text-sm rounded-lg">
              {error}
            </div>
          )}

          <form onSubmit={handleAuth} className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">Full Name</label>
              <Input 
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="John Doe" 
                required 
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                <Input 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="john@example.com" 
                  className="pl-10" 
                  required 
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">Phone Number</label>
              <div className="relative">
                <Phone className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                <Input 
                  type="tel" 
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="080 1234 5678" 
                  className="pl-10" 
                  required 
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                <Input 
                  type="password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••" 
                  className="pl-10" 
                  required 
                />
              </div>
            </div>
            <Button className="w-full h-12 text-lg font-bold shadow-lg" size="lg" disabled={isLoading}>
              {isLoading ? "Verifying..." : role === 'worker' ? "Apply as Artisan" : "Create My Account"}
            </Button>
          </form>
        </CardContent>
        
        <CardFooter className="flex flex-col space-y-4 text-center">
          <div className="flex items-center justify-center w-full">
            <div className="h-px bg-slate-200 flex-1" />
            <span className="px-4 text-xs text-slate-400 font-bold uppercase tracking-widest">Safe & Secure</span>
            <div className="h-px bg-slate-200 flex-1" />
          </div>
          <div className="flex items-center justify-center text-xs text-slate-500 font-medium">
             <ShieldCheck className="h-3.5 w-3.5 mr-1 text-blue-500" />
             Verified by Workars Compliance Team
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
