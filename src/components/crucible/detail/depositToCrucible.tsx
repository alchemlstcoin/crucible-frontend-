import {
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Portal,
  Spinner,
} from '@chakra-ui/react';
import { Button } from '@chakra-ui/button';
import { Box, Flex, Text } from '@chakra-ui/layout';
import { useMemo, useState } from 'react';
import { Crucible } from 'store/crucibles';
import formatNumber from 'utils/formatNumber';
import AssetsLoadingSkeleton from 'components/crucible/detail/assets-detail/assetsLoadingSkeleton';
import { useTransactions } from 'store/transactions/useTransactions';
import { BiChevronDown } from 'react-icons/bi';
import { truncate } from 'utils/address';
import { useWalletAssets } from 'store/walletAssets';
import { STATUS } from 'types';
import CustomInput from 'components/shared/customInput';
import { formatEther, parseUnits } from 'ethers/lib/utils';
import { sanitize } from 'utils/sanitize';

type Props = {
  crucible: Crucible;
};

const DepositToCrucible: React.FC<Props> = ({ crucible }) => {
  const { depositToCrucible } = useTransactions();
  const { status, walletAssets, selectedwalletAsset, setSelectedAsset } =
    useWalletAssets();

  const [amount, setAmount] = useState('');

  const assetSelector = useMemo(() => {
    return (
      <Menu placement='bottom-end'>
        <MenuButton
          bg='gray.100'
          color='gray.800'
          variant='ghost'
          size='sm'
          as={Button}
          rightIcon={<BiChevronDown />}
          _hover={{
            bg: 'gray.100',
          }}
        >
          {truncate(selectedwalletAsset?.symbol)}
        </MenuButton>
        <Portal>
          <MenuList maxHeight='240px' overflowY='auto'>
            {walletAssets.map((asset) => (
              <MenuItem
                key={asset.address}
                onClick={() => setSelectedAsset(asset)}
              >
                {asset.symbol}
              </MenuItem>
            ))}
          </MenuList>
        </Portal>
      </Menu>
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedwalletAsset, walletAssets]);

  if (status === STATUS.FAILED) {
    return (
      <Box p={[6]} bg='white' color='gray.800' borderRadius='xl'>
        <Text>
          Failed to get available assets in your wallet. Please try refreshing
          the page.
        </Text>
      </Box>
    );
  }

  if (status === STATUS.PENDING) {
    return <AssetsLoadingSkeleton />;
  }
  if (!selectedwalletAsset) {
    return (
      <Box p={[6]} bg='white' color='gray.800' borderRadius='xl'>
        <Text>
          There are no assets available in your wallet to deposit to your
          Crucible.
        </Text>
      </Box>
    );
  }

  const tokenBalance = selectedwalletAsset?.value.amount;
  const tokenDecimals = selectedwalletAsset?.decimals;

  const handleTransferErc20 = () => {
    return depositToCrucible(
      crucible.id,
      selectedwalletAsset?.address || '',
      selectedwalletAsset?.symbol || '',
      parseUnits(amount, 18)
    );
  };

  return (
    <Box p={[6]} bg='white' color='gray.800' borderRadius='xl'>
      {status === STATUS.UPDATING && <Spinner size='sm' />}
      <Flex
        alignItems='center'
        justifyContent='space-between'
        direction={['column-reverse', 'row']}
        mb={2}
      >
        <Text>Select amount to deposit</Text>
        <Text>
          Balance:{' '}
          {tokenBalance ? formatNumber.token(tokenBalance, tokenDecimals) : '-'}{' '}
          {truncate(selectedwalletAsset?.symbol)}
        </Text>
      </Flex>
      <CustomInput
        bg='gray.50'
        max={formatEther(tokenBalance)}
        value={amount}
        onUserInput={(input) => setAmount(input)}
        showMaxButton
        maxButtonVariant='ghostLight'
        inputRightElement={assetSelector}
        _placeholder={{
          color: 'gray.300',
        }}
      />
      <Button
        mt={4}
        isFullWidth
        onClick={handleTransferErc20}
        disabled={
          parseUnits(sanitize(amount), 18).lte(0) ||
          parseUnits(sanitize(amount), 18).gt(selectedwalletAsset.value.amount)
        }
      >
        Deposit to Crucible
      </Button>
    </Box>
  );
};

export default DepositToCrucible;
