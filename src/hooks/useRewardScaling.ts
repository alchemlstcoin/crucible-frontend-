import { useState } from 'react';
import { useEffect } from 'react';
import { RewardProgramData } from 'types';

const secondsInDay = 60 * 60 * 24;

export function useRewardScaling(rewardProgramData?: RewardProgramData) {
  const [rewardScalingTimestamp, setRewardScalingTimestamp] = useState(0);
  const [rewardScalingTime, setRewardScalingTime] = useState(0);

  useEffect(() => {
    if (rewardProgramData) {
      const rewardScalingTimestamp =
        rewardProgramData.rewardScaling.time.toNumber();
      const rewardScalingTime = rewardScalingTimestamp / secondsInDay;
      setRewardScalingTimestamp(rewardScalingTimestamp);
      setRewardScalingTime(rewardScalingTime);
    }
  }, [rewardProgramData]);

  return { rewardScalingTimestamp, rewardScalingTime };
}
