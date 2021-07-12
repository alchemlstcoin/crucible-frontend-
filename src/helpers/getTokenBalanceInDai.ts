import { ChainId, Fetcher, Token, WETH } from '@uniswap/sdk';
import { BigNumber, ethers, Signer } from 'ethers';
import bigNumberishToNumber from 'utils/bigNumberishToNumber';
import IUniswapV2ERC20 from '@uniswap/v2-core/build/IUniswapV2ERC20.json';
import IUniswapV2Pair from '@uniswap/v2-core/build/IUniswapV2Pair.json';

const getLpValueInUSD = async (
  tokenAddress: string,
  tokenBalance: BigNumber,
  signer: Signer,
  chainId: number,
  daiAddress: string,
  daiTokenDecimals: number
): Promise<number> => {
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

  const token0Decimals = await token0Contract.decimals();
  const token1Decimals = await token1Contract.decimals();

  const pairReserves = await lpContract.getReserves();

  const pairTotalSupply = await lpContract.totalSupply();

  const token0 = new Token(chainId, token0Address, token0Decimals);
  const token1 = new Token(chainId, token1Address, token1Decimals);

  let token0ValueInWETH;
  if (token0.address === WETH[token0.chainId].address) {
    token0ValueInWETH = 1;
  } else {
    token0ValueInWETH = (
      await Fetcher.fetchPairData(token0, WETH[token0.chainId])
    ).token0Price.toSignificant();
  }

  let token1ValueInWETH;
  if (token1.address === WETH[token1.chainId].address) {
    token1ValueInWETH = 1;
  } else {
    token1ValueInWETH = (
      await Fetcher.fetchPairData(token1, WETH[token1.chainId])
    ).token0Price.toSignificant();
  }

  const DAI = new Token(chainId, daiAddress, daiTokenDecimals);

  const wethValueInDAI = (
    await Fetcher.fetchPairData(DAI, WETH[DAI.chainId])
  ).token1Price.toSignificant();

  const token0PoolValueInDAI =
    Number(pairReserves[0]) *
    Number(token0ValueInWETH) *
    Number(wethValueInDAI);

  const token1PoolValueInDAI =
    Number(pairReserves[1]) *
    Number(token1ValueInWETH) *
    Number(wethValueInDAI);

  const valueOfLP =
    (Number(token0PoolValueInDAI) + Number(token1PoolValueInDAI)) /
    Number(pairTotalSupply);

  return valueOfLP * bigNumberishToNumber(tokenBalance);
};

const getERC20ValueInUSD = async (
  tokenAddress: string,
  tokenBalance: BigNumber,
  signer: Signer,
  chainId: number,
  daiAddress: string,
  daiTokenDecimals: number,
  tokenDecimals: number
): Promise<number> => {
  const DAI = new Token(chainId, daiAddress, daiTokenDecimals);
  const TOKEN = new Token(chainId, tokenAddress, tokenDecimals);

  let tokenValueInWETH;
  if (tokenAddress === WETH[DAI.chainId].address) {
    tokenValueInWETH = 1;
  } else {
    tokenValueInWETH = (
      await Fetcher.fetchPairData(TOKEN, WETH[DAI.chainId])
    ).token1Price.toSignificant();
  }

  const wethValueInDAI = (
    await Fetcher.fetchPairData(DAI, WETH[DAI.chainId])
  ).token1Price.toSignificant();

  const tokenValueInDai = Number(wethValueInDAI) / Number(tokenValueInWETH);

  const userBalInWei = bigNumberishToNumber(tokenBalance);

  return Number(tokenValueInDai) * Number(userBalInWei) || 0;
};

const getTokenBalanceInDai = async (
  tokenAddress: string,
  tokenBalance: BigNumber,
  daiAddress: string,
  chainId: ChainId,
  signer: Signer
): Promise<number> => {
  const tokenContract = new ethers.Contract(
    tokenAddress,
    IUniswapV2ERC20.abi,
    signer
  );
  const tokenSymbol = await tokenContract.symbol();
  const tokenDecimals = await tokenContract.decimals();
  const isLp = tokenSymbol === 'UNI-V2';
  const daiTokenContract = new ethers.Contract(
    daiAddress,
    IUniswapV2ERC20.abi,
    signer
  );
  const daiTokenDecimals = await daiTokenContract.decimals();

  if (isLp) {
    return getLpValueInUSD(
      tokenAddress,
      tokenBalance,
      signer,
      chainId,
      daiAddress,
      daiTokenDecimals
    );
  } else {
    return getERC20ValueInUSD(
      tokenAddress,
      tokenBalance,
      signer,
      chainId,
      daiAddress,
      daiTokenDecimals,
      tokenDecimals
    );
  }
};

export default getTokenBalanceInDai;
