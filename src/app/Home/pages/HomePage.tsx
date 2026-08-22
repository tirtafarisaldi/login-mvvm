import { Box, Button, Heading, SimpleGrid, Text } from '@chakra-ui/react';
import NextLink from 'next/link';
import MenuLayout from '../../Menus/components/MenuLayout';
import { useHomeViewModel } from '../viewModels/HomeViewModel';

export default function HomePage() {
  const { features } = useHomeViewModel();

  return (
    <MenuLayout>
      <Text color="cyan.300" fontWeight="semibold" mb={2}>
        DASHBOARD
      </Text>
      <Heading size="lg" color="white">
        Selamat datang di CMS Studio Pertunjukan
      </Heading>
      <Text color="whiteAlpha.700" mt={2} mb={8}>
        Pilih menu untuk mulai mengelola aktivitas laboratorium.
      </Text>
      <SimpleGrid columns={{ base: 1, md: 2 }} spacing={5}>
        {features.map((feature) => (
          <Box
            key={feature.id}
            bg="whiteAlpha.070"
            p={6}
            borderRadius="2xl"
            borderWidth="1px"
            borderColor="rgba(103, 232, 249, 0.24)"
            backdropFilter="blur(18px)"
          >
            <Heading size="md" color="white">
              {feature.label}
            </Heading>
            <Text color="whiteAlpha.700" mt={2} mb={5}>
              {feature.description}
            </Text>
            {feature.href ? (
              <NextLink href={feature.href} passHref>
                <Button
                  as="a"
                  bg="cyan.300"
                  color="gray.900"
                  _hover={{ bg: 'cyan.200' }}
                >
                  Buka menu
                </Button>
              </NextLink>
            ) : (
              <Button isDisabled>Segera hadir</Button>
            )}
          </Box>
        ))}
      </SimpleGrid>
    </MenuLayout>
  );
}
