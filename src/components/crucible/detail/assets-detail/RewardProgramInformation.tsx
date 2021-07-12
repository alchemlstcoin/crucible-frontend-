import dayjs from 'dayjs';
import {
  Box,
  Flex,
  Grid,
  GridItem,
  Spinner,
  Text,
  Tooltip,
} from '@chakra-ui/react';
import { useRewardPrograms } from 'store/rewardPrograms';
import { useEffect, useMemo, useState } from 'react';
import { useBlocktime } from 'hooks/useBlocktime';
import { useRewardProgramTokens } from 'store/rewardProgramTokens';
import { useRewardScaling } from 'hooks/useRewardScaling';

const boxProps = {
  borderWidth: 1,
  borderColor: 'gray.50',
  borderRadius: 'xl',
  boxShadow: 'sm',
  py: 2,
};

const RewardProgramInformation: React.FC = () => {
  const [apy, setApy] = useState('-');
  const [apyLoading, setApyLoading] = useState(false);
  const { blockTimestamp, blockTimestampLoading } = useBlocktime();
  const { currentRewardProgram } = useRewardPrograms();
  const { rewardProgramData } = useRewardProgramTokens();
  const { rewardScalingTime } = useRewardScaling(rewardProgramData);

  useEffect(() => {
    if (currentRewardProgram.apyFeed) {
      getApy();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentRewardProgram.apyFeed]);

  const getApy = async () => {
    setApyLoading(true);
    try {
      const response = await fetch(currentRewardProgram.apyFeed!);
      const data = await response.json();
      const apy = data / 100000;
      setApy(apy.toString());
    } catch (err) {
      setApy('-');
    } finally {
      setApyLoading(false);
    }
  };

  const daysLeft = useMemo(() => {
    return dayjs
      .unix(currentRewardProgram.expiryTimestamp as number)
      .isBefore(dayjs.unix(blockTimestamp))
      ? 'Ended'
      : dayjs
          .unix(currentRewardProgram.expiryTimestamp as number)
          .diff(dayjs.unix(blockTimestamp), 'days') + ' days left';
  }, [currentRewardProgram.expiryTimestamp, blockTimestamp]);

  const rewardMultiplier =
    rewardProgramData?.rewardScaling?.ceiling
      ?.div(rewardProgramData?.rewardScaling?.floor)
      ?.toNumber() || 1;

  return (
    <Grid templateColumns='repeat(4, 1fr)' gap={2} mb={5}>
      {currentRewardProgram.apyFeed && (
        <GridItem {...boxProps} colSpan={[2, 1]}>
          <Tooltip
            label='This is an estimate based on the pool activity, reward rate and token value. This value may fluctuate and is only to be used as a guide.'
            placement='top'
          >
            <span>
              <Text fontSize='sm'>APY</Text>
              <Text fontWeight='bold'>
                {apyLoading ? <Spinner size='sm' /> : `${apy} %`}
              </Text>
            </span>
          </Tooltip>
        </GridItem>
      )}
      {rewardMultiplier > 1 && (
        <GridItem {...boxProps} colSpan={[4, 2]} rowStart={[2, 'auto']}>
          <Tooltip
            label='This is the duration required to reach the maximum reward multiplier specified.'
            placement='top'
          >
            <Flex spacing={2}>
              <Box flex={1}>
                <Text fontSize='sm'>Max Multiplier</Text>
                <Text fontWeight='bold'>{rewardMultiplier}x</Text>
              </Box>
              <Box flex={1}>
                <Text fontSize='sm'>Over</Text>
                <Text fontWeight='bold'>{rewardScalingTime} days</Text>
              </Box>
            </Flex>
          </Tooltip>
        </GridItem>
      )}
      {currentRewardProgram.expiryTimestamp && (
        <GridItem {...boxProps} colSpan={[2, 1]}>
          <Tooltip
            label='This is the countdown to the end of the reward program'
            placement='top'
          >
            <span>
              <Text fontSize='sm'>Duration</Text>
              <Text fontWeight='bold'>
                {blockTimestampLoading ? <Spinner size='sm' /> : daysLeft}
              </Text>
            </span>
          </Tooltip>
        </GridItem>
      )}
    </Grid>
  );
};

export default RewardProgramInformation;
