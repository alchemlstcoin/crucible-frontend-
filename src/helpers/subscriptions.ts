import { BigNumber, ethers, Signer } from 'ethers';
import IUniswapV2ERC20 from '@uniswap/v2-core/build/IUniswapV2ERC20.json';
import {
  ERC20Token,
  RewardProgramData,
  RewardProgramVaultData,
  StakingPosition,
} from 'types';
import { RewardProgram } from 'store/rewardPrograms';
import { ProgramToken } from 'components/crucible/detail/assets-detail/Rewards';

export const getCrucibleSubscriptions = async (
  crucibleId: string,
  chainId: number,
  signer: Signer,
  rewardProgram: RewardProgram,
  rewardProgramData: RewardProgramData,
  rewardToken: ProgramToken,
  stakingToken: ProgramToken,
  bonusTokens: ProgramToken[]
) => {
  try {
    const provider = signer.provider;
    // load the block info
    const blockNumber = await provider?.getBlockNumber();
    const block = await provider?.getBlock(blockNumber as number);
    const blockTimestamp = block?.timestamp;

    // create the contract instances for fetching subscription data
    const rewardProgramContract = new ethers.Contract(
      rewardProgram.address,
      rewardProgram.abi,
      signer
    );

    const rewardTokenContract = new ethers.Contract(
      // @ts-ignore
      rewardToken.address,
      IUniswapV2ERC20.abi,
      signer
    );

    // Get "vault data" from the reward program contract
    const vaultData: RewardProgramVaultData =
      await rewardProgramContract.getVaultData(crucibleId);

    // Get unlocked rewards
    const unlockedRewards =
      await rewardProgramContract.getCurrentUnlockedRewards();

    const totalStakeUnits =
      await rewardProgramContract.getCurrentTotalStakeUnits();

    // convert the tuple-based interface of the vault data into an object based interface with additional info about tokens & rewards
    // @ts-ignore
    const subscriptions: StakingPosition[] = await Promise.all(
      vaultData[1].map(async (data) => {
        // deconstruct the tuple from the reward program smart contract
        const [stakedAmount, timestamp] = data;

        // calculate time elapsed using the current block timestamp
        const timeElapsed = blockTimestamp! - timestamp.toNumber();

        // fetch the value of the rewardToken's reward from the rewardProgramContract
        const rewardTokenRewardValue: BigNumber =
          await rewardProgramContract.calculateReward(
            unlockedRewards,
            stakedAmount,
            timeElapsed,
            totalStakeUnits,
            rewardProgramData?.rewardScaling
          );

        // calculate the bonus tokens using a similar process as the reward token
        const bonusTokenRewards: ERC20Token[] = await Promise.all(
          // @ts-ignore
          bonusTokens.map(async (token) => {
            // create a standard contract instance from the bonus token
            const bonusTokenContract = new ethers.Contract(
              token.address,
              IUniswapV2ERC20.abi,
              signer
            );

            // fetch the amount of the bonus token
            const amount = await bonusTokenContract.balanceOf(
              // @ts-ignore
              rewardProgramData.rewardPool
            );

            // determine the reward pool's balance of that specific bonus token
            const balanceInRewardPool = await rewardTokenContract.balanceOf(
              // @ts-ignore
              rewardProgramData.rewardPool
            );

            // compute a weighted calculation using the rewardToken reward that you are due.
            // Balance of Bonus Token In Pool * Your current rewardToken reward / Balance of Reward Token in Pool
            const finalAmount = amount
              .mul(rewardTokenRewardValue)
              .div(balanceInRewardPool);

            // construct the ERC20Token_TEMP interface
            return {
              value: {
                amount: finalAmount,
              },
              address: token.address,
              symbol: token.tokenSymbol,
            };
          })
        );

        return {
          rewardProgramAddress: rewardProgram.address,
          subscriptionDate: timestamp.toNumber(),
          timeElapsed,
          stakingToken: {
            value: {
              amount: stakedAmount,
            },
            address: rewardProgramData?.stakingToken,
            symbol: stakingToken?.tokenSymbol,
          },
          rewards: {
            rewardToken: {
              value: {
                amount: rewardTokenRewardValue,
              },
              address: rewardToken?.address,
              symbol: rewardToken?.tokenSymbol,
            },
            bonusTokens: bonusTokenRewards,
          },
        };
      })
    );

    return subscriptions;
  } catch (error) {
    console.log('error: ', error);
    throw error;
  }
};
