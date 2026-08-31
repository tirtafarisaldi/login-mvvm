import { Box } from '@chakra-ui/react';
import { type ReactNode } from 'react';
import { useThemeStore } from '../../../src/app/Menus/store/useThemeStore';

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
  className,
}: GlassCardProps) {
  const mode = useThemeStore((state) => state.mode);

  const isDark = mode === 'dark';

  return (
    <Box position="relative" className={className}>
      <Box
        position="absolute"
        inset={0}
        borderRadius={radius}
        bg={isDark ? 'rgba(0,0,0,0.48)' : 'rgba(255,255,255,0.88)'}
        borderWidth="1px"
        borderColor={isDark ? 'rgba(255,255,255,0.09)' : 'rgba(15,23,42,0.12)'}
        boxShadow={
          isDark
            ? '0 1px 2px rgba(0,0,0,0.35), inset 0 1px 0 rgba(255,255,255,0.03)'
            : '0 8px 30px rgba(15,23,42,0.10), inset 0 1px 0 rgba(255,255,255,0.9)'
        }
      />
      <Box position="relative" h="full" zIndex={1}>
        {children}
      </Box>
    </Box>
  );
}
