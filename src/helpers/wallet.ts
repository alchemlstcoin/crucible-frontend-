import IUniswapV2ERC20 from '@uniswap/v2-core/build/IUniswapV2ERC20.json';
import { BigNumber } from '@ethersproject/bignumber';
import { formatTokenSymbol } from 'helpers/formatTokenSymbol';
import { ethers, Signer } from 'ethers';
import { ERC20Token } from 'types';
import { crucibleAbi } from 'abi/crucibleAbi';

interface TransactionData {
  status: string;
  message: string;
  result: Transaction[];
}

interface Transaction {
  blockHash: string;
  blockNumber: string;
  confirmations: string;
  contractAddress: string;
  cumulativeGasUsed: string;
  from: string;
  gas: BigNumber;
  gasPrice: BigNumber;
  gasUsed: BigNumber;
  hash: string;
  input: string;
  nonce: string;
  timeStamp: string;
  to: string;
  tokenDecimal: string;
  tokenName: string;
  tokenSymbol: string;
  transactionIndex: string;
  value: BigNumber;
}

interface AssetDetail {
  contractAddress: string;
  tokenName: string;
  tokenSymbol: string;
  value: BigNumber;
  tokenDecimal: string;
}

interface Assets {
  [key: string]: AssetDetail;
}

async function getTokenAmount(
  tokenAddress: string,
  isCrucible: boolean | undefined,
  signer: Signer,
  address: string
): Promise<BigNumber> {
  const tokenContract = new ethers.Contract(
    tokenAddress,
    IUniswapV2ERC20.abi,
    signer
  );
  const tokenBalance = await tokenContract.balanceOf(address);

  if (isCrucible) {
    const crucibleContract = new ethers.Contract(address, crucibleAbi, signer);
    const lockedBalance = await crucibleContract.getBalanceLocked(tokenAddress);
    const unlockedBalance = tokenBalance.sub(lockedBalance);
    return unlockedBalance;
  } else {
    return tokenBalance;
  }
}

export const getContainedAssets = async (
  address: string,
  chainId: number,
  etherscanApiKey: string,
  signer: Signer,
  isCrucible: boolean
) => {
  const endpoint =
    chainId === 1
      ? `https://api.etherscan.io/api?module=account&action=tokentx&address=${address}&startblock=0&endblock=999999999&sort=asc&apikey=${etherscanApiKey}`
      : chainId === 5
      ? `https://api-goerli.etherscan.io/api?module=account&action=tokentx&address=${address}&startblock=0&endblock=999999999&sort=asc&apikey=${etherscanApiKey}`
      : `https://api-rinkeby.etherscan.io/api?module=account&action=tokentx&address=${address}&startblock=0&endblock=999999999&sort=asc&apikey=${etherscanApiKey}`;

  try {
    const response = await fetch(endpoint);
    const data: TransactionData = await response.json();

    const assetsDetail: AssetDetail[] = [];

    if (data.message !== 'OK') {
      throw new Error(data.result as unknown as string);
    }

    const assets: Assets = data.result.reduce((acc, tx) => {
      return { ...acc, [tx.contractAddress]: { ...tx } };
    }, {});

    for (const o in assets) {
      assetsDetail.push(assets[o]);
    }

    const containedAssets: Promise<ERC20Token[]> = Promise.all(
      assetsDetail.map(async (result) => {
        const tokenSymbol = await formatTokenSymbol(
          result.contractAddress,
          result.tokenSymbol,
          signer
        );

        const amount = await getTokenAmount(
          result.contractAddress,
          isCrucible,
          signer,
          address
        );

        return {
          value: { amount },
          address: result.contractAddress,
          symbol: tokenSymbol,
          decimals: Number(result.tokenDecimal),
        };
      })
    );

    return (await containedAssets)
      .sort((a, b) => a.symbol.localeCompare(b.symbol))
      .filter((asset) => asset.value.amount.gt(0));
  } catch (err) {
    throw err;
  }
};
