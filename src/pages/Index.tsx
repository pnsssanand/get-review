import { useState, useEffect, useRef } from "react";
import { Card } from "@/components/ui/card";
import { Sparkles, Star, Zap, Heart, Globe } from "lucide-react";
import { motion, useScroll, useTransform, useSpring, useInView } from "framer-motion";
import SocialIcon from "@/components/SocialIcons";
import Footer from "@/components/Footer";
import ShareProfile from "@/components/ShareProfile";

const Index = () => {
  const [loading] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const containerRef = useRef(null);
  const isInView = useInView(containerRef, { once: true });
  
  const { scrollYProgress } = useScroll();
  const smoothProgress = useSpring(scrollYProgress, { stiffness: 100, damping: 30 });
  const backgroundY = useTransform(smoothProgress, [0, 1], ["0%", "100%"]);
  const opacity = useTransform(smoothProgress, [0, 0.5, 1], [1, 0.8, 0.6]);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  // Profile data for Anand Travel Agency
  const profile = {
    id: "anand-travel-agency", // ID for sharing
    full_name: "Anand Travel Agency",
    business_name: "Anand Travel Agency",
    profile_image_url: "/anand-logo.png",
  };

  // Social media links - Anand Travel Agency
  const links = [
    {
      id: "1",
      platform: "WhatsApp",
      url: "https://wa.me/918985816481",
      icon: "whatsapp",
    },
    {
      id: "2",
      platform: "Facebook",
      url: "https://www.facebook.com/profile.php?id=61580145898379",
      icon: "facebook",
    },
    {
      id: "3",
      platform: "Instagram",
      url: "https://www.instagram.com/anandtravels.agency/",
      icon: "instagram",
    },
    {
      id: "4",
      platform: "YouTube",
      url: "https://youtube.com/@anandtravelagency?si=mWr0Cbtll8MjVMhi",
      icon: "youtube",
    },
    {
      id: "5",
      platform: "LinkedIn",
      url: "https://www.linkedin.com/in/anand-pinisetty-656583359/",
      icon: "linkedin",
    },
    {
      id: "6",
      platform: "Twitter",
      url: "https://x.com/anandtravelss",
      icon: "twitter",
    },
    {
      id: "7",
      platform: "Snapchat",
      url: "https://www.snapchat.com/add/anandtravelagen?share_id=5zmnWL-HyQ8&locale=en-US",
      icon: "snapchat",
    },
    {
      id: "8",
      platform: "Threads",
      url: "https://www.threads.com/@anandtravels.agency",
      icon: "threads",
    },
    {
      id: "9",
      platform: "Play Store",
      url: "https://play.google.com/store/apps/details?id=co.median.android.zrbwdr",
      icon: "playstore",
    },
    {
      id: "10",
      platform: "Google Review",
      url: "https://g.page/r/CRF3AUEXTuzdEAE/review",
      icon: "google",
    },
  ];

  const handleLinkClick = (link: any) => {
    window.open(link.url, "_blank");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-purple-900 to-black">
        <motion.div
          animate={{ 
            rotate: 360,
            scale: [1, 1.2, 1]
          }}
          transition={{ 
            rotate: { duration: 2, repeat: Infinity, ease: "linear" },
            scale: { duration: 1, repeat: Infinity, ease: "easeInOut" }
          }}
        >
          <Sparkles className="h-16 w-16 text-yellow-400" />
        </motion.div>
      </div>
    );
  }

  return (
    <div 
      ref={containerRef}
      className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-900 relative overflow-hidden"
    >
      {/* Animated Background Elements */}
      <motion.div 
        className="absolute inset-0 opacity-30"
        style={{ y: backgroundY }}
      >
        <div className="absolute top-20 left-10 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob" />
        <div className="absolute top-40 right-10 w-96 h-96 bg-yellow-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000" />
        <div className="absolute bottom-20 left-1/2 w-96 h-96 bg-pink-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000" />
      </motion.div>

      {/* Cursor Glow Effect */}
      <motion.div
        className="pointer-events-none fixed w-96 h-96 rounded-full bg-gradient-radial from-purple-500/20 to-transparent blur-3xl"
        animate={{
          x: mousePosition.x - 192,
          y: mousePosition.y - 192,
        }}
        transition={{ type: "spring", stiffness: 50, damping: 20 }}
      />

      {/* Floating Particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(30)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-yellow-400/40 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -50, 0],
              x: [0, Math.random() * 30 - 15, 0],
              opacity: [0.2, 0.8, 0.2],
              scale: [1, 1.5, 1],
            }}
            transition={{
              duration: 4 + Math.random() * 3,
              repeat: Infinity,
              delay: Math.random() * 5,
              ease: "easeInOut",
            }}
          />
        ))}
      </div>

      <div className="container mx-auto px-4 py-12 relative z-10">
        <div className="max-w-4xl mx-auto">
          {/* Profile Header - Premium Design */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: isInView ? 1 : 0, y: isInView ? 0 : 50 }}
            transition={{ duration: 0.8, type: "spring", stiffness: 100 }}
          >
            <Card className="p-12 mb-12 backdrop-blur-xl bg-gradient-to-br from-white/10 via-purple-500/5 to-white/5 border border-white/20 shadow-2xl rounded-3xl relative overflow-hidden group">
              {/* Animated Border Glow */}
              <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-yellow-400 via-purple-500 to-pink-500 opacity-0 group-hover:opacity-20 blur-xl transition-opacity duration-700" />
              
              {/* Shimmer Effect */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent"
                animate={{ x: ["-100%", "200%"] }}
                transition={{ duration: 3, repeat: Infinity, repeatDelay: 1 }}
              />

              <div className="flex flex-col items-center text-center relative z-10">
                {/* Profile Avatar with 3D Effect */}
                <motion.div
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ 
                    type: "spring", 
                    stiffness: 200, 
                    delay: 0.2,
                    duration: 1
                  }}
                  whileHover={{ 
                    scale: 1.1, 
                    rotate: 5,
                    transition: { duration: 0.3 }
                  }}
                  className="relative mb-8"
                >
                  {/* Pulsing Rings */}
                  <motion.div
                    className="absolute inset-0 rounded-3xl bg-gradient-to-r from-yellow-400 to-purple-600"
                    animate={{
                      scale: [1, 1.3, 1],
                      opacity: [0.5, 0, 0.5],
                    }}
                    transition={{ duration: 2, repeat: Infinity }}
                  />
                  <motion.div
                    className="absolute inset-0 rounded-3xl bg-gradient-to-r from-pink-400 to-yellow-600"
                    animate={{
                      scale: [1, 1.5, 1],
                      opacity: [0.3, 0, 0.3],
                    }}
                    transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
                  />

                  {profile?.profile_image_url ? (
                    <div className="w-48 h-48 rounded-3xl bg-white/95 backdrop-blur-xl flex items-center justify-center p-6 ring-8 ring-yellow-400/50 shadow-2xl relative z-10">
                      <img
                        src={profile.profile_image_url}
                        alt={profile.full_name}
                        className="w-full h-full object-contain"
                      />
                    </div>
                  ) : (
                    <div className="w-40 h-40 rounded-full bg-gradient-to-br from-yellow-400 via-purple-600 to-pink-600 flex items-center justify-center text-6xl font-bold text-white shadow-2xl relative z-10 ring-8 ring-yellow-400/50">
                      {profile?.full_name?.charAt(0) || "A"}
                    </div>
                  )}

                  {/* Floating Icons */}
                  <motion.div
                    className="absolute -top-2 -right-2"
                    animate={{ y: [0, -10, 0], rotate: [0, 10, 0] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    <Star className="w-8 h-8 text-yellow-400 fill-yellow-400" />
                  </motion.div>
                  <motion.div
                    className="absolute -bottom-2 -left-2"
                    animate={{ y: [0, 10, 0], rotate: [0, -10, 0] }}
                    transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
                  >
                    <Zap className="w-8 h-8 text-purple-400 fill-purple-400" />
                  </motion.div>
                </motion.div>

                {/* Title with Gradient Animation */}
                <motion.h1
                  className="text-5xl md:text-7xl font-black mb-4 bg-gradient-to-r from-yellow-400 via-purple-400 to-pink-400 bg-clip-text text-transparent leading-tight"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4, duration: 0.6 }}
                  style={{
                    textShadow: "0 0 30px rgba(234, 179, 8, 0.3)",
                  }}
                >
                  {profile?.full_name || "Anand Travel Agency"}
                </motion.h1>

                {profile?.business_name && (
                  <motion.p
                    className="text-2xl text-white/80 mb-6 font-light tracking-wide"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                  >
                    {profile.business_name}
                  </motion.p>
                )}

                {/* Description with Typewriter Effect */}
                <motion.p
                  className="text-lg md:text-xl text-white/70 max-w-2xl mb-8 leading-relaxed font-light"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.6 }}
                >
                  ✈️ Connect with us on social media and stay updated with our latest{" "}
                  <span className="text-yellow-400 font-semibold">travel packages</span> and{" "}
                  <span className="text-purple-400 font-semibold">exclusive offers</span>!
                </motion.p>

                {/* Share Button with Premium Style */}
                <motion.div
                  className="mt-6"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.7, type: "spring", stiffness: 200 }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <ShareProfile
                    profileId={profile.id}
                    profileName={profile.full_name}
                    profileType="user"
                  />
                </motion.div>

                {/* Decorative Elements */}
                <div className="flex gap-6 mt-8">
                  {[Heart, Globe, Sparkles].map((Icon, index) => (
                    <motion.div
                      key={index}
                      animate={{ 
                        y: [0, -10, 0],
                        rotate: [0, 10, -10, 0]
                      }}
                      transition={{ 
                        duration: 3, 
                        repeat: Infinity,
                        delay: index * 0.3
                      }}
                    >
                      <Icon className="w-6 h-6 text-white/40" />
                    </motion.div>
                  ))}
                </div>
              </div>
            </Card>
          </motion.div>

          {/* Social Media Links - Themed Modern Grid */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9, duration: 0.6 }}
          >
            <Card className="p-8 md:p-12 backdrop-blur-2xl bg-gradient-to-br from-white/8 via-purple-500/5 to-white/8 border border-white/20 shadow-2xl rounded-3xl relative overflow-hidden">
              {/* Animated gradient background */}
              <motion.div 
                className="absolute inset-0 opacity-30"
                animate={{
                  background: [
                    "radial-gradient(circle at 20% 50%, rgba(234, 179, 8, 0.1) 0%, transparent 50%)",
                    "radial-gradient(circle at 80% 50%, rgba(168, 85, 247, 0.1) 0%, transparent 50%)",
                    "radial-gradient(circle at 20% 50%, rgba(234, 179, 8, 0.1) 0%, transparent 50%)",
                  ]
                }}
                transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
              />

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1 }}
                className="relative mb-10"
              >
                <h3 className="text-3xl md:text-4xl font-bold text-center text-white/95 mb-2">
                  <motion.span 
                    className="inline-block mr-2"
                    animate={{ rotate: [0, 15, -15, 0], scale: [1, 1.2, 1] }}
                    transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
                  >
                    ✨
                  </motion.span>
                  Connect With Us
                  <motion.span 
                    className="inline-block ml-2"
                    animate={{ rotate: [0, -15, 15, 0], scale: [1, 1.2, 1] }}
                    transition={{ duration: 2, repeat: Infinity, repeatDelay: 3, delay: 0.2 }}
                  >
                    ✨
                  </motion.span>
                </h3>
                <p className="text-center text-white/60 text-sm md:text-base">
                  Follow us on social media for exclusive travel deals & updates
                </p>
              </motion.div>

              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4 md:gap-6 relative z-10">
                {links.map((link, index) => {
                  // Platform-specific colors for themed buttons
                  const platformColors: { [key: string]: { from: string; to: string; glow: string } } = {
                    "WhatsApp": { from: "from-green-500/20", to: "to-emerald-600/20", glow: "shadow-green-500/50" },
                    "Facebook": { from: "from-blue-500/20", to: "to-blue-700/20", glow: "shadow-blue-500/50" },
                    "Instagram": { from: "from-pink-500/20", to: "to-purple-600/20", glow: "shadow-pink-500/50" },
                    "YouTube": { from: "from-red-500/20", to: "to-red-700/20", glow: "shadow-red-500/50" },
                    "LinkedIn": { from: "from-blue-400/20", to: "to-cyan-600/20", glow: "shadow-blue-400/50" },
                    "Twitter": { from: "from-gray-700/20", to: "to-black/20", glow: "shadow-gray-500/50" },
                    "Snapchat": { from: "from-yellow-300/20", to: "to-yellow-500/20", glow: "shadow-yellow-400/50" },
                    "Threads": { from: "from-gray-800/20", to: "to-black/20", glow: "shadow-gray-600/50" },
                    "Play Store": { from: "from-cyan-400/20", to: "to-green-500/20", glow: "shadow-cyan-400/50" },
                    "Google Review": { from: "from-blue-400/20", to: "to-red-500/20", glow: "shadow-blue-500/50" },
                  };
                  
                  const colors = platformColors[link.platform] || { from: "from-white/15", to: "to-white/5", glow: "shadow-white/50" };
                  
                  return (
                    <motion.button
                      key={link.id}
                      onClick={() => handleLinkClick(link)}
                      className="group relative overflow-hidden rounded-2xl transition-all duration-300"
                      initial={{ opacity: 0, scale: 0.8, y: 20 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      transition={{ 
                        delay: 1 + index * 0.05,
                        duration: 0.4,
                        ease: [0.34, 1.56, 0.64, 1]
                      }}
                      whileHover={{ 
                        y: -10,
                        transition: { duration: 0.2 }
                      }}
                      whileTap={{ scale: 0.95 }}
                    >
                      {/* Base glass background */}
                      <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-lg border border-white/20 rounded-2xl transition-all duration-300 group-hover:from-white/20 group-hover:to-white/10 group-hover:border-white/30" />
                      
                      {/* Platform-themed gradient overlay */}
                      <div className={`absolute inset-0 bg-gradient-to-br ${colors.from} ${colors.to} rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />
                      
                      {/* Animated border glow */}
                      <div className={`absolute -inset-0.5 rounded-2xl opacity-0 group-hover:opacity-75 transition-opacity duration-300 ${colors.glow} shadow-lg blur-sm`} />
                      
                      {/* Shimmer effect */}
                      <div className="absolute inset-0 rounded-2xl overflow-hidden">
                        <motion.div
                          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                          initial={{ x: "-100%" }}
                          animate={{ x: "100%" }}
                          transition={{
                            duration: 2,
                            repeat: Infinity,
                            repeatDelay: 3,
                            ease: "easeInOut"
                          }}
                        />
                      </div>

                      {/* Content */}
                      <div className="relative flex flex-col items-center gap-3 py-6 px-3 md:px-4">
                        {/* Icon with scale animation */}
                        <motion.div 
                          className="transition-all duration-300"
                          whileHover={{ 
                            scale: 1.15,
                            rotate: [0, -8, 8, 0],
                            transition: { duration: 0.5 }
                          }}
                        >
                          <SocialIcon platform={link.platform} size={40} />
                        </motion.div>
                        
                        {/* Label with gradient on hover */}
                        <span className="text-xs md:text-sm font-bold text-white/85 group-hover:text-white transition-all duration-300 text-center leading-tight">
                          {link.platform}
                        </span>
                      </div>

                      {/* Corner accent */}
                      <div className="absolute top-2 right-2 w-2 h-2 rounded-full bg-white/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300 group-hover:animate-ping" />
                    </motion.button>
                  );
                })}
              </div>
            </Card>
          </motion.div>
        </div>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default Index;
