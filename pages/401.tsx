import Auth from 'layouts/Auth';
import type { NextPage } from 'next';
import { Flex } from '@chakra-ui/react';
import Text from 'components/Typography/Text';

const custom401Page: NextPage = () => {
  return (
    <Flex align="center" justify="center" height="100vh">
      <Text variant="bodyMediumRegular">
        <strong>401</strong> | Could not access this page.
      </Text>
    </Flex>
  );
};

export default custom401Page;
