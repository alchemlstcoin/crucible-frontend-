import { FC, useCallback, useEffect, useMemo, useState, useRef } from 'react';
import { BigNumber } from 'ethers';
import {
  Alert,
  Button,
  Circle,
  Flex,
  HStack,
  Text,
  Tooltip,
  Spinner,
} from '@chakra-ui/react';
import {
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
} from '@chakra-ui/modal';
import { Box } from '@chakra-ui/layout';
import formatNumber from 'utils/formatNumber';
import bigNumberishToNumber from 'utils/bigNumberishToNumber';
import { useModal } from 'store/modals';
import { useTransactions } from 'store/transactions/useTransactions';
import { TxnStatus, TxnType } from 'store/transactions/types';
import { useRewardPrograms } from 'store/rewardPrograms';
import { STATUS } from 'types';
import { useSubscriptions } from 'store/subscriptions';
import { useRewardProgramTokens } from 'store/rewardProgramTokens';
import { formatEther, formatUnits, parseUnits } from 'ethers/lib/utils';
import { FiInfo } from 'react-icons/fi';
import { StakingPosition } from '../../types';
import { useStakingTokenBalance } from '../../hooks/useStakingTokenBalance';
import CustomInput from 'components/shared/customInput';
import { sanitize } from 'utils/sanitize';

type Props = {
  crucibleId: string;
  subscriptionIdx: number;
};

interface SubscriptionWithAccumulatedBal extends StakingPosition {
  accumulatedBalance: BigNumber;
}

const ClaimRewardsModal: FC<Props> = ({ crucibleId, subscriptionIdx }) => {
  const { closeModal } = useModal();
  const [unsubscribeAmount, setUnsubscribeAmount] = useState('');
  const unsubscribeAmountBN = parseUnits(sanitize(unsubscribeAmount), 18);
  const { claimRewards, transactions } = useTransactions();
  const { status } = useRewardProgramTokens();
  const { subscriptions, subscriptionsLoading } = useSubscriptions();
  const { currentRewardProgram: rewardProgram } = useRewardPrograms();

  const programTokensLoading = useMemo(
    () => status === STATUS.IDLE || status === STATUS.PENDING,
    [status]
  );
  const focusRef = useRef<HTMLInputElement>(null);

  // in order to build the "DJ ui" with progress bar for each subscription we need add an accumulated balance for each subscription.
  // subscriptions have to be unsubscribed in FILO order, so we reverse the array before accumulating
  const subscriptionsWithAccumulatedBalances: SubscriptionWithAccumulatedBal[] =
    useMemo(() => {
      if (subscriptions && subscriptions.length > 0) {
        let accumulatedBalance = BigNumber.from(0);
        return [...subscriptions]
          .reverse()
          .map((subscription) => {
            // attach the accumulated balance, so each subscription has a record of it's own balance + all previous balances
            const newThing = {
              ...subscription,
              accumulatedBalance,
            };

            accumulatedBalance = accumulatedBalance.add(
              subscription?.stakingToken.value.amount
            );

            return newThing;
          })
          .reverse();
      }
      return [];
    }, [subscriptions]);

  const subscription = useMemo(() => {
    return subscriptionsWithAccumulatedBalances[subscriptionIdx] || {};
  }, [subscriptionsWithAccumulatedBalances, subscriptionIdx]);

  // StakingTokenLocked relates to the total LP locked in the reward program (sum of all locks)
  // TODO: We should pass in the stakingTokenLocked
  const { stakingTokenLocked = BigNumber.from(0) } = useStakingTokenBalance(
    subscription?.stakingToken?.address,
    crucibleId,
    rewardProgram?.address,
    subscriptionsLoading
  );

  const isMax = useMemo(() => {
    if (unsubscribeAmount && stakingTokenLocked) {
      return parseUnits(sanitize(unsubscribeAmount), 18).eq(stakingTokenLocked);
    }
    return false;
  }, [unsubscribeAmount, stakingTokenLocked]);

  const isUnstakeTxnPending =
    transactions.filter((txn) => {
      return (
        txn.type === TxnType.unsubscribe &&
        txn.status === TxnStatus.PendingOnChain
      );
    }).length > 0;

  useEffect(() => {
    // initialize the input value as the value of the intended subscription to unsubscribe
    setUnsubscribeAmount(
      formatUnits(
        subscription.accumulatedBalance.add(
          subscription.stakingToken.value.amount
        ),
        // TODO: pull this number in from the subscription.stakingToken.decimal not hardcode to 18dp
        18
      )
    );

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [subscription]);

  // subscription "boundaries" are used to prevent a bug when the user tries to unsubscribe exact values:
  // if user is unsubscribing AT a boundry level, we add 1 WEI to prevent a contract error
  // note that we cannot add this 1 wei adjustment if it's a max unsuubscription because they wont have enough

  // the boundary array is an array of accumulated rewards for each subscription
  // if you have 3 subs:
  // [10,12,8]
  // boundaries example:
  // [10,22,30]
  const subscriptionBoundaries: BigNumber[] = useMemo(() => {
    return subscriptionsWithAccumulatedBalances.map(
      ({ accumulatedBalance }) => accumulatedBalance
    );
  }, [subscriptionsWithAccumulatedBalances]);

  const handleUnstakeAndClaim = async () => {
    const adjust = (value: BigNumber) => {
      if (
        subscriptionBoundaries.some((boundary) =>
          boundary.eq(unsubscribeAmountBN)
        )
      ) {
        return value.add(parseUnits('1', 'wei'));
      }
      return value;
    };

    claimRewards(
      isMax ? stakingTokenLocked : adjust(unsubscribeAmountBN),
      crucibleId,
      rewardProgram
    );
    closeModal();
    window.scrollTo(0, 0);
  };

  const getProgressValue = useCallback(
    (subscription: SubscriptionWithAccumulatedBal): number => {
      const diff = unsubscribeAmountBN.sub(subscription.accumulatedBalance);
      const progress =
        bigNumberishToNumber(diff) /
        bigNumberishToNumber(subscription?.stakingToken.value.amount);

      return Math.max(0, Math.min(progress, 1));
    },
    [unsubscribeAmountBN]
  );

  const rewardsLabel = (subscription: SubscriptionWithAccumulatedBal) => {
    return (
      <Box>
        <Text>Total rewards</Text>
        <Text>
          {formatNumber.tokenFull(
            subscription.rewards.rewardToken.value.amount
          )}{' '}
          {subscription.rewards.rewardToken.symbol}
        </Text>
        {subscription.rewards.bonusTokens.map((bonusToken) => (
          <Text key={bonusToken.address}>
            {formatNumber.tokenFull(bonusToken.value.amount)}{' '}
            {bonusToken.symbol}
          </Text>
        ))}
      </Box>
    );
  };

  return (
    <Modal
      isOpen={true}
      onClose={() => closeModal()}
      initialFocusRef={focusRef}
    >
      <ModalOverlay />
      <ModalContent borderRadius='xl'>
        <ModalHeader>
          Claim {rewardProgram.name} rewards and unsubscribe
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          {programTokensLoading || subscriptionsLoading ? (
            <Flex justifyContent='center' mt={5}>
              <Spinner />
            </Flex>
          ) : (
            <Box>
              <Box mb={2} color='gray.100'>
                <Text mb={4}>
                  You are unsubscribing {subscription?.stakingToken?.symbol}{' '}
                  tokens from the {rewardProgram.name}. This will reset your
                  multiplier for the portion you are unsubscribing.
                </Text>
                <Text fontWeight='bold' mb={6}>
                  We recommend using Metamask for this process.
                </Text>
                <Alert borderRadius='xl' mb={6}>
                  Subscriptions are stacked in a last in first out order. You
                  can select any of the subscriptions below by clicking on it.
                </Alert>
              </Box>
              <Box mb={4}>
                {subscriptionsWithAccumulatedBalances.map(
                  (subscription, idx) => (
                    <Box mb={2} key={idx}>
                      <Flex
                        justifyContent='space-between'
                        _hover={{ cursor: 'pointer' }}
                        onClick={() =>
                          setUnsubscribeAmount(
                            formatUnits(
                              subscription.accumulatedBalance.add(
                                subscription?.stakingToken?.value?.amount
                              )
                            )
                          )
                        }
                        py='5px'
                      >
                        <HStack>
                          <Circle
                            bg={
                              unsubscribeAmountBN.lte(
                                subscription.accumulatedBalance
                              )
                                ? 'gray.500'
                                : 'purple.200'
                            }
                            _hover={{ cursor: 'pointer' }}
                            color='white'
                            size='20px'
                          >
                            {idx + 1}
                          </Circle>
                          <Text>
                            {formatNumber.token(
                              subscription?.stakingToken?.value?.amount
                            )}{' '}
                            {subscription?.stakingToken?.symbol}
                          </Text>
                        </HStack>
                        <HStack>
                          <Text>
                            {formatNumber.date(
                              subscription.subscriptionDate * 1000
                            )}
                          </Text>
                          <Tooltip
                            label={rewardsLabel(subscription)}
                            fontSize='md'
                            placement='bottom-end'
                            hasArrow
                          >
                            <span>
                              <FiInfo />
                            </span>
                          </Tooltip>
                        </HStack>
                      </Flex>
                      <Box width='100%' height='4px' bg='gray.600'>
                        <Box
                          width={
                            isMax
                              ? '100'
                              : formatNumber.percent(
                                  getProgressValue(subscription)
                                )
                          }
                          bg='purple.200'
                          height='100%'
                        />
                      </Box>
                    </Box>
                  )
                )}
              </Box>
            </Box>
          )}
          <Flex
            mb={2}
            mt={8}
            justifyContent='space-between'
            alignItems='center'
            color='gray.100'
          >
            <Text>Select amount</Text>
            <Text>
              Balance:{' '}
              <strong>
                {formatNumber.token(stakingTokenLocked as BigNumber)}{' '}
                {subscription.stakingToken.symbol}
              </strong>
            </Text>
          </Flex>
          <CustomInput
            inputRef={focusRef}
            max={formatEther(stakingTokenLocked)}
            value={unsubscribeAmount}
            onUserInput={(input) => setUnsubscribeAmount(input)}
            showMaxButton
            showRadioGroup
          />
        </ModalBody>
        <ModalFooter>
          <Button
            variant='cyanbutton'
            isFullWidth
            isLoading={isUnstakeTxnPending}
            onClick={handleUnstakeAndClaim}
            isDisabled={
              parseUnits(sanitize(unsubscribeAmount), 18).lte(0) ||
              parseUnits(sanitize(unsubscribeAmount), 18).gt(stakingTokenLocked)
            }
          >
            Claim rewards and unsubscribe
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default ClaimRewardsModal;
