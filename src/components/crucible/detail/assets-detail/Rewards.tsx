import { FC } from 'react';
import { Box } from '@chakra-ui/layout';
import { Accordion, Flex, IconButton, Spinner, Text } from '@chakra-ui/react';
import { useSubscriptions } from 'store/subscriptions';
import { STATUS } from 'types';
import { HiOutlineRefresh } from 'react-icons/hi';
import RewardProgramDropdown from './RewardProgramDropdown';
import RewardProgramInformation from './RewardProgramInformation';
import RewardProgramActions from './RewardProgramActions';
import Subscription from './Subscription';
import RewardsSummary from './RewardsSummary';
import RewardProgramDescription from './RewardProgramDescription';
import { useMemo } from 'react';
import { useRewardProgramTokens } from 'store/rewardProgramTokens';
import { useRewardsShare } from 'store/rewardsShare';
import { useRewardPrograms } from 'store/rewardPrograms';

type Props = {
  crucible: any;
};

export type ProgramToken = {
  address: string;
  tokenSymbol: string;
};

const Rewards: FC<Props> = ({ crucible }) => {
  const { currentRewardProgram } = useRewardPrograms();
  const { status } = useRewardProgramTokens();
  const { getRewardShare } = useRewardsShare(crucible?.id);

  const programTokensLoading = useMemo(
    () => status === STATUS.IDLE || status === STATUS.PENDING,
    [status]
  );

  const {
    subscriptions,
    getSubscriptionsForCrucible,
    subscriptionsLoading,
    usdLoading,
  } = useSubscriptions();

  return (
    <Box
      bg='purple.200'
      color='gray.800'
      borderRadius='xl'
      overflow='hidden'
      display='flex'
      flexDirection='column'
    >
      <RewardProgramDropdown />
      {programTokensLoading || subscriptionsLoading ? (
        <Box p={[4, 8]} borderRadius='xl' bg='white'>
          <Spinner />
        </Box>
      ) : (
        <Box p={[4, 8]} borderRadius='xl' bg='white'>
          <RewardProgramInformation />
          <RewardProgramActions crucible={crucible} />
          {subscriptions && subscriptions.length > 0 ? (
            <>
              <Box my={4}>
                <Flex alignItems='center'>
                  <Text flexGrow={1} color='gray.300'>
                    Subscriptions
                  </Text>
                  <IconButton
                    variant='link'
                    fontSize='xl'
                    colorScheme='purple'
                    icon={<HiOutlineRefresh />}
                    aria-label='refresh'
                    onClick={() => {
                      getSubscriptionsForCrucible(
                        crucible.id,
                        currentRewardProgram
                      );
                      getRewardShare(crucible.id);
                    }}
                    disabled={subscriptionsLoading || usdLoading}
                  />
                </Flex>
              </Box>
              <RewardsSummary crucibleId={crucible?.id} />
              <Accordion allowMultiple>
                {subscriptions.map((subscription, idx) => (
                  <Subscription
                    key={idx}
                    crucible={crucible}
                    subscription={subscription}
                  />
                ))}
              </Accordion>
            </>
          ) : (
            <RewardProgramDescription />
          )}
        </Box>
      )}
    </Box>
  );
};

export default Rewards;
