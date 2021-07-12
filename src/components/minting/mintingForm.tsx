import React, { FC } from 'react';
import { Box } from '@chakra-ui/layout';
import MintingFormControl from 'components/minting/mintingFormControl';
import MissingIngredients from 'components/minting/missingIngredients';
import MintingHelper from 'components/minting/mintingHelper';
import { useConfig } from 'store/config';
import { useWeb3React } from '@web3-react/core';
import { useBalances } from 'store/userBalances';

const MintingForm: FC = () => {
  const { chainId = 1 } = useWeb3React();
  const { config } = useConfig(chainId);
  const { getTokenBalance } = useBalances();

  const lpTokenBalance = getTokenBalance(config.lpTokenAddress);

  return (
    <Box>
      {lpTokenBalance?.lte(0) ? (
        <MissingIngredients />
      ) : (
        <Box>
          <MintingHelper />
          <MintingFormControl />
        </Box>
      )}
    </Box>
  );
};

export default MintingForm;
