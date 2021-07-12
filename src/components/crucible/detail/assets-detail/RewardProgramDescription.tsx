import { Box, Text, Heading, Link, HStack } from '@chakra-ui/react';
import { SimpleGrid } from '@chakra-ui/layout';
import { useRewardPrograms } from 'store/rewardPrograms';
import { RiExternalLinkLine } from 'react-icons/ri';
import { useRewardProgramTokens } from '../../../../store/rewardProgramTokens';

const RewardProgramDescription: React.FC = () => {
  const { currentRewardProgram } = useRewardPrograms();
  const { stakingToken, rewardToken, bonusTokens } = useRewardProgramTokens();

  const renderTokenBadge = (symbol?: string, tokenAddress?: string) => (
    <Box
      key={tokenAddress}
      px={1}
      py={2}
      bg='gray.50'
      borderColor='gray.50'
      borderWidth={1}
      borderRadius='xl'
      boxShadow='sm'
    >
      {symbol}
    </Box>
  );

  return (
    <Box
      p={4}
      borderWidth={1}
      borderRadius='xl'
      borderColor='gray.50'
      boxShadow='md'
    >
      <Heading textAlign='left' size='sm' mb={2}>
        Description
      </Heading>
      <Text textAlign='left' mb={4}>
        {currentRewardProgram.description}
      </Text>
      {/* <Heading textAlign='left' size='sm' mb={2}>
        {currentRewardProgram.maintainer}
      </Heading>
      <Text textAlign='left' mb={4}>ForthAmple</Text> */}
      <Heading textAlign='left' size='sm' mb={2}>
        <Link href={currentRewardProgram.getStakingTokenUrl} isExternal>
          <HStack>
            <Text>Staking token</Text> <RiExternalLinkLine />
          </HStack>
        </Link>
      </Heading>
      <SimpleGrid columns={[2, 3]} gap={4} mb={4}>
        {renderTokenBadge(stakingToken?.tokenSymbol, stakingToken?.address)}
      </SimpleGrid>
      <Heading textAlign='left' size='sm' mb={2}>
        Reward tokens
      </Heading>
      <SimpleGrid columns={[2, 3]} gap={4}>
        {renderTokenBadge(rewardToken?.tokenSymbol, stakingToken?.address)}
        {bonusTokens?.map((token) =>
          renderTokenBadge(token.tokenSymbol, token.address)
        )}
      </SimpleGrid>
    </Box>
  );
};

export default RewardProgramDescription;
