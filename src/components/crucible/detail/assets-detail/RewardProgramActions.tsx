import React, { FC, useMemo } from 'react';
import { Box, Button, Flex, SimpleGrid, Text, Tooltip } from '@chakra-ui/react';
import dayjs from 'dayjs';
import { ModalType } from 'components/modals/types';
import { ProgramToken } from './Rewards';
import { useBlocktime } from 'hooks/useBlocktime';
import { useRewardPrograms } from 'store/rewardPrograms';
import { BigNumber } from 'ethers';
import { useModal } from 'store/modals';
import { Crucible } from 'store/crucibles';
import formatNumber from 'utils/formatNumber';
import { useRewardProgramTokens } from 'store/rewardProgramTokens';
import { useSubscriptions } from 'store/subscriptions';
import { useStakingTokenBalance } from 'hooks/useStakingTokenBalance';

type Props = {
  crucible: Crucible;
};

const RewardProgramActions: FC<Props> = ({ crucible }) => {
  const { openModal } = useModal();
  const { blockTimestamp, blockTimestampLoading } = useBlocktime();
  const { currentRewardProgram } = useRewardPrograms();
  const { stakingToken } = useRewardProgramTokens();
  const { subscriptionsLoading } = useSubscriptions();

  const { stakingTokenUnlocked, stakingTokenLocked, stakingTokenInWallet } =
    useStakingTokenBalance(
      stakingToken?.address as string,
      crucible?.id,
      currentRewardProgram.address as string,
      subscriptionsLoading
    );

  const rewardProgramExpired = useMemo(() => {
    return dayjs
      .unix(currentRewardProgram.expiryTimestamp as number)
      .isBefore(dayjs.unix(blockTimestamp));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [blockTimestamp]);

  const renderBalanceBadge = (tokenSymbol: string, amount: BigNumber) => {
    return (
      <Box p={2} bg='white' mb={2} borderRadius='xl'>
        <Flex justifyContent='space-between' alignItems='center'>
          <Text
            fontSize='sm'
            isTruncated
            bg='gray.50'
            borderRadius='lg'
            py={1}
            px={2}
          >
            {tokenSymbol}
          </Text>
          <Text color='gray.400'>{formatNumber.token(amount)}</Text>
        </Flex>
      </Box>
    );
  };

  return (
    <Box bg='gray.50' p={4} borderRadius='xl' textAlign='left' mb={4}>
      <SimpleGrid columns={[1, 2]} gap={8}>
        <Box>
          {stakingToken && stakingTokenUnlocked && stakingTokenInWallet && (
            <Tooltip
              label='This is your available balance within your wallet and Crucible'
              placement='top'
            >
              <>
                <Text fontWeight='semibold' mb={2}>
                  Available token balance
                </Text>
                {renderBalanceBadge(
                  stakingToken.tokenSymbol,
                  stakingTokenUnlocked.add(stakingTokenInWallet)
                )}
              </>
            </Tooltip>
          )}
          {stakingTokenUnlocked && stakingTokenInWallet && (
            <Tooltip
              label={
                rewardProgramExpired ? 'This reward program has ended' : ''
              }
              placement='top'
            >
              <span>
                <Button
                  bg='white'
                  color='purple.200'
                  borderColor='purple.200'
                  borderWidth='2px'
                  size='md'
                  _hover={{
                    bg: 'purple.200',
                    color: 'white',
                    _disabled: {
                      bg: 'white',
                      color: 'purple.200',
                    },
                  }}
                  disabled={
                    blockTimestampLoading ||
                    rewardProgramExpired ||
                    stakingTokenUnlocked.add(stakingTokenInWallet).lte(0) ||
                    subscriptionsLoading
                  }
                  onClick={() =>
                    openModal(ModalType.addSubscription, {
                      crucible,
                      stakingToken: stakingToken as ProgramToken,
                      stakingTokenCrucibleBalance: stakingTokenUnlocked,
                      stakingTokenWalletBalance: stakingTokenInWallet,
                      currentRewardProgram: currentRewardProgram,
                    })
                  }
                >
                  Subscribe
                </Button>
              </span>
            </Tooltip>
          )}
        </Box>
        <Box>
          {stakingToken && stakingTokenLocked && stakingTokenInWallet && (
            <Tooltip
              label='This is the total of all subscriptions within this program'
              placement='top'
            >
              <>
                <Text fontWeight='semibold' mb={2}>
                  Subscribed token balance
                </Text>
                {renderBalanceBadge(
                  stakingToken.tokenSymbol,
                  stakingTokenLocked
                )}
              </>
            </Tooltip>
          )}
          <Button
            bg='white'
            color='purple.200'
            borderColor='purple.200'
            borderWidth='2px'
            size='md'
            _hover={{
              bg: 'purple.200',
              color: 'white',
              _disabled: {
                bg: 'white',
                color: 'purple.200',
              },
            }}
            disabled={stakingTokenLocked?.lte(0) || subscriptionsLoading}
            onClick={() =>
              openModal(ModalType.claimRewards, {
                crucibleId: crucible.id,
                subscriptionIdx: 0,
              })
            }
          >
            Unsubscribe
          </Button>
        </Box>
      </SimpleGrid>
    </Box>
  );
};

export default RewardProgramActions;
