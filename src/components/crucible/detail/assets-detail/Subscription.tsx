import formatNumber from 'utils/formatNumber';
import { LPToken, StakingPosition } from 'types';
import { ModalType } from 'components/modals/types';
import { Crucible } from 'store/crucibles';
import { BigNumber } from 'ethers';
import { useModal } from 'store/modals';
import { AiFillInfoCircle, FaLock } from 'react-icons/all';
import {
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Box,
  Button,
  Flex,
  Grid,
  GridItem,
  SimpleGrid,
  Skeleton,
  Spinner,
  Tag,
  TagLabel,
  TagLeftIcon,
  Text,
  Tooltip,
  useMediaQuery,
} from '@chakra-ui/react';
import React, { useMemo } from 'react';
import { LightMode } from '@chakra-ui/color-mode';
import { useRewardProgramTokens } from 'store/rewardProgramTokens';
import { useSubscriptions } from 'store/subscriptions';
import { useRewardScaling } from 'hooks/useRewardScaling';

type Props = {
  crucible: Crucible;
  subscription: StakingPosition;
};

const BottomProgressBar: React.FC<{ completionPercent: string }> = ({
  completionPercent,
}) => {
  return (
    <Tooltip label={completionPercent}>
      <Box position='relative' mb='4px'>
        <Box
          position='absolute'
          bg='purple.50'
          w='100%'
          h='5px'
          borderRadius='0 0 8px 8px'
        />
        <Box
          position='absolute'
          bg='purple.300'
          w={completionPercent}
          h='5px'
          borderRadius={
            completionPercent === '100%' ? '0 0 8px 8px' : '0 0 0 8px'
          }
        />
      </Box>
    </Tooltip>
  );
};

const TokenRewardStatBox: React.FC<{
  tokenSymbol: string;
  tokenAmount: BigNumber;
  usdValue?: number;
}> = ({ tokenSymbol, tokenAmount, usdValue }) => {
  return (
    <Flex
      border='1px solid'
      borderColor='gray.100'
      borderRadius='xl'
      justifyContent='space-between'
    >
      <Text
        padding='8px'
        minW='70px'
        maxW='100px'
        width='100%'
        fontSize='sm'
        align='center'
      >
        {tokenSymbol}
      </Text>
      <Tooltip
        label={
          <>
            <Text>
              {formatNumber.tokenFull(tokenAmount)} {tokenSymbol}
            </Text>
            <Text>Value ${usdValue ? usdValue.toFixed(2) : '-'}</Text>
          </>
        }
        fontSize='md'
        placement='top'
      >
        <Box
          border='1px solid'
          borderColor='gray.100'
          mt='-1px'
          mb='-1px'
          mr='-1px'
          bg='gray.50'
          borderRadius='xl'
          py='8px'
          px='4px'
          overflow='auto'
          minW='65px'
        >
          <Text isTruncated fontSize='sm'>
            {formatNumber.token(tokenAmount)}
          </Text>
        </Box>
      </Tooltip>
    </Flex>
  );
};

const Subscription: React.FC<Props> = ({ crucible, subscription }) => {
  const { stakingToken, rewardProgramData } = useRewardProgramTokens();

  const { subscriptions, subscriptionsLoading, usdLoading } =
    useSubscriptions();

  const { rewardScalingTimestamp, rewardScalingTime } =
    useRewardScaling(rewardProgramData);

  // prettier-ignore
  const [isLargerThan510]       = useMediaQuery('(min-width: 511px)');
  // prettier-ignore
  const { openModal }           = useModal();
  // prettier-ignore
  const secondsInDay            = 60 * 60 * 24;
  // prettier-ignore
  const rewardTokenValueUSD     = subscription?.rewards?.rewardToken?.value?.amountUSD || 0;
  // prettier-ignore
  const stakingTokenValueUSD    = subscription.stakingToken.value?.amountUSD || 0;

  const bonusTokenValueUSDSum =
    subscription.rewards.bonusTokens.reduce((totalVal, bonusToken) => {
      // @ts-ignore
      totalVal += bonusToken.value.amountUSD || 0;
      return totalVal;
    }, 0) || 0;
  // prettier-ignore
  const totalRewardValueUSD     = rewardTokenValueUSD + bonusTokenValueUSDSum;
  // prettier-ignore
  const totalValueUSD           = totalRewardValueUSD + stakingTokenValueUSD;
  // prettier-ignore
  const stakingTokenPair0       = (subscription.stakingToken as LPToken)?.token0Data;
  // prettier-ignore
  const stakingTokenPair1       = (subscription.stakingToken as LPToken)?.token1Data;
  // prettier-ignore
  const isSubscriptionComplete  = Math.min(subscription.timeElapsed / rewardScalingTimestamp, 1) === 1;
  // prettier-ignore
  const daysRemainingCopy       = `${Math.min(Math.floor(subscription.timeElapsed / secondsInDay), rewardScalingTime)} of ${rewardScalingTime} days`;

  const lpValue = useMemo(() => {
    if (
      stakingTokenPair0 &&
      Object.keys(stakingTokenPair0).length > 0 &&
      stakingTokenPair1 &&
      Object.keys(stakingTokenPair1).length > 0
    ) {
      const pair0Usd = stakingTokenPair0.value.amountUSD
        ? formatNumber.token(stakingTokenPair0.value.amountUSD)
        : '-';

      const pair1Usd = stakingTokenPair1.value.amountUSD
        ? formatNumber.token(stakingTokenPair1.value.amountUSD)
        : '-';

      return (
        <LightMode>
          <Skeleton isLoaded={!usdLoading}>
            <Text pt='5px'>
              <strong>LP Value</strong>
            </Text>
            <Text>
              {pair0Usd} {stakingTokenPair0.symbol} - {pair1Usd}{' '}
              {stakingTokenPair1.symbol}
            </Text>
          </Skeleton>
        </LightMode>
      );
    }
    return null;
  }, [usdLoading, stakingTokenPair0, stakingTokenPair1]);

  return (
    <AccordionItem
      borderWidth={1}
      borderColor='gray.100'
      backgroundColor='white'
      borderRadius='lg'
      mb={3}
    >
      <div>
        <h2>
          <AccordionButton
            position='relative'
            display='block'
            bg={isSubscriptionComplete ? '#F7EEFF' : undefined}
            borderRadius='8px 8px 0 0'
          >
            <AccordionIcon position='absolute' top='5px' right='5px' />
            <Grid templateColumns='repeat(24, 1fr)' gap={3} py={2}>
              <GridItem colSpan={[12, null, 9]} justifySelf='left'>
                <Tooltip
                  label={
                    usdLoading ? (
                      <Spinner size='sm' />
                    ) : (
                      <>
                        <Text>
                          {formatNumber.tokenFull(
                            subscription.stakingToken.value.amount
                          ) +
                            ' ' +
                            stakingToken?.tokenSymbol}
                        </Text>
                        <Text>
                          USD Value ${stakingTokenValueUSD?.toFixed(2)}
                        </Text>
                        {lpValue}
                      </>
                    )
                  }
                  placement='bottom'
                >
                  <Tag
                    maxWidth='140px'
                    height='28px'
                    size='lg'
                    backgroundColor='grey.200'
                    color='black'
                    borderRadius='full'
                    isTruncated
                  >
                    <TagLeftIcon boxSize='10px' as={FaLock} />
                    <TagLabel fontSize='xs'>
                      {formatNumber.token(
                        subscription.stakingToken.value.amount
                      )}{' '}
                      <strong>{stakingToken?.tokenSymbol}</strong>
                    </TagLabel>
                  </Tag>
                </Tooltip>
              </GridItem>

              <GridItem colSpan={[12, null, 5]}>
                <Box fontSize='sm' isTruncated>
                  <Text color='gray.500' textAlign='left'>
                    Started
                  </Text>
                  <Text textAlign='left'>
                    {formatNumber.date(subscription.subscriptionDate * 1000)}
                  </Text>
                </Box>
              </GridItem>

              <GridItem colSpan={[12, null, 5]}>
                <Box fontSize='sm' isTruncated>
                  <Box color='gray.500' display='flex' alignItems='center'>
                    <span style={{ marginRight: 5 }}>Value</span>
                    <Tooltip label='This is the combined value of your subscribed token and your rewards'>
                      <span>
                        <AiFillInfoCircle />
                      </span>
                    </Tooltip>
                  </Box>
                  <LightMode>
                    <Skeleton isLoaded={!usdLoading}>
                      <Text textAlign='left'>${totalValueUSD.toFixed(2)}</Text>
                    </Skeleton>
                  </LightMode>
                </Box>
              </GridItem>

              <GridItem colSpan={[12, null, 5]}>
                <Box fontSize='sm' isTruncated>
                  <Box color='gray.500' display='flex' alignItems='center'>
                    <span style={{ marginRight: 5 }}>Rewards</span>
                    <Tooltip label='The rewards here are calculated by your current share of the reward pool at this exact moment. This value can fluctuate depending on the pool activity or token value'>
                      <span>
                        <AiFillInfoCircle />
                      </span>
                    </Tooltip>
                  </Box>
                  <LightMode>
                    <Skeleton isLoaded={!usdLoading}>
                      <Text textAlign='left'>
                        ${totalRewardValueUSD.toFixed(2)}
                      </Text>
                    </Skeleton>
                  </LightMode>
                </Box>
              </GridItem>
            </Grid>
          </AccordionButton>
        </h2>
        <AccordionPanel pb={4}>
          <SimpleGrid columns={[1, 2, 3]} gap={4}>
            {subscription?.rewards?.rewardToken && (
              <TokenRewardStatBox
                tokenAmount={subscription.rewards.rewardToken.value.amount}
                tokenSymbol={subscription.rewards.rewardToken.symbol}
                usdValue={subscription.rewards.rewardToken.value.amountUSD}
              />
            )}
            {subscription?.rewards?.bonusTokens.length > 0 &&
              subscription?.rewards?.bonusTokens.map((bonusToken) => (
                <TokenRewardStatBox
                  key={bonusToken.address}
                  tokenAmount={bonusToken.value.amount}
                  tokenSymbol={bonusToken.symbol}
                  usdValue={bonusToken.value.amountUSD}
                />
              ))}
          </SimpleGrid>

          <Flex justifyContent='space-between' flexWrap='wrap' mt={6}>
            {!isLargerThan510 && (
              <Tooltip label='This is your current progress for the reward multiplier scaling period'>
                <Text color='gray.500' lineHeight='40px'>
                  {daysRemainingCopy}
                </Text>
              </Tooltip>
            )}

            <Button
              size='sm'
              isFullWidth={!isLargerThan510}
              onClick={() => {
                openModal(ModalType.claimRewards, {
                  crucibleId: crucible.id,
                  subscriptionIdx: subscriptions.findIndex(
                    (s) => s.subscriptionDate === subscription.subscriptionDate
                  ),
                });
              }}
              disabled={subscriptionsLoading}
            >
              Claim & Unsubscribe
            </Button>
            {isLargerThan510 && (
              <Tooltip label='This is your current progress for the reward multiplier scaling period'>
                <Text color='gray.500' lineHeight='40px'>
                  {daysRemainingCopy}
                </Text>
              </Tooltip>
            )}
          </Flex>
        </AccordionPanel>
        <BottomProgressBar
          completionPercent={formatNumber.percent(
            Math.min(subscription.timeElapsed / rewardScalingTimestamp, 1)
          )}
        />
      </div>
    </AccordionItem>
  );
};

export default Subscription;
