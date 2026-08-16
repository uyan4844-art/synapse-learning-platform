-- ==============================================================================
-- SYNAPSE DATABASE SCHEMA & RLS SECURITY POLICIES
-- ==============================================================================

-- 1. Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ------------------------------------------------------------------------------
-- 2. PROFILES TABLE (Linked with auth.users)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  username TEXT UNIQUE,
  display_name TEXT,
  avatar_url TEXT,
  country TEXT DEFAULT 'Turkey (Türkiye)',
  grade TEXT DEFAULT '10. Sınıf (Lise)',
  interface_language TEXT DEFAULT 'tr',
  content_language TEXT DEFAULT 'en',
  theme TEXT DEFAULT 'dark',
  learning_track TEXT DEFAULT 'academic',
  sub_goals JSONB DEFAULT '["yks_tyt", "school_math"]'::jsonb,
  daily_target TEXT DEFAULT 'regular',
  elo_rating INTEGER DEFAULT 1200,
  streak_count INTEGER DEFAULT 1,
  total_questions_solved INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS for profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public profiles are viewable by everyone." 
  ON public.profiles FOR SELECT USING (true);

CREATE POLICY "Users can insert their own profile." 
  ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update their own profile." 
  ON public.profiles FOR UPDATE USING (auth.uid() = id);

-- ------------------------------------------------------------------------------
-- 3. QUIZZES & QUESTIONS TABLES
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.quizzes (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  title TEXT NOT NULL,
  source_type TEXT DEFAULT 'youtube',
  source_url TEXT,
  content_language TEXT DEFAULT 'tr',
  difficulty TEXT DEFAULT 'Orta',
  grade_level TEXT,
  question_count INTEGER DEFAULT 5,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.quizzes ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Quizzes are viewable by creator or public" ON public.quizzes FOR SELECT USING (true);
CREATE POLICY "Users can create quizzes" ON public.quizzes FOR INSERT WITH CHECK (auth.uid() = user_id OR user_id IS NULL);

CREATE TABLE IF NOT EXISTS public.questions (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  quiz_id UUID REFERENCES public.quizzes(id) ON DELETE CASCADE,
  question_text TEXT NOT NULL,
  options JSONB NOT NULL, -- Array of { id: 'A', text: '...', isCorrect: true/false }
  correct_option_id TEXT NOT NULL,
  hint TEXT,
  explanation TEXT,
  topic TEXT,
  difficulty TEXT,
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.questions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Questions are viewable by everyone" ON public.questions FOR SELECT USING (true);
CREATE POLICY "Authorized users can insert questions" ON public.questions FOR INSERT WITH CHECK (true);

-- ------------------------------------------------------------------------------
-- 4. USER PROGRESS & MASTERY RADAR
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.user_progress (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  subject TEXT NOT NULL,
  topic TEXT NOT NULL,
  mastery_percentage NUMERIC(5, 2) DEFAULT 0.00,
  correct_count INTEGER DEFAULT 0,
  total_attempted INTEGER DEFAULT 0,
  last_practiced_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.user_progress ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own progress" ON public.user_progress FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert/update own progress" ON public.user_progress FOR ALL USING (auth.uid() = user_id);

-- ------------------------------------------------------------------------------
-- 5. MATCHES (REAL-TIME DUELS & BATTLES)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.matches (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  room_code TEXT UNIQUE NOT NULL,
  host_user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  guest_user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  quiz_id UUID REFERENCES public.quizzes(id) ON DELETE SET NULL,
  status TEXT DEFAULT 'waiting', -- waiting, active, finished
  host_score INTEGER DEFAULT 0,
  guest_score INTEGER DEFAULT 0,
  winner_user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  finished_at TIMESTAMP WITH TIME ZONE
);

ALTER TABLE public.matches ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Matches viewable by participants" ON public.matches FOR SELECT USING (true);
CREATE POLICY "Users can create and join matches" ON public.matches FOR ALL USING (true);

-- ------------------------------------------------------------------------------
-- 6. AUTOMATIC PROFILE CREATION TRIGGER ON SIGNUP
-- ------------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, display_name, avatar_url, username)
  VALUES (
    new.id,
    COALESCE(new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'name', 'Öğrenci'),
    new.raw_user_meta_data->>'avatar_url',
    LOWER(SPLIT_PART(new.email, '@', 1)) || '_' || SUBSTRING(new.id::text, 1, 4)
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
