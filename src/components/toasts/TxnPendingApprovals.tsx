import React, { FC } from 'react';
import {
  Alert,
  AlertDescription,
  AlertTitle,
  Box,
  AlertIcon,
} from '@chakra-ui/react';

const TxnPendingApprovals: FC<{ description?: string }> = ({ description }) => {
  return (
    <Box maxW='400px' mr='20px' mb='20px'>
      <Alert
        bg='white'
        status='warning'
        borderRadius='8px'
        variant='left-accent'
        color='gray.800'
      >
        <AlertIcon />
        <Box flex='1' ml='20px'>
          <AlertTitle>Transaction Initiated</AlertTitle>
          <AlertDescription display='block'>
            {description || 'Pending wallet approval..'}
          </AlertDescription>
        </Box>
      </Alert>
    </Box>
  );
};

export default TxnPendingApprovals;
