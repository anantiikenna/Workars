-- Supabase Schema for WorkConnect MVP Phase 1

-- 1. Profiles (Extends Auth)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT,
  phone_number TEXT UNIQUE,
  avatar_url TEXT,
  role TEXT CHECK (role IN ('customer', 'worker', 'admin')) DEFAULT 'customer',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Categories (For browsing workers)
CREATE TABLE IF NOT EXISTS public.categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT UNIQUE NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  icon TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Workers (Worker specific info)
CREATE TABLE IF NOT EXISTS public.workers (
  id UUID PRIMARY KEY REFERENCES public.profiles(id) ON DELETE CASCADE,
  category_id UUID REFERENCES public.categories(id),
  skills TEXT[],
  bio TEXT,
  location_lat DOUBLE PRECISION,
  location_lng DOUBLE PRECISION,
  location_name TEXT,
  is_online BOOLEAN DEFAULT false,
  is_verified BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Jobs (Core MVP Feature)
CREATE TABLE IF NOT EXISTS public.jobs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  worker_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  description TEXT NOT NULL,
  location_name TEXT,
  location_lat DOUBLE PRECISION,
  location_lng DOUBLE PRECISION,
  status TEXT CHECK (status IN ('pending', 'accepted', 'in_progress', 'completed', 'declined', 'canceled')) DEFAULT 'pending',
  payment_status TEXT CHECK (payment_status IN ('pending', 'escrowed', 'released', 'refunded')) DEFAULT 'pending',
  price DECIMAL(10, 2),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Reviews
CREATE TABLE IF NOT EXISTS public.reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  job_id UUID REFERENCES public.jobs(id) ON DELETE CASCADE,
  worker_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  customer_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  comment TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.workers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;

-- Basic Policies
CREATE POLICY "Public categories are viewable by everyone." ON public.categories FOR SELECT USING (true);

CREATE POLICY "Profiles are viewable by everyone." ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Users can update own profile." ON public.profiles FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Workers are viewable by everyone." ON public.workers FOR SELECT USING (true);
CREATE POLICY "Workers can update own info." ON public.workers FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can view related jobs." ON public.jobs FOR SELECT USING (auth.uid() = customer_id OR auth.uid() = worker_id);
CREATE POLICY "Customers can create jobs." ON public.jobs FOR INSERT WITH CHECK (auth.uid() = customer_id);
CREATE POLICY "Users can update related jobs." ON public.jobs FOR UPDATE USING (auth.uid() = customer_id OR auth.uid() = worker_id);

CREATE POLICY "Reviews are viewable by everyone." ON public.reviews FOR SELECT USING (true);
CREATE POLICY "Customers can create reviews." ON public.reviews FOR INSERT WITH CHECK (auth.uid() = customer_id);
