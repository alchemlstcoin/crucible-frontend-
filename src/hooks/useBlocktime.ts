import { useWeb3React } from '@web3-react/core';
import { useEffect, useState } from 'react';

export function useBlocktime() {
  const [blockTimestampLoading, setBlockTimestampLoading] = useState(false);
  const [blockTimestamp, setBlockTimestamp] = useState(0);
  const { library } = useWeb3React();

  const signer = library.getSigner();
  const provider = signer.provider;

  useEffect(() => {
    getBlocktimestamp();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getBlocktimestamp = async () => {
    setBlockTimestampLoading(true);

    const blockNumber = await provider.getBlockNumber();
    const block = await provider.getBlock(blockNumber);
    const blockTimestamp = block.timestamp;

    setBlockTimestamp(blockTimestamp);
    setBlockTimestampLoading(false);
  };

  return { blockTimestamp, blockTimestampLoading };
}
