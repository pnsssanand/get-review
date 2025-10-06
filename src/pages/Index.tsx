import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Sparkles, Star, TrendingUp, Users, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import heroBg from "@/assets/hero-bg.jpg";
import { BusinessSearch } from "@/components/BusinessSearch";

const Index = () => {
  const navigate = useNavigate();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring" as const,
        stiffness: 100,
      },
    },
  };

  const floatingAnimation = {
    y: [0, -20, 0],
    transition: {
      duration: 3,
      repeat: Infinity,
      ease: "easeInOut" as const,
    },
  };

  return (
    <div className="min-h-screen bg-background overflow-hidden">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center">
        <motion.div
          className="absolute inset-0 bg-cover bg-center opacity-30"
          style={{ backgroundImage: `url(${heroBg})` }}
          initial={{ scale: 1.1 }}
          animate={{ scale: 1 }}
          transition={{ duration: 1.5 }}
        />
        <div className="absolute inset-0 bg-gradient-to-br from-background via-background/50 to-transparent" />

        {/* Animated background particles */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[...Array(20)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-2 h-2 bg-primary/20 rounded-full"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
              animate={{
                y: [0, -30, 0],
                opacity: [0.2, 0.5, 0.2],
              }}
              transition={{
                duration: 3 + Math.random() * 2,
                repeat: Infinity,
                delay: Math.random() * 2,
              }}
            />
          ))}
        </div>
        
        <motion.div
          className="container mx-auto px-4 z-10"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <div className="max-w-4xl mx-auto text-center space-y-8">
            <motion.div
              className="flex justify-center mb-6"
              variants={itemVariants}
              animate={floatingAnimation}
            >
              <div className="p-4 rounded-full bg-gradient-luxury shadow-glow relative">
                <Sparkles className="h-16 w-16 text-primary-foreground" />
                <motion.div
                  className="absolute inset-0 rounded-full bg-gradient-luxury opacity-50"
                  animate={{
                    scale: [1, 1.2, 1],
                    opacity: [0.5, 0, 0.5],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                  }}
                />
              </div>
            </motion.div>
            
            <motion.h1
              className="text-6xl md:text-8xl font-bold leading-tight"
              variants={itemVariants}
            >
              <span className="bg-gradient-luxury bg-clip-text text-transparent">
                Get Review
              </span>
            </motion.h1>
            
            <motion.p
              className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto"
              variants={itemVariants}
            >
              The premium platform for business owners to showcase their presence, 
              collect reviews, and grow their digital footprint.
            </motion.p>
            
            <motion.div
              className="flex flex-col sm:flex-row gap-4 justify-center pt-8"
              variants={itemVariants}
            >
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button
                  size="lg"
                  onClick={() => navigate("/auth")}
                  className="text-lg px-8 py-6 bg-gradient-luxury hover:shadow-glow transition-all group"
                >
                  Get Started
                  <motion.div
                    animate={{ x: [0, 5, 0] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  >
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </motion.div>
                </Button>
              </motion.div>
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button
                  size="lg"
                  variant="outline"
                  onClick={() => navigate("/auth")}
                  className="text-lg px-8 py-6 hover:bg-accent/10 transition-all border-2 border-primary/50"
                >
                  Sign In
                </Button>
              </motion.div>
            </motion.div>

            {/* Business Search */}
            <motion.div
              className="mt-12 w-full"
              variants={itemVariants}
            >
              <div className="p-6 rounded-2xl bg-card/30 backdrop-blur-sm border border-border/50">
                <h3 className="text-2xl font-bold text-center mb-4 text-primary">
                  Find Businesses
                </h3>
                <BusinessSearch />
              </div>
            </motion.div>
          </div>
        </motion.div>
      </section>

      {/* Features Section */}
      <section className="py-24 px-4 bg-gradient-to-b from-background to-luxury-dark relative">
        <div className="container mx-auto">
          <motion.h2
            className="text-4xl md:text-5xl font-bold text-center mb-16 bg-gradient-luxury bg-clip-text text-transparent"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            Premium Features
          </motion.h2>
          
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {[
              {
                icon: Star,
                title: "Smart Profiles",
                description: "Create stunning profile pages with all your social media links and review platforms in one place.",
                gradient: "bg-gradient-gold",
                shadow: "hover:shadow-glow",
              },
              {
                icon: TrendingUp,
                title: "Task Tracking",
                description: "Monitor engagement with interactive task completion system and real-time analytics.",
                gradient: "bg-gradient-purple",
                shadow: "hover:shadow-glow-purple",
              },
              {
                icon: Users,
                title: "Admin Dashboard",
                description: "Powerful admin tools to track user activity, engagement metrics, and platform growth.",
                gradient: "bg-gradient-luxury",
                shadow: "hover:shadow-glow",
              },
            ].map((feature, index) => (
              <motion.div
                key={feature.title}
                className={`group p-8 rounded-2xl bg-card/50 backdrop-blur-sm border border-border/50 ${feature.shadow} transition-all cursor-pointer`}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.2, duration: 0.6 }}
                whileHover={{
                  y: -10,
                  transition: { duration: 0.3 },
                }}
              >
                <motion.div
                  className={`p-3 rounded-full ${feature.gradient} w-fit mb-4`}
                  whileHover={{ rotate: 360, scale: 1.1 }}
                  transition={{ duration: 0.6 }}
                >
                  <feature.icon className="h-8 w-8 text-primary-foreground" />
                </motion.div>
                <h3 className="text-2xl font-bold mb-3">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-4 relative">
        <motion.div
          className="container mx-auto max-w-3xl text-center"
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <motion.h2
            className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-luxury bg-clip-text text-transparent"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
            Ready to Elevate Your Brand?
          </motion.h2>
          <motion.p
            className="text-xl text-muted-foreground mb-8"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
          >
            Join the platform designed for modern business owners who demand excellence.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Button
              size="lg"
              onClick={() => navigate("/auth")}
              className="text-lg px-8 py-6 bg-gradient-luxury hover:shadow-glow transition-all relative overflow-hidden group"
            >
              <span className="relative z-10">Create Your Profile</span>
              <Sparkles className="ml-2 h-5 w-5 relative z-10" />
              <motion.div
                className="absolute inset-0 bg-white opacity-0 group-hover:opacity-20"
                animate={{
                  x: ['-100%', '100%'],
                }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  repeatDelay: 0.5,
                }}
              />
            </Button>
          </motion.div>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/50 py-8">
        <div className="container mx-auto px-4 text-center text-muted-foreground">
          <p className="text-sm">
            © 2025 Get Review. Created with ❤️ by{" "}
            <span className="bg-gradient-luxury bg-clip-text text-transparent font-semibold">
              Mr. Anand Pinisetty
            </span>
            {" "}from{" "}
            <span className="bg-gradient-luxury bg-clip-text text-transparent font-semibold">
              Dream Team
            </span>
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
