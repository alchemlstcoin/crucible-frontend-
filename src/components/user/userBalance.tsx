import { FC } from 'react';
import { Box, Flex, SimpleGrid, Text } from '@chakra-ui/layout';
import { CountUp } from 'use-count-up';
import { useMediaQuery } from '@chakra-ui/react';
import { useBalances } from 'store/userBalances';
import formatNumber from 'utils/formatNumber';
import bigNumberishToNumber from 'utils/bigNumberishToNumber';

const UserBalance: FC = () => {
  const [isLargerThan375] = useMediaQuery('(min-width: 376px)');
  const { assets } = useBalances();

  const decimalsToDisplay = isLargerThan375 ? 4 : 3;

  return (
    <Box
      p={2}
      width={497}
      height={12}
      bg='gray.900'
      borderRadius={[0, 'xl']}
      boxShadow='xl'
    >
      <SimpleGrid columns={3} spacing={2} fontSize='sm' height='100%'>
        {assets.map((asset) => (
          <Flex
            key={asset.symbol}
            alignItems='center'
            borderRadius='md'
            bg='gray.800'
            px={2}
          >
            <Text color='gray.300' mr={2}>
              {asset.symbol}:
            </Text>{' '}
            <Text fontWeight='bold'>
              <CountUp
                isCounting={true}
                end={bigNumberishToNumber(asset.value.amount)}
                autoResetKey={asset.symbol}
                duration={0.4}
                formatter={(value) => {
                  return value >= 0
                    ? formatNumber.tokenCustom(
                        value,
                        '',
                        decimalsToDisplay,
                        decimalsToDisplay
                      )
                    : '-';
                }}
              />
            </Text>
          </Flex>
        ))}
      </SimpleGrid>
    </Box>
  );
};

export default UserBalance;
