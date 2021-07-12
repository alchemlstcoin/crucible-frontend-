import { useWeb3React } from '@web3-react/core';
import { BigNumber, ethers } from 'ethers';
import { useEffect, useState } from 'react';
import { crucibleAbi } from 'abi/crucibleAbi';
import { useCrucibles } from 'store/crucibles';
import IUniswapV2ERC20 from '@uniswap/v2-core/build/IUniswapV2ERC20.json';

export function useStakingTokenBalance(
  stakingToken: string,
  crucibleAddress: string,
  currentRewardProgramAddress: string,
  subscriptionsLoading: boolean
) {
  const { library, account } = useWeb3React();
  const { cruciblesLoading } = useCrucibles();
  const [stakingTokenUnlocked, setStakingTokenUnlocked] = useState<BigNumber>(
    BigNumber.from(0)
  );
  const [stakingTokenLocked, setStakingTokenLocked] = useState<BigNumber>(
    BigNumber.from(0)
  );
  const [stakingTokenInWallet, setStakingTokenInWallet] = useState<BigNumber>(
    BigNumber.from(0)
  );
  const [stakingTokenDecimals, setStakingTokenDecimals] = useState(18);

  const signer = library.getSigner();

  const getBalance = async () => {
    try {
      const tokenContract = new ethers.Contract(
        stakingToken,
        IUniswapV2ERC20.abi,
        signer
      );
      const crucibleContract = new ethers.Contract(
        crucibleAddress,
        crucibleAbi,
        signer
      );

      const balance = await tokenContract.balanceOf(crucibleAddress);
      const balanceLocked = await crucibleContract.getBalanceDelegated(
        stakingToken,
        currentRewardProgramAddress
      );
      const balanceUnlocked = balance.sub(balanceLocked);

      // User wallet balances
      const balanceInWallet = await tokenContract.balanceOf(account);

      const tokenDecimals = await tokenContract.decimals();

      setStakingTokenUnlocked(balanceUnlocked);
      setStakingTokenLocked(balanceLocked);
      setStakingTokenInWallet(balanceInWallet);
      setStakingTokenDecimals(tokenDecimals);
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    if (stakingToken && !cruciblesLoading && !subscriptionsLoading) {
      getBalance();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    stakingToken,
    currentRewardProgramAddress,
    cruciblesLoading,
    subscriptionsLoading,
  ]);

  return {
    stakingTokenUnlocked,
    stakingTokenLocked,
    stakingTokenInWallet,
    stakingTokenDecimals,
  };
}
