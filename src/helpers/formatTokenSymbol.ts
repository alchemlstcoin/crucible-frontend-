import IUniswapV2ERC20 from '@uniswap/v2-core/build/IUniswapV2ERC20.json';
import IUniswapV2Pair from '@uniswap/v2-core/build/IUniswapV2Pair.json';
import { ethers, Signer } from 'ethers';

export const formatTokenSymbol = async (
  address: string,
  tokenSymbol: string,
  signer: Signer
) => {
  const isLp = tokenSymbol === 'UNI-V2';

  if (!isLp) {
    // No Uniswap graph for Rinkeby
    return tokenSymbol;
  }
  try {
    const lpContract = new ethers.Contract(address, IUniswapV2Pair.abi, signer);

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

    return token0Symbol + ' - ' + token1Symbol + ' LP';
  } catch (e) {
    console.log(e);
    return tokenSymbol;
  }
};
