import { useEffect } from "react";
import { motion } from "framer-motion";

interface ConfettiProps {
  trigger: boolean;
}

export const Confetti = ({ trigger }: ConfettiProps) => {
  if (!trigger) return null;

  const confettiColors = ["#FFD700", "#FF69B4", "#00CED1", "#FF4500", "#9370DB"];
  const confettiCount = 50;

  return (
    <div className="fixed inset-0 pointer-events-none z-50">
      {[...Array(confettiCount)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-3 h-3 rounded-full"
          style={{
            backgroundColor: confettiColors[i % confettiColors.length],
            left: `${Math.random() * 100}%`,
            top: "-10%",
          }}
          initial={{ y: 0, opacity: 1, rotate: 0 }}
          animate={{
            y: "110vh",
            opacity: 0,
            rotate: Math.random() * 720 - 360,
            x: (Math.random() - 0.5) * 200,
          }}
          transition={{
            duration: 2 + Math.random() * 2,
            ease: "easeOut",
            delay: Math.random() * 0.5,
          }}
        />
      ))}
    </div>
  );
};

export default Confetti;
