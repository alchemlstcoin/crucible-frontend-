import React, { FC } from 'react';
import { useModal } from 'store/modals';
import { ModalType } from 'components/modals/types';
import ConnectWalletModal from 'components/modals/ConnectWalletModal';
import ClaimRewardsModal from 'components/modals/ClaimRewardsModal';
import WalletInfoModal from 'components/modals/WalletInfoModal';
import AddSubscriptionModal from 'components/modals/AddSubscriptionModal';
import TxConfirmedFlashbotsModal from 'components/modals/tx/txConfirmedFlashbotsModal';
import TxPendingFlashbotsModal from 'components/modals/tx/txPendingFlashbotsModal';
import TxErrorModal from 'components/modals/tx/txErrorModal';

const ModalRoot: FC = () => {
  const { modalType, modalProps } = useModal();

  switch (modalType) {
    case ModalType.connectWallet:
      return <ConnectWalletModal />;
    case ModalType.walletInfo:
      return <WalletInfoModal />;
    case ModalType.claimRewards:
      return <ClaimRewardsModal {...modalProps} />;
    case ModalType.addSubscription:
      return <AddSubscriptionModal {...modalProps} />;
    case ModalType.flashbotsConfirmed:
      return <TxConfirmedFlashbotsModal {...modalProps} />;
    case ModalType.flashbotsPending:
      return <TxPendingFlashbotsModal {...modalProps} />;
    case ModalType.txnError:
      return <TxErrorModal {...modalProps} />;
  }

  return null;
};

export default ModalRoot;
