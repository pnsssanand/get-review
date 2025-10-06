import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import { SocialIcon } from "@/components/SocialIcons";
import ShareProfile from "@/components/ShareProfile";
import { 
  Star, 
  MapPin, 
  Globe, 
  Phone, 
  Mail, 
  Check, 
  ExternalLink,
  ArrowLeft,
  Building2,
  Verified
} from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "sonner";

interface Business {
  id: string;
  name: string;
  category: string | null;
  description: string | null;
  website: string | null;
  email: string | null;
  phone: string | null;
  address: string | null;
  city: string | null;
  state: string | null;
  country: string | null;
  logo_url: string | null;
  cover_image_url: string | null;
  images: string[] | null;
  social_links: any; // JSONB field - can be object or array
  is_verified: boolean;
  is_active: boolean;
}

interface Review {
  id: string;
  user_id: string;
  rating: number;
  title: string | null;
  comment: string | null;
  verified: boolean;
  created_at: string;
  profiles?: {
    full_name: string;
    profile_image_url: string | null;
  };
}

export default function BusinessDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [business, setBusiness] = useState<Business | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [clickedPlatforms, setClickedPlatforms] = useState<Set<string>>(new Set());
  const [isLoading, setIsLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState<any>(null);

  useEffect(() => {
    fetchBusinessData();
    checkAuthUser();
  }, [id]);

  const checkAuthUser = async () => {
    const { data } = await supabase.auth.getUser();
    setCurrentUser(data.user);
  };

  const fetchBusinessData = async () => {
    if (!id) return;

    try {
      // Fetch business details
      const { data: businessData, error: businessError } = await supabase
        .from("businesses")
        .select("*")
        .eq("id", id)
        .eq("is_active", true)
        .single();

      if (businessError) throw businessError;
      setBusiness(businessData);

      // Fetch reviews with user profiles
      const { data: reviewsData, error: reviewsError } = await supabase
        .from("reviews")
        .select("*")
        .eq("business_id", id)
        .order("created_at", { ascending: false });

      if (reviewsError) throw reviewsError;
      
      // Fetch profile data for each review separately
      if (reviewsData) {
        const reviewsWithProfiles = await Promise.all(
          reviewsData.map(async (review) => {
            const { data: profileData } = await supabase
              .from("profiles")
              .select("full_name, profile_image_url")
              .eq("id", review.user_id)
              .single();
            
            return {
              ...review,
              profiles: profileData || { full_name: "Anonymous", profile_image_url: null }
            };
          })
        );
        setReviews(reviewsWithProfiles);
      }

      // Fetch user's clicked platforms
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data: clicksData } = await supabase
          .from("social_clicks")
          .select("platform")
          .eq("business_id", id)
          .eq("user_id", user.id);

        if (clicksData) {
          setClickedPlatforms(new Set(clicksData.map(c => c.platform)));
        }
      }
    } catch (error) {
      console.error("Error fetching business:", error);
      toast.error("Failed to load business details");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSocialClick = async (platform: string, url: string) => {
    if (!currentUser) {
      toast.error("Please sign in to track social clicks");
      return;
    }

    try {
      // Record the click
      const { data, error } = await supabase.rpc("record_social_click", {
        p_business_id: id!,
        p_platform: platform,
      });

      if (error) throw error;

      // Update local state
      setClickedPlatforms(prev => new Set([...prev, platform]));
      
      // Open the link
      window.open(url, "_blank", "noopener,noreferrer");
      
      toast.success(`${platform} link tracked! ✓`, {
        description: "This counts toward verified reviews"
      });
    } catch (error) {
      console.error("Error recording click:", error);
      // Still open the link even if tracking fails
      window.open(url, "_blank", "noopener,noreferrer");
    }
  };

  const calculateAverageRating = () => {
    if (reviews.length === 0) return 0;
    const sum = reviews.reduce((acc, review) => acc + review.rating, 0);
    return (sum / reviews.length).toFixed(1);
  };

  const verifiedReviewsCount = reviews.filter(r => r.verified).length;
  const verifiedPercentage = reviews.length > 0 
    ? Math.round((verifiedReviewsCount / reviews.length) * 100) 
    : 0;

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  if (!business) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4">
        <Building2 className="w-16 h-16 text-gray-300 mb-4" />
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Business Not Found</h2>
        <p className="text-gray-600 mb-6">The business you're looking for doesn't exist or has been removed.</p>
        <Button onClick={() => navigate("/")}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Home
        </Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50 pb-20">
      {/* Cover Image */}
      <div 
        className="h-64 bg-gradient-to-r from-purple-600 to-pink-600 relative"
        style={{
          backgroundImage: business.cover_image_url 
            ? `url(${business.cover_image_url})` 
            : undefined,
          backgroundSize: "cover",
          backgroundPosition: "center"
        }}
      >
        <Button
          variant="secondary"
          size="sm"
          onClick={() => navigate("/")}
          className="absolute top-4 left-4 bg-white/90 hover:bg-white"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>
      </div>

      <div className="max-w-6xl mx-auto px-4 -mt-20">
        <div className="grid md:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="md:col-span-2 space-y-6">
            {/* Business Header Card */}
            <Card className="p-6">
              <div className="flex gap-6">
                {/* Logo */}
                <div className="flex-shrink-0">
                  {business.logo_url ? (
                    <img
                      src={business.logo_url}
                      alt={business.name}
                      className="w-24 h-24 rounded-xl object-cover border-4 border-white shadow-lg"
                    />
                  ) : (
                    <div className="w-24 h-24 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center border-4 border-white shadow-lg">
                      <Building2 className="w-12 h-12 text-white" />
                    </div>
                  )}
                </div>

                {/* Info */}
                <div className="flex-1">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h1 className="text-3xl font-bold text-gray-900">
                          {business.name}
                        </h1>
                        {business.is_verified && (
                          <Badge className="bg-blue-500">
                            <Verified className="w-3 h-3 mr-1" />
                            Verified
                          </Badge>
                        )}
                      </div>
                      <div className="flex items-center gap-2 mt-2">
                        {business.category && (
                          <Badge variant="secondary">
                            {business.category}
                          </Badge>
                        )}
                        <ShareProfile
                          profileId={business.id}
                          profileName={business.name}
                          profileType="business"
                        />
                      </div>
                    </div>

                    {/* Rating */}
                    <div className="text-right">
                      <div className="flex items-center gap-1">
                        <Star className="w-6 h-6 fill-yellow-400 text-yellow-400" />
                        <span className="text-2xl font-bold">
                          {calculateAverageRating()}
                        </span>
                      </div>
                      <p className="text-sm text-gray-500">
                        {reviews.length} review{reviews.length !== 1 ? "s" : ""}
                      </p>
                    </div>
                  </div>

                  {business.description && (
                    <p className="mt-4 text-gray-600 leading-relaxed">
                      {business.description}
                    </p>
                  )}

                  {/* Contact Info */}
                  <div className="mt-4 space-y-2">
                    {business.address && (
                      <div className="flex items-center gap-2 text-gray-600">
                        <MapPin className="w-4 h-4" />
                        <span className="text-sm">
                          {business.address}
                          {business.city && `, ${business.city}`}
                          {business.state && `, ${business.state}`}
                        </span>
                      </div>
                    )}
                    {business.phone && (
                      <div className="flex items-center gap-2 text-gray-600">
                        <Phone className="w-4 h-4" />
                        <a href={`tel:${business.phone}`} className="text-sm hover:text-purple-600">
                          {business.phone}
                        </a>
                      </div>
                    )}
                    {business.email && (
                      <div className="flex items-center gap-2 text-gray-600">
                        <Mail className="w-4 h-4" />
                        <a href={`mailto:${business.email}`} className="text-sm hover:text-purple-600">
                          {business.email}
                        </a>
                      </div>
                    )}
                    {business.website && (
                      <div className="flex items-center gap-2 text-gray-600">
                        <Globe className="w-4 h-4" />
                        <a 
                          href={business.website} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-sm hover:text-purple-600 flex items-center gap-1"
                        >
                          Visit Website
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </Card>

            {/* Social Links Card */}
            {business.social_links && Object.keys(business.social_links).length > 0 && (
              <Card className="p-6">
                <h2 className="text-xl font-bold mb-4">Connect with us</h2>
                <p className="text-sm text-gray-600 mb-4">
                  Click on social media links to unlock verified review status ✓
                </p>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                  {Object.entries(business.social_links).map(([platform, url]) => {
                    const isClicked = clickedPlatforms.has(platform);
                    return (
                      <motion.div key={platform} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                        <Button
                          variant={isClicked ? "default" : "outline"}
                          className={`w-full relative ${
                            isClicked 
                              ? "bg-green-500 hover:bg-green-600 border-green-600" 
                              : "hover:border-purple-500"
                          }`}
                          onClick={() => handleSocialClick(platform, url as string)}
                        >
                          <SocialIcon platform={platform} className="w-5 h-5 mr-2" />
                          <span className="capitalize">{platform}</span>
                          {isClicked && (
                            <Check className="w-4 h-4 ml-auto text-white" />
                          )}
                        </Button>
                      </motion.div>
                    );
                  })}
                </div>
                {clickedPlatforms.size > 0 && (
                  <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                    <p className="text-sm text-green-800 flex items-center gap-2">
                      <Check className="w-4 h-4" />
                      You've clicked {clickedPlatforms.size} link{clickedPlatforms.size !== 1 ? "s" : ""}! 
                      Your reviews will be marked as verified ✓
                    </p>
                  </div>
                )}
              </Card>
            )}

            {/* Reviews Section */}
            <Card className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold">Customer Reviews</h2>
                <Button onClick={() => navigate(`/business/${id}/review`)}>
                  Write a Review
                </Button>
              </div>

              {verifiedReviewsCount > 0 && (
                <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-blue-900">Verified Reviews</span>
                    <span className="text-sm font-bold text-blue-900">{verifiedPercentage}%</span>
                  </div>
                  <Progress value={verifiedPercentage} className="h-2" />
                  <p className="text-xs text-blue-700 mt-2">
                    {verifiedReviewsCount} of {reviews.length} reviews are verified
                  </p>
                </div>
              )}

              <div className="space-y-4">
                {reviews.length > 0 ? (
                  reviews.map((review) => (
                    <motion.div
                      key={review.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="border rounded-lg p-4"
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center gap-3">
                          {review.profiles?.profile_image_url ? (
                            <img
                              src={review.profiles.profile_image_url}
                              alt={review.profiles.full_name}
                              className="w-10 h-10 rounded-full"
                            />
                          ) : (
                            <div className="w-10 h-10 rounded-full bg-purple-200 flex items-center justify-center">
                              <span className="text-purple-700 font-bold">
                                {review.profiles?.full_name?.charAt(0) || "U"}
                              </span>
                            </div>
                          )}
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-semibold">{review.profiles?.full_name || "Anonymous"}</span>
                              {review.verified && (
                                <Badge className="bg-green-500 text-xs">
                                  <Check className="w-3 h-3 mr-1" />
                                  Verified
                                </Badge>
                              )}
                            </div>
                            <div className="flex items-center gap-1 mt-1">
                              {[...Array(5)].map((_, i) => (
                                <Star
                                  key={i}
                                  className={`w-4 h-4 ${
                                    i < review.rating
                                      ? "fill-yellow-400 text-yellow-400"
                                      : "text-gray-300"
                                  }`}
                                />
                              ))}
                            </div>
                          </div>
                        </div>
                        <span className="text-xs text-gray-500">
                          {new Date(review.created_at).toLocaleDateString()}
                        </span>
                      </div>
                      {review.title && (
                        <h4 className="font-semibold text-gray-900 mb-1">{review.title}</h4>
                      )}
                      {review.comment && (
                        <p className="text-gray-600 text-sm">{review.comment}</p>
                      )}
                    </motion.div>
                  ))
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <Star className="w-12 h-12 mx-auto mb-2 text-gray-300" />
                    <p>No reviews yet</p>
                    <p className="text-sm mt-1">Be the first to review this business!</p>
                  </div>
                )}
              </div>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Images Gallery */}
            {business.images && business.images.length > 0 && (
              <Card className="p-4">
                <h3 className="font-bold mb-3">Gallery</h3>
                <div className="grid grid-cols-2 gap-2">
                  {business.images.slice(0, 4).map((image, idx) => (
                    <img
                      key={idx}
                      src={image}
                      alt={`${business.name} ${idx + 1}`}
                      className="w-full h-24 object-cover rounded-lg"
                    />
                  ))}
                </div>
              </Card>
            )}

            {/* Quick Stats */}
            <Card className="p-4">
              <h3 className="font-bold mb-3">Quick Stats</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Total Reviews</span>
                  <span className="font-bold">{reviews.length}</span>
                </div>
                <Separator />
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Verified Reviews</span>
                  <span className="font-bold text-green-600">{verifiedReviewsCount}</span>
                </div>
                <Separator />
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Avg Rating</span>
                  <span className="font-bold">{calculateAverageRating()} ★</span>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
