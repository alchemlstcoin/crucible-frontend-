import React, { FC } from 'react';
import {
  Alert,
  AlertDescription,
  AlertTitle,
  Box,
  CloseButton,
  Link,
  Spinner,
} from '@chakra-ui/react';
import { EtherscanLinkType, getEtherscanLink } from 'utils/getEtherscanLink';

const TxnBroadcasted: FC<{ txHash: string; onClose: any; chainId: number }> = ({
  onClose,
  txHash,
  chainId = 1,
}) => {
  return (
    <Box maxW='400px' mr='20px' mb='20px'>
      <Alert
        bg='white'
        status='info'
        borderRadius='8px'
        variant='left-accent'
        color='gray.800'
      >
        <Spinner
          thickness='2px'
          speed='0.65s'
          emptyColor='gray.200'
          color='blue.500'
          size='md'
        />
        <Box flex='1' ml='20px'>
          <AlertTitle>Transaction Pending</AlertTitle>
          <AlertDescription display='block'>
            Your transaction has been broadcast to the network.
            {txHash.length && (
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

export default TxnBroadcasted;
