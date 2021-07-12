import React, { FC } from 'react';
import { HStack, Box } from '@chakra-ui/layout';
import { truncate } from 'utils/address';
import { Button, Tag } from '@chakra-ui/react';
import { VscLink } from 'react-icons/vsc';
import { useWeb3React } from '@web3-react/core';
import { convertChainIdToNetworkName } from 'utils/convertChainIdToNetworkName';
import { useModal } from 'store/modals';
import { ModalType } from 'components/modals/types';
import { useTransactions } from 'store/transactions/useTransactions';
import { TxnStatus } from 'store/transactions/types';
import { useEffect } from 'react';
import { convertConnectorTypeToWalletName } from 'utils/convertConnectorTypeToWalletName';
import { isMobile } from 'react-device-detect';
import useLogger from 'hooks/useLogger';
import { getAddress } from 'ethers/lib/utils';

const UserWallet: FC = () => {
  const { account, chainId, connector } = useWeb3React();
  const { openModal } = useModal();
  const { transactions } = useTransactions();
  const logger = useLogger();

  const pendingTransactions = transactions.filter(
    (txn) => txn.status === TxnStatus.PendingOnChain
  );

  const openWalletConnectionModal = () => {
    openModal(ModalType.connectWallet);
  };

  const openWalletInfoModal = () => {
    openModal(ModalType.walletInfo);
  };

  /*
    The following code keeps track of and stores user data
    such as account addresses, wallets and device types. This data is used
    to improve our product by understanding user trends. 
    The data is not used to target individual users and it's not shared with third parties.
  */
  useEffect(() => {
    if (account) {
      const storedAccount = localStorage.getItem('userAccountAddress');
      const storedWallet = localStorage.getItem('userWallet');
      const storedDeviceType = localStorage.getItem('userDeviceType');

      const wallet = convertConnectorTypeToWalletName(connector) || '';
      const deviceType = isMobile ? 'mobile' : 'desktop';

      if (
        account !== storedAccount ||
        wallet !== storedWallet ||
        deviceType !== storedDeviceType
      ) {
        const userInfo = {
          address: account,
          wallet: convertConnectorTypeToWalletName(connector),
          deviceType: isMobile ? 'mobile' : 'desktop',
        };

        logger.push(userInfo);
        localStorage.setItem('userAccountAddress', account);
        localStorage.setItem('userWallet', wallet);
        localStorage.setItem('userDeviceType', deviceType);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [account, connector]);

  const buttonStyles = {
    borderColor: 'cyan.400',
    borderWidth: '2px',
    variant: 'outline',
  };

  if (account) {
    return (
      <HStack spacing={4}>
        <Button
          {...buttonStyles}
          _hover={{
            ...buttonStyles,
            cursor: 'initial',
          }}
          _active={{
            ...buttonStyles,
          }}
        >
          {convertChainIdToNetworkName(chainId)}
        </Button>
        <Box position='relative'>
          <Button {...buttonStyles} pr={4} onClick={openWalletInfoModal}>
            {truncate(getAddress(account))}
          </Button>
          {pendingTransactions.length > 0 && (
            <Tag
              onClick={openWalletInfoModal}
              colorScheme='red'
              size='sm'
              variant='solid'
              position='absolute'
              borderRadius='full'
              left='-5px'
              top='-5px'
              bgColor='rgba(229, 62, 62)'
              cursor='pointer'
            >
              {pendingTransactions.length}
            </Tag>
          )}
        </Box>
      </HStack>
    );
  }

  return (
    <Button
      {...buttonStyles}
      rightIcon={<VscLink />}
      onClick={openWalletConnectionModal}
    >
      Connect Wallet
    </Button>
  );
};

export default UserWallet;
