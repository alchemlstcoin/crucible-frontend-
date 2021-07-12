import React, { FC } from 'react';
import {
  Alert,
  AlertIcon,
  AlertDescription,
  AlertTitle,
  Box,
  CloseButton,
  Link,
} from '@chakra-ui/react';
import { EtherscanLinkType, getEtherscanLink } from 'utils/getEtherscanLink';

const TxnSucceeded: FC<{ txHash: string; onClose: any; chainId: number }> = ({
  onClose,
  txHash,
  chainId = 1,
}) => {
  return (
    <Box maxW='400px' mr='20px' mb='20px'>
      <Alert
        bg='white'
        status='success'
        borderRadius='8px'
        variant='left-accent'
        color='gray.800'
      >
        <AlertIcon />
        <Box flex='1' ml='20px'>
          <AlertTitle>Transaction Succeeded</AlertTitle>
          <AlertDescription display='block'>
            Your transaction was successful!
            {txHash && txHash.length > 0 && (
              <Link
                isExternal
                display='flex'
                mt={1}
                href={getEtherscanLink(
                  chainId,
                  txHash,
                  EtherscanLinkType.TRANSACTION
                )}
                fontWeight='bold'
              >
                Check it out on Etherscan.
              </Link>
            )}
          </AlertDescription>
        </Box>
        <CloseButton
          onClick={onClose}
          position='absolute'
          right='8px'
          top='8px'
        />
      </Alert>
    </Box>
  );
};

export default TxnSucceeded;
