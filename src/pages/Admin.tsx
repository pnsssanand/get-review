import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Sparkles, LogOut, Search, TrendingUp, Users, CheckCircle2, Link2, BarChart3 } from "lucide-react";
import { motion } from "framer-motion";
import SocialIcon from "@/components/SocialIcons";

const Admin = () => {
  const navigate = useNavigate();
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState<any[]>([]);
  const [completions, setCompletions] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    checkAdminAccess();
  }, []);

  const checkAdminAccess = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      navigate("/auth");
      return;
    }

    const { data: roleData } = await supabase
      .from("user_roles")
      .select("*")
      .eq("user_id", user.id)
      .eq("role", "admin")
      .single();

    if (!roleData) {
      toast.error("Access denied. Admin only.");
      navigate("/dashboard");
      return;
    }

    setIsAdmin(true);
    fetchUsers();
    fetchCompletions();
    setLoading(false);
  };

  const fetchUsers = async () => {
    const { data: profilesData } = await supabase
      .from("profiles")
      .select("*, social_links(*)")
      .order("created_at", { ascending: false });

    if (profilesData) setUsers(profilesData);
  };

  const fetchCompletions = async () => {
    const { data } = await supabase
      .from("task_completions")
      .select("*");

    if (data) setCompletions(data);
  };

  const getCompletionCount = (userId: string) => {
    return completions.filter((c) => c.user_id === userId).length;
  };

  const isLinkCompleted = (linkId: string) => {
    return completions.some((c) => c.link_id === linkId);
  };

  const getCompletionRate = (userId: string) => {
    const user = users.find(u => u.id === userId);
    if (!user || !user.social_links || user.social_links.length === 0) return 0;
    const completed = getCompletionCount(userId);
    return Math.round((completed / user.social_links.length) * 100);
  };

  const getTotalLinks = () => {
    return users.reduce((acc, user) => acc + (user.social_links?.length || 0), 0);
  };

  const getCompletionPercentage = () => {
    const total = getTotalLinks();
    if (total === 0) return 0;
    return Math.round((completions.length / total) * 100);
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate("/");
  };

  const filteredUsers = users.filter(
    (user) =>
      user.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.business_name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse">
          <Sparkles className="h-12 w-12 text-primary" />
        </div>
      </div>
    );
  }

  if (!isAdmin) {
    return null;
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
              Admin Dashboard
            </span>
          </div>
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
      </nav>

      <div className="container mx-auto px-4 py-8">
        {/* Stats Cards */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card className="backdrop-blur-sm bg-card/50 border-border/50 hover:shadow-glow transition-all">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Total Users</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <motion.div
                  className="text-3xl font-bold bg-gradient-luxury bg-clip-text text-transparent"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 200, delay: 0.3 }}
                >
                  {users.length}
                </motion.div>
                <p className="text-xs text-muted-foreground mt-1">Active profiles</p>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="backdrop-blur-sm bg-card/50 border-border/50 hover:shadow-glow-purple transition-all">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Total Completions</CardTitle>
                <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <motion.div
                  className="text-3xl font-bold bg-gradient-purple bg-clip-text text-transparent"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 200, delay: 0.4 }}
                >
                  {completions.length}
                </motion.div>
                <p className="text-xs text-muted-foreground mt-1">Tasks completed</p>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card className="backdrop-blur-sm bg-card/50 border-border/50 hover:shadow-glow transition-all">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Total Links</CardTitle>
                <Link2 className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <motion.div
                  className="text-3xl font-bold bg-gradient-gold bg-clip-text text-transparent"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 200, delay: 0.5 }}
                >
                  {getTotalLinks()}
                </motion.div>
                <p className="text-xs text-muted-foreground mt-1">Social media links</p>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Card className="backdrop-blur-sm bg-card/50 border-border/50 hover:shadow-glow transition-all">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Completion Rate</CardTitle>
                <BarChart3 className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <motion.div
                  className="text-3xl font-bold bg-gradient-luxury bg-clip-text text-transparent"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 200, delay: 0.6 }}
                >
                  {getCompletionPercentage()}%
                </motion.div>
                <p className="text-xs text-muted-foreground mt-1">Overall engagement</p>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Search */}
        <div className="mb-6 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search users..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 bg-background/50"
          />
        </div>

        {/* Users List */}
        <div className="space-y-6">
          {filteredUsers.map((user, index) => (
            <motion.div
              key={user.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="backdrop-blur-sm bg-card/50 border-border/50 hover:shadow-glow transition-all">
                <CardHeader>
                  <div className="flex items-center gap-4">
                    <motion.div
                      whileHover={{ scale: 1.1 }}
                      transition={{ type: "spring", stiffness: 300 }}
                    >
                      {user.profile_image_url ? (
                        <img
                          src={user.profile_image_url}
                          alt={user.full_name}
                          className="w-16 h-16 rounded-full object-cover ring-2 ring-primary"
                        />
                      ) : (
                        <div className="w-16 h-16 rounded-full bg-gradient-luxury flex items-center justify-center text-2xl font-bold text-primary-foreground shadow-glow">
                          {user.full_name?.charAt(0) || "U"}
                        </div>
                      )}
                    </motion.div>
                    <div className="flex-1">
                      <CardTitle className="text-xl bg-gradient-luxury bg-clip-text text-transparent">
                        {user.full_name}
                      </CardTitle>
                      {user.business_name && (
                        <p className="text-sm text-muted-foreground">{user.business_name}</p>
                      )}
                      <div className="flex items-center gap-4 mt-2">
                        <p className="text-sm text-muted-foreground">
                          {getCompletionCount(user.id)} / {user.social_links?.length || 0} completed
                        </p>
                        <div className="h-2 flex-1 max-w-[200px] bg-muted rounded-full overflow-hidden">
                          <motion.div
                            className="h-full bg-gradient-luxury"
                            initial={{ width: 0 }}
                            animate={{ width: `${getCompletionRate(user.id)}%` }}
                            transition={{ duration: 1, delay: 0.5 }}
                          />
                        </div>
                        <span className="text-xs font-semibold text-primary">
                          {getCompletionRate(user.id)}%
                        </span>
                      </div>
                    </div>
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Button
                        onClick={() => navigate(`/profile/${user.id}`)}
                        className="bg-gradient-luxury hover:shadow-glow transition-all"
                      >
                        View Profile
                      </Button>
                    </motion.div>
                  </div>
                </CardHeader>
                <CardContent>
                  {user.social_links && user.social_links.length > 0 ? (
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                      {user.social_links.map((link: any, linkIndex: number) => (
                        <motion.div
                          key={link.id}
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: linkIndex * 0.05 }}
                          className={`p-3 rounded-lg border text-center transition-all cursor-pointer hover:scale-105 ${
                            isLinkCompleted(link.id)
                              ? "bg-green-500/10 border-green-500/50 shadow-glow"
                              : "bg-muted/50 border-border/50"
                          }`}
                        >
                          <div className="flex flex-col items-center gap-2">
                            <SocialIcon platform={link.platform} size={20} />
                            <p className="text-sm font-medium">{link.platform}</p>
                            {link.is_small_task && (
                              <span className="text-xs bg-primary/20 text-primary px-2 py-0.5 rounded-full">
                                Quick
                              </span>
                            )}
                            {isLinkCompleted(link.id) && (
                              <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{ type: "spring", stiffness: 500 }}
                              >
                                <CheckCircle2 className="h-4 w-4 text-green-500" />
                              </motion.div>
                            )}
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground text-center py-4">No links added yet</p>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {filteredUsers.length === 0 && (
          <Card className="p-12 text-center backdrop-blur-sm bg-card/50 border-border/50">
            <p className="text-muted-foreground">No users found</p>
          </Card>
        )}
      </div>
    </div>
  );
};

export default Admin;
