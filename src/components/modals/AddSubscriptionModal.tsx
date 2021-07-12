import { FC, useEffect, useMemo, useState, useRef } from 'react';
import { Button, Link, Text } from '@chakra-ui/react';
import {
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
} from '@chakra-ui/modal';
import { Box } from '@chakra-ui/layout';
import formatNumber from 'utils/formatNumber';
import { useTransactions } from 'store/transactions/useTransactions';
import { useModal } from 'store/modals';
import { BigNumber } from 'ethers';
import { RewardProgram } from 'store/rewardPrograms';
import { ProgramToken } from 'components/crucible/detail/assets-detail/Rewards';
import { Crucible } from 'store/crucibles';
import { Tab, TabList, Tabs } from '@chakra-ui/tabs';
import CustomInput from 'components/shared/customInput';
import { formatEther, parseUnits } from 'ethers/lib/utils';
import { sanitize } from 'utils/sanitize';

type Props = {
  crucible: Crucible;
  stakingToken: ProgramToken;
  stakingTokenCrucibleBalance: BigNumber;
  stakingTokenWalletBalance: BigNumber;
  currentRewardProgram: RewardProgram;
};

const AddSubscriptionModal: FC<Props> = ({
  crucible,
  stakingToken,
  stakingTokenCrucibleBalance,
  stakingTokenWalletBalance,
  currentRewardProgram,
}) => {
  const { addSubscription } = useTransactions();
  const { closeModal } = useModal();
  const focusRef = useRef<HTMLInputElement>(null);

  const [amountToSubscribe, setAmountToSubscribe] = useState('');
  const [stakingTokenBalance, setStakingTokenBalance] = useState(
    stakingTokenCrucibleBalance
  );

  const [tabIndex, setTabIndex] = useState(1);
  const radioValue = useMemo(() => {
    return tabIndex === 1 ? 'wallet' : 'crucible';
  }, [tabIndex]);

  const tabProps = {
    borderRadius: 'lg',
    fontWeight: 'bold',
    fontSize: ['14px', '16px'],
    _selected: { color: 'purple.800', bg: 'cyan.400' },
    marginBottom: '1px',
  };

  useEffect(() => {
    if (stakingToken.address) {
      getStakingTokenBalance();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [radioValue, stakingToken.address]);

  const getStakingTokenBalance = async () => {
    if (radioValue === 'crucible') {
      setStakingTokenBalance(stakingTokenCrucibleBalance);
    } else {
      setStakingTokenBalance(stakingTokenWalletBalance);
    }
  };

  const handleAddSubscription = () => {
    addSubscription(
      parseUnits(amountToSubscribe, 18),
      crucible.id,
      radioValue,
      currentRewardProgram,
      stakingToken
    );
    closeModal();
    window.scrollTo(0, 0);
  };

  return (
    <Modal isOpen={true} onClose={closeModal} initialFocusRef={focusRef}>
      <ModalOverlay />
      <ModalContent borderRadius='xl'>
        <ModalHeader>Add subscription</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Text mb={6}>
            Add a subscription to the {currentRewardProgram.name} Rewards
            program by locking {stakingToken.tokenSymbol} tokens in your
            Crucible.
          </Text>
          <Text>Select your source of funds to subscribe:</Text>
          <Tabs
            index={tabIndex}
            isFitted
            defaultIndex={tabIndex}
            onChange={(index) => {
              setTabIndex(index);
              setAmountToSubscribe('');
            }}
            mb={6}
            size='sm'
          >
            <TabList
              bg='gray.700'
              borderRadius='xl'
              my={2}
              border='1px solid'
              padding='5px'
            >
              <Tab {...tabProps}>Crucible</Tab>
              <Tab {...tabProps}>Wallet</Tab>
            </TabList>
          </Tabs>
          <Box mb={2} alignItems='center' color='gray.100'>
            <Text>
              Available balance:{' '}
              <strong>{formatNumber.token(stakingTokenBalance)} LP</strong>
            </Text>
          </Box>

          {stakingTokenBalance.isZero() && (
            <Text mb={4}>
              No funds? You can get {stakingToken.tokenSymbol} tokens from this{' '}
              <Link
                color='blue.400'
                isExternal
                href={currentRewardProgram.getStakingTokenUrl}
              >
                Uniswap trading pool
              </Link>
              .
            </Text>
          )}
          <CustomInput
            inputRef={focusRef}
            max={formatEther(stakingTokenBalance)}
            value={amountToSubscribe}
            onUserInput={(input) => setAmountToSubscribe(input)}
            showRadioGroup
            showMaxButton
          />
        </ModalBody>
        <ModalFooter>
          <Button
            variant='cyanbutton'
            isFullWidth
            onClick={handleAddSubscription}
            isDisabled={
              parseUnits(sanitize(amountToSubscribe), 18).lte(0) ||
              parseUnits(sanitize(amountToSubscribe), 18).gt(
                stakingTokenBalance
              )
            }
          >
            Add subscription
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default AddSubscriptionModal;
