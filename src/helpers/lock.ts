import IUniswapV2ERC20 from '@uniswap/v2-core/build/IUniswapV2ERC20.json';
import { BigNumber, ethers, Signer } from 'ethers';
import { formatTokenSymbol } from './formatTokenSymbol';
import { RewardProgram } from 'store/rewardPrograms';
import { CrucibleLock, LockData } from 'types';
import { crucibleAbi } from 'abi/crucibleAbi';

export const getCrucibleLocks = async (
  crucibleAddress: string,
  chainId: number,
  signer: Signer,
  rewardPrograms: RewardProgram[],
  currentRewardProgram: RewardProgram,
  daiAddress: string
) => {
  try {
    const crucibleContract = new ethers.Contract(
      crucibleAddress,
      crucibleAbi,
      signer
    );

    const lockSetCount: BigNumber = await crucibleContract.getLockSetCount();

    const locks: CrucibleLock[] | undefined = (await Promise.all(
      Array.from(Array(lockSetCount.toNumber()).keys()).map(async (_, idx) => {
        const lockData: LockData = await crucibleContract.getLockAt(idx);

        if (rewardPrograms.find((p) => p.address === lockData.delegate)) {
          const tokenContract = new ethers.Contract(
            lockData.token,
            IUniswapV2ERC20.abi,
            signer
          );

          const currTokenSymbol = await tokenContract.symbol();

          const tokenSymbol = await formatTokenSymbol(
            lockData.token,
            currTokenSymbol,
            signer
          );

          const rewardContract = new ethers.Contract(
            lockData.delegate,
            currentRewardProgram.abi,
            signer
          );

          const vaultData = await rewardContract.getVaultData(crucibleAddress);

          return {
            crucibleAddress,
            rewardProgramAddress: lockData.delegate,
            subscribedToken: {
              value: { amount: lockData.balance },
              address: lockData.token,
              symbol: tokenSymbol,
            },
            subscriptionCount: vaultData.stakes.length,
          };
        }
      })
    )) as CrucibleLock[];

    const filteredLocks = locks.filter((lock) => !!lock);

    return filteredLocks;
  } catch (err) {
    throw err;
  }
};
