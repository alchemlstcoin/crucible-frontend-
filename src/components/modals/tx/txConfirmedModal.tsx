import { FC } from 'react';
import { Button, Flex, Text, Link } from '@chakra-ui/react';
import { IoArrowUpCircleOutline } from 'react-icons/io5';
import {
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
} from '@chakra-ui/modal';
import { useWeb3React } from '@web3-react/core';
import { EtherscanLinkType, getEtherscanLink } from 'utils/getEtherscanLink';
import { useModal } from 'store/modals';

type Props = {
  message?: string;
  hash: string;
};

const TxConfirmedModal: FC<Props> = ({ hash }) => {
  const { chainId = 1 } = useWeb3React();
  const { closeModal } = useModal();

  return (
    <Modal isOpen={true} onClose={closeModal}>
      <ModalOverlay />
      <ModalContent borderRadius='xl'>
        <ModalHeader textAlign='center'>Transaction submitted</ModalHeader>
        <ModalCloseButton />
        <ModalBody textAlign='center' py={8}>
          <Flex justifyContent='center' color='white' pb={2}>
            <IoArrowUpCircleOutline fontSize='80px' />
          </Flex>
          <Text color='gray.200'>
            <Link
              isExternal
              color='blue.400'
              fontWeight='bold'
              href={getEtherscanLink(
                chainId,
                hash,
                EtherscanLinkType.TRANSACTION
              )}
            >
              View on Etherscan
            </Link>
          </Text>
        </ModalBody>
        <ModalFooter>
          <Button variant='cyanbutton' onClick={closeModal} isFullWidth>
            Close
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default TxConfirmedModal;
