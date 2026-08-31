import { Box } from '@chakra-ui/react';
import { motion, useMotionValue, useSpring } from 'framer-motion';
import { useRef, type MouseEvent, type ReactNode } from 'react';

interface GlassCardProps {
  children: ReactNode;
  radius?: string;
  depth?: number;
  maxTilt?: number;
  className?: string;
}

export default function GlassCard({
  children,
  radius = '2xl',
  depth = 22,
  maxTilt = 8,
  className,
}: GlassCardProps) {
  const ref = useRef<HTMLDivElement>(null);

  const rotateX = useMotionValue(0);
  const rotateY = useMotionValue(0);
  const springRotateX = useSpring(rotateX, { stiffness: 180, damping: 20 });
  const springRotateY = useSpring(rotateY, { stiffness: 180, damping: 20 });

  const handleMouseMove = (event: MouseEvent<HTMLDivElement>) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const nx = (event.clientX - rect.left) / rect.width;
    const ny = (event.clientY - rect.top) / rect.height;
    rotateX.set((0.5 - ny) * maxTilt);
    rotateY.set((nx - 0.5) * maxTilt);
  };

  const handleMouseLeave = () => {
    rotateX.set(0);
    rotateY.set(0);
  };

  return (
    <motion.div
      ref={ref}
      className={className}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        position: 'relative',
        transformPerspective: 1200,
        rotateX: springRotateX,
        rotateY: springRotateY,
        transformStyle: 'preserve-3d',
      }}
    >
      <Box
        position="absolute"
        inset={0}
        borderRadius={radius}
        bg="rgba(0,0,0,0.48)"
        borderWidth="1px"
        borderColor="rgba(255,255,255,0.09)"
        backdropFilter="blur(10px)"
        boxShadow="0 1px 2px rgba(0,0,0,0.35), inset 0 1px 0 rgba(255,255,255,0.03)"
      />
      <Box
        position="relative"
        h="full"
        zIndex={1}
        style={{ transform: `translateZ(${depth}px)` }}
      >
        {children}
      </Box>
    </motion.div>
  );
}
