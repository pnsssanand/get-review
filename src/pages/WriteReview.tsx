import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Star, ArrowLeft, Check, AlertCircle } from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "sonner";

export default function WriteReview() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [title, setTitle] = useState("");
  const [comment, setComment] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [hasSocialClick, setHasSocialClick] = useState(false);
  const [businessName, setBusinessName] = useState("");

  useEffect(() => {
    checkUserAndClicks();
    fetchBusinessName();
  }, [id]);

  const checkUserAndClicks = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      toast.error("Please sign in to write a review");
      navigate("/auth");
      return;
    }

    setCurrentUser(user);

    // Check if user has clicked any social link
    const { data: hasClick } = await supabase.rpc("has_social_click", {
      user_uuid: user.id,
      business_uuid: id!,
    });

    setHasSocialClick(hasClick || false);
  };

  const fetchBusinessName = async () => {
    if (!id) return;
    
    const { data } = await supabase
      .from("businesses")
      .select("name")
      .eq("id", id)
      .single();

    if (data) {
      setBusinessName(data.name);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!currentUser) {
      toast.error("Please sign in to write a review");
      return;
    }

    if (rating === 0) {
      toast.error("Please select a rating");
      return;
    }

    setIsLoading(true);

    try {
      const { error } = await supabase
        .from("reviews")
        .insert({
          business_id: id!,
          user_id: currentUser.id,
          rating,
          title: title.trim() || null,
          comment: comment.trim() || null,
        });

      if (error) {
        if (error.code === "23505") { // Unique constraint violation
          toast.error("You've already reviewed this business", {
            description: "You can only submit one review per business"
          });
        } else {
          throw error;
        }
        return;
      }

      toast.success("Review submitted successfully! 🎉", {
        description: hasSocialClick 
          ? "Your review is verified ✓" 
          : "Click social links to verify your review",
      });

      navigate(`/business/${id}`);
    } catch (error: any) {
      console.error("Error submitting review:", error);
      toast.error("Failed to submit review", {
        description: error.message,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <Button
          variant="ghost"
          onClick={() => navigate(`/business/${id}`)}
          className="mb-6"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Business
        </Button>

        <Card className="p-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold mb-2">Write a Review</h1>
            {businessName && (
              <p className="text-gray-600">for {businessName}</p>
            )}
          </div>

          {/* Verification Status */}
          {hasSocialClick ? (
            <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-start gap-3">
              <Check className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-green-900">Verified Reviewer ✓</p>
                <p className="text-sm text-green-700">
                  You've clicked this business's social links. Your review will be marked as verified.
                </p>
              </div>
            </div>
          ) : (
            <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-blue-900">Become a Verified Reviewer</p>
                <p className="text-sm text-blue-700">
                  Click on the business's social media links first to get the verified badge on your review!
                </p>
                <Button
                  variant="link"
                  className="p-0 h-auto text-blue-600 mt-1"
                  onClick={() => navigate(`/business/${id}`)}
                >
                  Go back and click social links →
                </Button>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Rating */}
            <div className="text-center">
              <Label className="text-lg font-semibold mb-3 block">Your Rating *</Label>
              <div className="flex justify-center gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <motion.button
                    key={star}
                    type="button"
                    whileHover={{ scale: 1.2 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setRating(star)}
                    onMouseEnter={() => setHoverRating(star)}
                    onMouseLeave={() => setHoverRating(0)}
                    className="focus:outline-none"
                  >
                    <Star
                      className={`w-12 h-12 transition-all ${
                        star <= (hoverRating || rating)
                          ? "fill-yellow-400 text-yellow-400"
                          : "text-gray-300"
                      }`}
                    />
                  </motion.button>
                ))}
              </div>
              {rating > 0 && (
                <p className="mt-2 text-gray-600">
                  {rating === 1 && "Poor"}
                  {rating === 2 && "Fair"}
                  {rating === 3 && "Good"}
                  {rating === 4 && "Very Good"}
                  {rating === 5 && "Excellent"}
                </p>
              )}
            </div>

            {/* Title */}
            <div>
              <Label htmlFor="title">Review Title (Optional)</Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Sum up your experience"
                maxLength={100}
              />
              <p className="text-xs text-gray-500 mt-1">
                {title.length}/100 characters
              </p>
            </div>

            {/* Comment */}
            <div>
              <Label htmlFor="comment">Your Review (Optional)</Label>
              <Textarea
                id="comment"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Share details about your experience..."
                rows={6}
                maxLength={1000}
              />
              <p className="text-xs text-gray-500 mt-1">
                {comment.length}/1000 characters
              </p>
            </div>

            {/* Submit Button */}
            <div className="flex gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate(`/business/${id}`)}
                disabled={isLoading}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isLoading || rating === 0}
                className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
              >
                {isLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Submitting...
                  </>
                ) : (
                  <>
                    <Star className="w-4 h-4 mr-2" />
                    Submit Review
                  </>
                )}
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </div>
  );
}
