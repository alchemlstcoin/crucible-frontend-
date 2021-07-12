import { ChainId, Token } from '@uniswap/sdk';
import { BigNumber, ethers, Signer } from 'ethers';
import bigNumberishToNumber from 'utils/bigNumberishToNumber';
import IUniswapV2ERC20 from '@uniswap/v2-core/build/IUniswapV2ERC20.json';
import IUniswapV2Pair from '@uniswap/v2-core/build/IUniswapV2Pair.json';
import { ERC20Token } from 'types';

const getLpTokenBreakdown = async (
  tokenAddress: string,
  tokenBalance: BigNumber,
  chainId: ChainId,
  signer: Signer
): Promise<{
  token0Data?: ERC20Token;
  token1Data?: ERC20Token;
}> => {
  const tokenContract = new ethers.Contract(
    tokenAddress,
    IUniswapV2ERC20.abi,
    signer
  );
  const tokenSymbol = await tokenContract.symbol();
  const isLp = tokenSymbol === 'UNI-V2';

  if (isLp) {
    try {
      const lpContract = new ethers.Contract(
        tokenAddress,
        IUniswapV2Pair.abi,
        signer
      );

      const token0Address = await lpContract.token0();
      const token1Address = await lpContract.token1();

      const token0Contract = new ethers.Contract(
        token0Address,
        IUniswapV2ERC20.abi,
        signer
      );

      const token1Contract = new ethers.Contract(
        token1Address,
        IUniswapV2ERC20.abi,
        signer
      );

      const token0Symbol = await token0Contract.symbol();
      const token1Symbol = await token1Contract.symbol();

      const token0Decimals = await token0Contract.decimals();
      const token1Decimals = await token1Contract.decimals();

      const pairReserves = await lpContract.getReserves();

      const pairTotalSupply = await lpContract.totalSupply();

      const token0 = new Token(chainId, token0Address, token0Decimals);
      const token1 = new Token(chainId, token1Address, token1Decimals);

      const token0Value =
        (Number(pairReserves[0]) / Number(pairTotalSupply)) *
        bigNumberishToNumber(tokenBalance);
      const token1Value =
        (Number(pairReserves[1]) / Number(pairTotalSupply)) *
        bigNumberishToNumber(tokenBalance);

      const token0Data: ERC20Token = {
        value: { amount: pairReserves[0], amountUSD: token0Value },
        symbol: token0Symbol,
        address: token0.address,
      };
      const token1Data: ERC20Token = {
        value: { amount: pairReserves[1], amountUSD: token1Value },
        symbol: token1Symbol,
        address: token1.address,
      };

      return { token0Data, token1Data };
    } catch (e) {
      console.log(e);
      return {};
    }
  }
  return {};
};

export default getLpTokenBreakdown;
