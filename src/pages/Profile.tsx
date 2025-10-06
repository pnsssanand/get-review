import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";
import { Sparkles, CheckCircle2, ExternalLink, ArrowLeft, Trophy, Target, Edit } from "lucide-react";
import { motion } from "framer-motion";
import SocialIcon from "@/components/SocialIcons";
import Confetti from "@/components/Confetti";
import ShareProfile from "@/components/ShareProfile";
import Footer from "@/components/Footer";
import "./ProfileLight.css";

const Profile = () => {
  const { userId } = useParams();
  const navigate = useNavigate();
  const [profile, setProfile] = useState<any>(null);
  const [links, setLinks] = useState<any[]>([]);
  const [completions, setCompletions] = useState<any[]>([]);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [showConfetti, setShowConfetti] = useState(false);

  useEffect(() => {
    checkCurrentUser();
    fetchProfile();
    fetchLinks();
  }, [userId]);

  const checkCurrentUser = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    setCurrentUser(user);
    if (user) {
      fetchCompletions(user.id);
    }
  };

  const fetchProfile = async () => {
    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", userId)
      .single();

    if (error) {
      toast.error("Profile not found");
      navigate("/");
    } else {
      setProfile(data);
    }
    setLoading(false);
  };

  const fetchLinks = async () => {
    const { data } = await supabase
      .from("social_links")
      .select("*")
      .eq("user_id", userId)
      .order("order_index");
    if (data) setLinks(data);
  };

  const fetchCompletions = async (currentUserId: string) => {
    const { data } = await supabase
      .from("task_completions")
      .select("*")
      .eq("user_id", userId)
      .eq("completed_by", currentUserId);
    if (data) setCompletions(data);
  };

  const handleLinkClick = async (link: any) => {
    window.open(link.url, "_blank");

    if (currentUser && link.user_id !== currentUser.id) {
      const { error } = await supabase.from("task_completions").insert({
        user_id: link.user_id,
        link_id: link.id,
        completed_by: currentUser.id,
      });

      if (!error) {
        setShowConfetti(true);
        setTimeout(() => setShowConfetti(false), 3000);
        
        toast.success(
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-5 w-5 text-green-500" />
            <span>Task completed! Great job! 🎉</span>
          </div>
        );
        fetchCompletions(currentUser.id);
      }
    }
  };

  const isCompleted = (linkId: string) => {
    return completions.some((c) => c.link_id === linkId);
  };

  const calculateProgress = () => {
    if (links.length === 0) return 0;
    return Math.round((completions.length / links.length) * 100);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse">
          <Sparkles className="h-12 w-12 text-primary" />
        </div>
      </div>
    );
  }

  const smallTasks = links.filter((l) => l.is_small_task);
  const largeTasks = links.filter((l) => !l.is_small_task);
  const progress = calculateProgress();

  // Check if the current user is the owner of this profile
  const isOwner = currentUser?.id === userId;

  return (
    <div className="min-h-screen profile-light-theme">
      <Confetti trigger={showConfetti} />
      <nav className="border-b border-border/50 backdrop-blur-sm bg-white/80 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate("/")}
            className="hover:bg-gray-100"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Home
          </Button>
          
          {isOwner && (
            <Button
              variant="default"
              size="sm"
              onClick={() => navigate("/dashboard")}
              className="bg-gradient-to-r from-amber-500 to-purple-600 hover:from-amber-600 hover:to-purple-700 text-white"
            >
              <Edit className="h-4 w-4 mr-2" />
              Back to Profile Editor
            </Button>
          )}
        </div>
      </nav>

      <div className="container mx-auto px-4 py-12">
        <div className="max-w-3xl mx-auto">
          {/* Profile Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Card className="p-8 mb-8 backdrop-blur-sm bg-card/50 border-border/50 shadow-elegant">
              <div className="flex flex-col items-center text-center">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
                >
                  {profile?.profile_image_url ? (
                    <img
                      src={profile.profile_image_url}
                      alt={profile.full_name}
                      className="w-32 h-32 rounded-full object-cover ring-4 ring-primary shadow-glow mb-6"
                    />
                  ) : (
                    <div className="w-32 h-32 rounded-full bg-gradient-luxury flex items-center justify-center text-5xl font-bold text-primary-foreground shadow-glow mb-6">
                      {profile?.full_name?.charAt(0) || "U"}
                    </div>
                  )}
                </motion.div>

                <motion.h1
                  className="text-4xl font-bold mb-2 text-gray-900"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                >
                  {profile?.full_name}
                </motion.h1>
                {profile?.business_name && (
                  <motion.p
                    className="text-xl text-gray-600"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.4 }}
                  >
                    {profile.business_name}
                  </motion.p>
                )}

                {/* Share Button */}
                <motion.div
                  className="mt-6"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 }}
                >
                  <ShareProfile
                    profileId={userId || ''}
                    profileName={profile?.full_name || 'User'}
                    profileType="user"
                  />
                </motion.div>
              </div>
            </Card>
          </motion.div>

          {/* Featured Platforms - Show only icons + platform names */}
          {links.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
            >
              <Card className="p-8 bg-white border-gray-200 shadow-sm">
                <h3 className="text-2xl font-bold mb-6 text-gray-900 text-center">
                  Featured Platforms
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                  {links.map((link, index) => (
                    <motion.button
                      key={link.id}
                      onClick={() => handleLinkClick(link)}
                      className="social-link-button"
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: index * 0.05 }}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <div className="flex flex-col items-center gap-2 p-4">
                        <div className="social-icon-wrapper">
                          <SocialIcon platform={link.platform} size={28} />
                        </div>
                        <span className="social-label">{link.platform}</span>
                      </div>
                    </motion.button>
                  ))}
                </div>
              </Card>
            </motion.div>
          )}

          {links.length === 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
            >
              <Card className="p-8 text-center bg-white border-gray-200 shadow-sm">
                <p className="text-gray-600 text-lg">
                  Welcome to {profile?.full_name}'s profile! 
                </p>
                {profile?.business_name && (
                  <p className="text-gray-500 mt-2">
                    Check out their business: {profile.business_name}
                  </p>
                )}
              </Card>
            </motion.div>
          )}

          {/* Back to Profile Editor button at bottom (for owner only) */}
          {isOwner && (
            <motion.div
              className="mt-8 text-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
            >
              <Button
                variant="outline"
                onClick={() => navigate("/dashboard")}
                className="border-gray-300 text-gray-700 hover:bg-gray-50"
              >
                <Edit className="h-4 w-4 mr-2" />
                Back to Profile Editor
              </Button>
            </motion.div>
          )}
        </div>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default Profile;
