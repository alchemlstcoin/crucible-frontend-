import React, { FC, useMemo, useState } from 'react';
import {
  Button,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
  InputGroup,
  InputRightElement,
} from '@chakra-ui/react';
import {
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
} from '@chakra-ui/modal';
import { ethers } from 'ethers';
import { useTransactions } from 'store/transactions/useTransactions';
import { BiCheckCircle, BiErrorCircle } from 'react-icons/all';

type Props = {
  id: string;
  onClose: () => void;
};

const TransferModal: FC<Props> = ({ onClose, id }) => {
  const [error, setError] = useState('');
  const [sendAddress, setSendAddress] = useState('');

  const isValidAddress = useMemo(
    () => ethers.utils.isAddress(sendAddress),
    [sendAddress]
  );

  const { transferCrucible } = useTransactions();

  const handleTransferCrucible = () => {
    setError('');
    if (isValidAddress) {
      transferCrucible(id, sendAddress);
      onClose();
      window.scrollTo(0, 0);
    } else {
      setError('Invalid wallet address');
    }
  };

  return (
    <>
      <Modal isOpen={true} onClose={onClose}>
        <ModalOverlay />
        <ModalContent borderRadius='xl'>
          <ModalHeader textAlign='center'>Transfer crucible</ModalHeader>
          <ModalCloseButton />
          <ModalBody textAlign='center'>
            <FormControl isInvalid={!!error}>
              <FormLabel htmlFor='address'>Recipient address</FormLabel>
              <InputGroup>
                <Input
                  id='address'
                  placeholder='Address'
                  onChange={(e) => setSendAddress(e.target.value)}
                />
                {sendAddress.length > 0 && isValidAddress && (
                  <InputRightElement
                    children={<BiCheckCircle color='green' />}
                  />
                )}
                {sendAddress.length > 0 && !isValidAddress && (
                  <InputRightElement children={<BiErrorCircle color='red' />} />
                )}
              </InputGroup>
              <FormErrorMessage>{error}</FormErrorMessage>
            </FormControl>
          </ModalBody>
          <ModalFooter>
            <Button
              variant='cyanbutton'
              isFullWidth
              onClick={handleTransferCrucible}
            >
              Transfer crucible
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default TransferModal;
