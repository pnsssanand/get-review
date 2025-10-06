-- Migration: Add businesses, social clicks tracking, and account types
-- Author: Mr. Anand Pinisetty - Dream Team
-- Date: 2025-10-06

-- ============================================================================
-- 1. UPDATE PROFILES TABLE - Add account_type field
-- ============================================================================

-- Add account_type column to profiles (default: personal)
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS account_type TEXT DEFAULT 'personal' 
CHECK (account_type IN ('personal', 'business'));

-- Add business_id reference (for when personal account links to business)
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS business_id UUID REFERENCES public.businesses(id) ON DELETE SET NULL;

-- Add index for performance
CREATE INDEX IF NOT EXISTS idx_profiles_account_type ON public.profiles(account_type);
CREATE INDEX IF NOT EXISTS idx_profiles_business_id ON public.profiles(business_id);

-- ============================================================================
-- 2. CREATE BUSINESSES TABLE
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.businesses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  
  -- Basic Info
  name TEXT NOT NULL,
  category TEXT,
  description TEXT,
  
  -- Contact & Location
  website TEXT,
  email TEXT,
  phone TEXT,
  address TEXT,
  city TEXT,
  state TEXT,
  country TEXT,
  postal_code TEXT,
  
  -- Media
  logo_url TEXT,
  cover_image_url TEXT,
  images TEXT[], -- Array of image URLs
  
  -- Social Media Links (stored as JSONB for flexibility)
  social_links JSONB DEFAULT '{}'::jsonb,
  
  -- Business Hours (optional)
  business_hours JSONB DEFAULT '{}'::jsonb,
  
  -- Status
  is_verified BOOLEAN DEFAULT false,
  is_active BOOLEAN DEFAULT true,
  
  -- Full-text search vector
  search_vector tsvector GENERATED ALWAYS AS (
    to_tsvector('english', name || ' ' || COALESCE(description, '') || ' ' || COALESCE(category, ''))
  ) STORED,
  
  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_businesses_owner ON public.businesses(owner_id);
CREATE INDEX IF NOT EXISTS idx_businesses_category ON public.businesses(category);
CREATE INDEX IF NOT EXISTS idx_businesses_search ON public.businesses USING GIN(search_vector);
CREATE INDEX IF NOT EXISTS idx_businesses_active ON public.businesses(is_active) WHERE is_active = true;

-- Enable RLS
ALTER TABLE public.businesses ENABLE ROW LEVEL SECURITY;

-- RLS Policies for businesses
CREATE POLICY "Anyone can view active businesses"
  ON public.businesses FOR SELECT
  USING (is_active = true);

CREATE POLICY "Business owners can update their business"
  ON public.businesses FOR UPDATE
  USING (auth.uid() = owner_id);

CREATE POLICY "Business owners can delete their business"
  ON public.businesses FOR DELETE
  USING (auth.uid() = owner_id);

CREATE POLICY "Authenticated users can create businesses"
  ON public.businesses FOR INSERT
  WITH CHECK (auth.uid() = owner_id);

-- ============================================================================
-- 3. CREATE SOCIAL CLICKS TRACKING TABLE
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.social_clicks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  business_id UUID REFERENCES public.businesses(id) ON DELETE CASCADE NOT NULL,
  platform TEXT NOT NULL, -- e.g., 'instagram', 'facebook', 'website'
  clicked_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  
  -- Ensure one click record per user per business per platform
  UNIQUE(user_id, business_id, platform)
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_social_clicks_user ON public.social_clicks(user_id);
CREATE INDEX IF NOT EXISTS idx_social_clicks_business ON public.social_clicks(business_id);
CREATE INDEX IF NOT EXISTS idx_social_clicks_combo ON public.social_clicks(user_id, business_id);

-- Enable RLS
ALTER TABLE public.social_clicks ENABLE ROW LEVEL SECURITY;

-- RLS Policies for social clicks
CREATE POLICY "Users can view their own clicks"
  ON public.social_clicks FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own clicks"
  ON public.social_clicks FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Business owners can view all clicks on their business"
  ON public.social_clicks FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.businesses 
      WHERE businesses.id = social_clicks.business_id 
      AND businesses.owner_id = auth.uid()
    )
  );

-- ============================================================================
-- 4. CREATE REVIEWS TABLE (if not exists) and UPDATE for verified reviews
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  business_id UUID REFERENCES public.businesses(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  
  -- Review content
  rating INTEGER CHECK (rating >= 1 AND rating <= 5) NOT NULL,
  title TEXT,
  comment TEXT,
  
  -- Verification
  verified BOOLEAN DEFAULT false, -- true if user clicked social link before reviewing
  
  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  
  -- One review per user per business
  UNIQUE(user_id, business_id)
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_reviews_business ON public.reviews(business_id);
CREATE INDEX IF NOT EXISTS idx_reviews_user ON public.reviews(user_id);
CREATE INDEX IF NOT EXISTS idx_reviews_verified ON public.reviews(verified);

-- Enable RLS
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;

-- RLS Policies for reviews
CREATE POLICY "Anyone can view reviews"
  ON public.reviews FOR SELECT
  USING (true);

CREATE POLICY "Users can insert their own reviews"
  ON public.reviews FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own reviews"
  ON public.reviews FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own reviews"
  ON public.reviews FOR DELETE
  USING (auth.uid() = user_id);

-- ============================================================================
-- 5. HELPER FUNCTIONS
-- ============================================================================

-- Function to check if user has clicked any social link for a business
CREATE OR REPLACE FUNCTION public.has_social_click(user_uuid UUID, business_uuid UUID)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.social_clicks
    WHERE user_id = user_uuid 
    AND business_id = business_uuid
  );
END;
$$ LANGUAGE plpgsql STABLE SECURITY DEFINER;

-- Function to search businesses (for autocomplete)
CREATE OR REPLACE FUNCTION public.search_businesses(search_query TEXT, result_limit INTEGER DEFAULT 6)
RETURNS TABLE (
  id UUID,
  name TEXT,
  category TEXT,
  logo_url TEXT,
  rating NUMERIC,
  review_count BIGINT
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    b.id,
    b.name,
    b.category,
    b.logo_url,
    COALESCE(AVG(r.rating), 0)::NUMERIC(3,2) AS rating,
    COUNT(r.id) AS review_count
  FROM public.businesses b
  LEFT JOIN public.reviews r ON r.business_id = b.id
  WHERE 
    b.is_active = true
    AND (
      b.search_vector @@ plainto_tsquery('english', search_query)
      OR b.name ILIKE '%' || search_query || '%'
    )
  GROUP BY b.id, b.name, b.category, b.logo_url
  ORDER BY 
    ts_rank(b.search_vector, plainto_tsquery('english', search_query)) DESC,
    review_count DESC
  LIMIT result_limit;
END;
$$ LANGUAGE plpgsql STABLE;

-- Function to record social click and open link
CREATE OR REPLACE FUNCTION public.record_social_click(
  p_business_id UUID,
  p_platform TEXT
)
RETURNS JSONB AS $$
DECLARE
  v_user_id UUID;
  v_result JSONB;
BEGIN
  -- Get current user
  v_user_id := auth.uid();
  
  IF v_user_id IS NULL THEN
    RETURN jsonb_build_object(
      'ok', false,
      'error', 'User not authenticated'
    );
  END IF;
  
  -- Insert or update click record
  INSERT INTO public.social_clicks (user_id, business_id, platform)
  VALUES (v_user_id, p_business_id, p_platform)
  ON CONFLICT (user_id, business_id, platform) 
  DO UPDATE SET clicked_at = NOW();
  
  RETURN jsonb_build_object(
    'ok', true,
    'clicked', true,
    'platform', p_platform
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to set verified flag on reviews
CREATE OR REPLACE FUNCTION public.set_review_verified()
RETURNS TRIGGER AS $$
BEGIN
  -- Check if user has clicked any social link for this business
  NEW.verified := public.has_social_click(NEW.user_id, NEW.business_id);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_set_review_verified ON public.reviews;
CREATE TRIGGER trigger_set_review_verified
  BEFORE INSERT ON public.reviews
  FOR EACH ROW
  EXECUTE FUNCTION public.set_review_verified();

-- ============================================================================
-- 6. UPDATE EXISTING DATA
-- ============================================================================

-- Set all existing profiles to 'personal' if not already set
UPDATE public.profiles 
SET account_type = 'personal' 
WHERE account_type IS NULL;

-- ============================================================================
-- 7. GRANTS AND PERMISSIONS
-- ============================================================================

-- Grant execute permissions on functions
GRANT EXECUTE ON FUNCTION public.has_social_click TO authenticated;
GRANT EXECUTE ON FUNCTION public.search_businesses TO authenticated, anon;
GRANT EXECUTE ON FUNCTION public.record_social_click TO authenticated;

-- ============================================================================
-- END OF MIGRATION
-- ============================================================================

-- Add comments for documentation
COMMENT ON TABLE public.businesses IS 'Stores business profiles and listings';
COMMENT ON TABLE public.social_clicks IS 'Tracks when users click on business social media links';
COMMENT ON COLUMN public.reviews.verified IS 'True if user clicked a social link before reviewing';
COMMENT ON FUNCTION public.has_social_click IS 'Check if user has clicked any social link for a business';
COMMENT ON FUNCTION public.record_social_click IS 'Record when a user clicks a business social link';
COMMENT ON FUNCTION public.search_businesses IS 'Full-text search for businesses with autocomplete';
