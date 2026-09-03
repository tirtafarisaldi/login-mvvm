import { Box, Spinner } from '@chakra-ui/react';

export default function MenuLoadingScreen() {
  return (
    <Box
      position="fixed"
      inset={0}
      zIndex={100}
      display="flex"
      alignItems="center"
      justifyContent="center"
      bg="white"
    >
      <Spinner
        thickness="3px"
        speed="0.8s"
        size="lg"
        color="blue.500"
        boxShadow="0 8px 24px rgba(37,99,235,0.35)"
        borderRadius="full"
      />
    </Box>
  );
}