import React, { FC, useMemo } from 'react';
import {
  Alert,
  AlertDescription,
  AlertIcon,
  AlertTitle,
  Box,
  CloseButton,
  Text,
} from '@chakra-ui/react';
import { ModalType } from 'components/modals/types';

export const TxnPendingApprovals: FC<{
  errorMessage: string;
  error: any;
  modal: { openModal: (type: ModalType, props: any) => void };
  onClose?: any;
}> = ({ errorMessage, error, modal, onClose }) => {
  const { openModal } = modal;

  const displayErrorLink = useMemo(
    () => Object.keys(error).length > 0,
    [error]
  );

  return (
    <Box maxW='400px' mr='20px' mb='20px'>
      <Alert
        bg='white'
        status='error'
        borderRadius='8px'
        variant='left-accent'
        color='gray.800'
      >
        <AlertIcon />
        <Box flex='1' ml='20px'>
          <AlertTitle>Transaction Failed</AlertTitle>
          <AlertDescription display='block'>{errorMessage}</AlertDescription>
          {displayErrorLink && (
            <AlertDescription display='block'>
              <Text
                fontWeight='bold'
                cursor='pointer'
                __hover={{ cursor: 'pointer' }}
                onClick={() => openModal(ModalType.txnError, { error })}
              >
                See More
              </Text>
            </AlertDescription>
          )}
        </Box>
        {onClose && (
          <CloseButton
            onClick={onClose}
            position='absolute'
            right='8px'
            top='8px'
          />
        )}
      </Alert>
    </Box>
  );
};

export default TxnPendingApprovals;
