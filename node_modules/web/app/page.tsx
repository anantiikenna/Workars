import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Search, ShieldCheck, MapPin, Zap, ChevronRight, Star } from "lucide-react";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Navbar */}
      <header className="px-4 lg:px-6 h-16 flex items-center border-b bg-white/80 backdrop-blur-md sticky top-0 z-50">
        <Link href="/" className="flex items-center justify-center">
          <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
            Workars
          </span>
        </Link>
        <nav className="ml-auto flex gap-4 sm:gap-6">
          <Link href="/marketplace" className="text-sm font-medium hover:text-blue-600 transition-colors">
            Find Artisans
          </Link>
          <Link href="/auth?role=worker" className="text-sm font-medium hover:text-blue-600 transition-colors">
            Become a Workar
          </Link>
          <Link href="/auth?role=customer" className="text-sm font-medium hover:text-blue-600 transition-colors">
            Login
          </Link>
        </nav>
      </header>

      <main className="flex-1">
        {/* Hero Section */}
        <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48 bg-white overflow-hidden relative">
          <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 w-[600px] h-[600px] bg-blue-50 rounded-full blur-3xl opacity-50" />
          <div className="container px-4 md:px-6 relative">
            <div className="flex flex-col items-center space-y-4 text-center">
              <div className="inline-flex items-center rounded-full border border-blue-100 bg-blue-50 px-3 py-1 text-sm font-medium text-blue-600 shadow-sm transition-colors hover:bg-blue-100">
                <ShieldCheck className="mr-1 h-3.5 w-3.5" />
                Trusted by 5,000+ Nigerian Households
              </div>
              <h1 className="text-4xl font-extrabold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl">
                Find the Best <br/>
                <span className="text-blue-600">Verified Artisans</span> Near You
              </h1>
              <p className="mx-auto max-w-[700px] text-slate-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                Connect with professional electricians, plumbers, and carpenters in your region. 
                Fast, verified, and ready to work.
              </p>
              <div className="space-x-4 pt-4">
                <Button size="lg" className="rounded-full shadow-lg h-14 px-8 text-lg" asChild>
                  <Link href="/marketplace">Find an Artisan Now</Link>
                </Button>
                <Button variant="outline" size="lg" className="rounded-full h-14 px-8 text-lg" asChild>
                  <Link href="/auth?role=worker">Join as a Professional</Link>
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Categories Section */}
        <section className="w-full py-12 md:py-24 bg-slate-50">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">Popular Categories</h2>
              <p className="max-w-[600px] text-slate-500 md:text-xl">
                The most requested professionals in your area.
              </p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-12">
              {['Electricians', 'Plumbers', 'Carpenters', 'Painters', 'Masons', 'Welders', 'AC Techs', 'Handymen'].map((cat) => (
                <Link key={cat} href={`/marketplace?category=${cat}`}>
                  <div className="group relative overflow-hidden rounded-2xl bg-white p-6 shadow-sm transition-all hover:shadow-md hover:-translate-y-1">
                    <div className="flex flex-col items-center space-y-2">
                      <div className="h-12 w-12 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                        <Zap className="h-6 w-6" />
                      </div>
                      <span className="font-semibold text-slate-900">{cat}</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* Feature Section */}
        <section className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <div className="grid gap-10 lg:grid-cols-2 items-center">
              <div className="space-y-4">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">Why Choose Workars?</h2>
                <div className="space-y-6 pt-6">
                  <div className="flex gap-4">
                    <div className="mt-1 h-10 w-10 shrink-0 rounded-lg bg-blue-100 flex items-center justify-center text-blue-600">
                      <ShieldCheck className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold">Verified Pros</h3>
                      <p className="text-slate-500">Every artisan undergoes a strict ID verification process before joining.</p>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <div className="mt-1 h-10 w-10 shrink-0 rounded-lg bg-indigo-100 flex items-center justify-center text-indigo-600">
                      <MapPin className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold">Local Support</h3>
                      <p className="text-slate-500">Connect with people who know your neighborhood and arrive fast.</p>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <div className="mt-1 h-10 w-10 shrink-0 rounded-lg bg-emerald-100 flex items-center justify-center text-emerald-600">
                      <Zap className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold">Instant Contact</h3>
                      <p className="text-slate-500">Pay a small fee to unlock contact details and talk directly to your artisan.</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="relative aspect-video rounded-3xl bg-slate-100 overflow-hidden shadow-2xl">
                 {/* Placeholder for a nice lifestyle image */}
                 <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 to-indigo-600/20" />
                 <div className="flex items-center justify-center h-full">
                    <p className="text-slate-400 font-medium italic">Premium Interaction Design</p>
                 </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="w-full py-6 border-t bg-white">
        <div className="container px-4 md:px-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-slate-500">© 2024 Workars. All rights reserved.</p>
          <div className="flex gap-4">
            <Link href="#" className="text-sm text-slate-500 hover:text-blue-600 underline-offset-4 hover:underline">Terms</Link>
            <Link href="#" className="text-sm text-slate-500 hover:text-blue-600 underline-offset-4 hover:underline">Privacy</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
