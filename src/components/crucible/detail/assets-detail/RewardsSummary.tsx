import { Stack, Text, Skeleton } from '@chakra-ui/react';
import React, { useMemo } from 'react';
import formatNumber from 'utils/formatNumber';
import { LightMode } from '@chakra-ui/color-mode';
import { useRewardsShare } from 'store/rewardsShare';
import { useSubscriptions } from 'store/subscriptions';
import { STATUS } from 'types';

const RewardsSummary: React.FC<{ crucibleId: string }> = ({ crucibleId }) => {
  const { rewardsShare, status: rewardsShareStatus } =
    useRewardsShare(crucibleId);

  const { subscriptions, usdLoading } = useSubscriptions();

  const totalRewardsUsd: {
    stakingToken: number;
    rewardToken: number;
    bonusTokens: number;
  } = useMemo(() => {
    const defaultUsdValues = {
      stakingToken: 0,
      rewardToken: 0,
      bonusTokens: 0,
    };

    if (usdLoading) {
      return defaultUsdValues;
    } else {
      return subscriptions?.reduce((accumulated, subscription) => {
        const stakingTokenUsdSum =
          accumulated.stakingToken +
          (subscription.stakingToken.value.amountUSD || 0);

        const rewardTokenUsdSum =
          accumulated.rewardToken +
          (subscription.rewards.rewardToken.value.amountUSD || 0);

        const bonusUsdSum =
          subscription.rewards.bonusTokens.reduce((sum, bonusToken) => {
            sum += bonusToken.value.amountUSD || 0;
            return sum;
          }, 0) + accumulated.bonusTokens;

        return {
          stakingToken: stakingTokenUsdSum,
          rewardToken: rewardTokenUsdSum,
          bonusTokens: bonusUsdSum,
        };
      }, defaultUsdValues);
    }
  }, [subscriptions, usdLoading]);

  return (
    <Stack
      p={4}
      mb={4}
      direction={['column', null, 'row']}
      textAlign={['left', 'left', 'center']}
      justifyContent='space-around'
      borderWidth={1}
      borderColor='gray.50'
      boxShadow='sm'
      borderRadius='xl'
    >
      <Text>
        <strong>Total value</strong>{' '}
        <LightMode>
          <Skeleton isLoaded={!usdLoading}>
            {formatNumber.currency(
              totalRewardsUsd.rewardToken +
                totalRewardsUsd.bonusTokens +
                totalRewardsUsd.stakingToken
            )}
          </Skeleton>
        </LightMode>
      </Text>
      <Text>
        <strong>Total rewards value</strong>{' '}
        <LightMode>
          <Skeleton isLoaded={!usdLoading}>
            {formatNumber.currency(
              totalRewardsUsd.rewardToken + totalRewardsUsd.bonusTokens
            )}
          </Skeleton>
        </LightMode>
      </Text>
      <Text>
        <strong>% of reward pool</strong>{' '}
        <LightMode>
          <Skeleton isLoaded={rewardsShareStatus === STATUS.SUCCEEDED}>
            {formatNumber.percentLong(rewardsShare)}
          </Skeleton>
        </LightMode>
      </Text>
    </Stack>
  );
};

export default RewardsSummary;
