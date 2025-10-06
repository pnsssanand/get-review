import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";
import { Sparkles, LogOut, Settings, Search } from "lucide-react";
import ProfileSetup from "@/components/ProfileSetup";
import { ConvertToBusinessButton } from "@/components/ConvertToBusinessButton";
import { BusinessSearch } from "@/components/BusinessSearch";
import { motion } from "framer-motion";

const Dashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkUser();
    
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!session) {
        navigate("/auth");
      } else {
        setUser(session.user);
        fetchProfile(session.user.id);
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const checkUser = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      navigate("/auth");
    } else {
      setUser(session.user);
      await fetchProfile(session.user.id);
    }
    setLoading(false);
  };

  const fetchProfile = async (userId: string) => {
    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", userId)
      .single();

    if (error) {
      console.error("Error fetching profile:", error);
    } else {
      setProfile(data);
    }
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    toast.success("Signed out successfully");
    navigate("/");
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

  return (
    <div className="min-h-screen bg-background">
      <nav className="border-b border-border/50 backdrop-blur-sm bg-card/30">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-full bg-gradient-luxury">
              <Sparkles className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold bg-gradient-luxury bg-clip-text text-transparent">
              Get Review
            </span>
          </div>
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate(`/profile/${user?.id}`)}
              className="hover:bg-accent/10"
            >
              <Settings className="h-4 w-4 mr-2" />
              My Profile
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleSignOut}
              className="hover:bg-destructive/10"
            >
              <LogOut className="h-4 w-4 mr-2" />
              Sign Out
            </Button>
          </div>
        </div>
      </nav>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto space-y-8">
          <div>
            <h1 className="text-4xl font-bold mb-2 bg-gradient-luxury bg-clip-text text-transparent">
              Welcome, {profile?.full_name || "User"}
            </h1>
            <p className="text-muted-foreground mb-8">
              Create and manage your premium review profile
            </p>
          </div>

          {/* Business Search Section - Only for authenticated users */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Card className="p-6 bg-gradient-to-br from-purple-50/50 via-white/50 to-pink-50/50 border-2 border-purple-100 shadow-lg">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 rounded-full bg-gradient-luxury">
                  <Search className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">
                    Find Businesses
                  </h2>
                  <p className="text-sm text-gray-600">
                    Search for businesses to review and connect with
                  </p>
                </div>
              </div>
              <BusinessSearch />
            </Card>
          </motion.div>

          {/* Profile Setup Section */}
          <ProfileSetup userId={user?.id} profile={profile} onUpdate={fetchProfile} />
        </div>
      </div>

      {/* Floating Convert to Business Button */}
      {user && profile && (
        <ConvertToBusinessButton currentUser={user} currentProfile={profile} />
      )}
    </div>
  );
};

export default Dashboard;
