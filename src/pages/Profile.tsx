import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";
import { Sparkles, CheckCircle2, ExternalLink, ArrowLeft, Trophy, Target } from "lucide-react";
import { motion } from "framer-motion";
import SocialIcon from "@/components/SocialIcons";
import Confetti from "@/components/Confetti";
import ShareProfile from "@/components/ShareProfile";

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

  return (
    <div className="min-h-screen bg-background">
      <Confetti trigger={showConfetti} />
      <nav className="border-b border-border/50 backdrop-blur-sm bg-card/30 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate("/")}
            className="hover:bg-accent/10"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Home
          </Button>
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
                  className="text-4xl font-bold mb-2 bg-gradient-luxury bg-clip-text text-transparent"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                >
                  {profile?.full_name}
                </motion.h1>
                {profile?.business_name && (
                  <motion.p
                    className="text-xl text-muted-foreground"
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

          {/* Progress Card */}
          {currentUser && currentUser.id !== userId && links.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <Card className="p-6 mb-8 backdrop-blur-sm bg-card/50 border-border/50">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <Trophy className="h-6 w-6 text-primary" />
                    <h3 className="text-xl font-bold">Your Progress</h3>
                  </div>
                  <div className="flex items-center gap-2">
                    <Target className="h-5 w-5 text-muted-foreground" />
                    <span className="text-lg font-semibold">
                      {completions.length} / {links.length}
                    </span>
                  </div>
                </div>
                <Progress value={progress} className="h-3 mb-2" />
                <p className="text-sm text-muted-foreground text-center">
                  {progress === 100 ? (
                    <span className="text-green-500 font-semibold flex items-center justify-center gap-2">
                      <CheckCircle2 className="h-4 w-4" />
                      All tasks completed! Amazing! 🎉
                    </span>
                  ) : (
                    `${progress}% Complete - Keep going!`
                  )}
                </p>
              </Card>
            </motion.div>
          )}

          {/* Small Tasks */}
          {smallTasks.length > 0 && (
            <motion.div
              className="mb-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
            >
              <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                <Sparkles className="h-6 w-6 text-primary" />
                Quick Actions
              </h2>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {smallTasks.map((link, index) => (
                  <motion.button
                    key={link.id}
                    onClick={() => handleLinkClick(link)}
                    className={`group relative p-6 rounded-xl backdrop-blur-sm border transition-all ${
                      isCompleted(link.id)
                        ? "bg-green-500/10 border-green-500/50 shadow-glow"
                        : "bg-card/50 border-border/50 hover:shadow-glow"
                    }`}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.1 }}
                    whileHover={{ scale: 1.05, y: -5 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <div className="flex flex-col items-center gap-2">
                      <div className={`p-3 rounded-full transition-all ${
                        isCompleted(link.id)
                          ? "bg-green-500/20"
                          : "bg-gradient-luxury group-hover:scale-110"
                      }`}>
                        <SocialIcon platform={link.platform} size={24} />
                      </div>
                      <span className="text-sm font-medium">{link.platform}</span>
                      {isCompleted(link.id) && (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ type: "spring", stiffness: 500, damping: 15 }}
                        >
                          <CheckCircle2 className="absolute top-2 right-2 h-5 w-5 text-green-500" />
                        </motion.div>
                      )}
                    </div>
                  </motion.button>
                ))}
              </div>
            </motion.div>
          )}

          {/* Large Tasks */}
          {largeTasks.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
            >
              <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                <Sparkles className="h-6 w-6 text-primary" />
                Featured Links
              </h2>
              <div className="space-y-4">
                {largeTasks.map((link, index) => (
                  <motion.button
                    key={link.id}
                    onClick={() => handleLinkClick(link)}
                    className={`group relative w-full p-6 rounded-xl backdrop-blur-sm border transition-all text-left ${
                      isCompleted(link.id)
                        ? "bg-green-500/10 border-green-500/50 shadow-glow"
                        : "bg-card/50 border-border/50 hover:shadow-glow"
                    }`}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    whileHover={{ scale: 1.02, x: 10 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className={`p-3 rounded-full transition-all ${
                          isCompleted(link.id)
                            ? "bg-green-500/20"
                            : "bg-gradient-luxury group-hover:scale-110"
                        }`}>
                          <SocialIcon platform={link.platform} size={24} />
                        </div>
                        <div>
                          <h3 className="font-bold text-lg">{link.platform}</h3>
                          <p className="text-sm text-muted-foreground truncate max-w-xs">
                            {link.url}
                          </p>
                        </div>
                      </div>
                      {isCompleted(link.id) && (
                        <motion.div
                          initial={{ scale: 0, rotate: -180 }}
                          animate={{ scale: 1, rotate: 0 }}
                          transition={{ type: "spring", stiffness: 500, damping: 15 }}
                        >
                          <CheckCircle2 className="h-6 w-6 text-green-500" />
                        </motion.div>
                      )}
                    </div>
                  </motion.button>
                ))}
              </div>
            </motion.div>
          )}

          {links.length === 0 && (
            <Card className="p-12 text-center backdrop-blur-sm bg-card/50 border-border/50">
              <p className="text-muted-foreground">No links added yet</p>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;
