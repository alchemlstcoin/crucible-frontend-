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
import CustomInput from 'components/shared/customInput';
import AssetsLoadingSkeleton from 'components/crucible/detail/assets-detail/assetsLoadingSkeleton';
import { useTransactions } from 'store/transactions/useTransactions';
import { BiChevronDown } from 'react-icons/bi';
import { truncate } from 'utils/address';
import { useCrucibleAssets } from 'store/crucibleAssets';
import { formatEther, parseUnits } from 'ethers/lib/utils';
import { STATUS } from 'types';
import { sanitize } from 'utils/sanitize';

type Props = {
  crucible: Crucible;
};

const WithdrawFromCrucible: React.FC<Props> = ({ crucible }) => {
  const { withdrawFromCrucible } = useTransactions();
  const { status, crucibleAssets, selectedCrucibleAsset, setSelectedAsset } =
    useCrucibleAssets();

  const [amount, setAmount] = useState('');

  const assetSelector = useMemo(() => {
    return (
      crucibleAssets[crucible?.id] && (
        <Menu placement='bottom-end'>
          <MenuButton
            mb={4}
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
            {truncate(selectedCrucibleAsset?.symbol)}
          </MenuButton>
          <Portal>
            <MenuList maxHeight='240px' overflowY='auto'>
              {crucibleAssets[crucible.id].map((asset) => (
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
      )
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedCrucibleAsset, crucibleAssets]);

  if (status === STATUS.FAILED) {
    return (
      <Box p={[6]} bg='white' color='gray.800' borderRadius='xl'>
        <Text>
          Failed to get assets in your Crucible. Please try refreshing the page.
        </Text>
      </Box>
    );
  }

  if (status === STATUS.PENDING) {
    return <AssetsLoadingSkeleton />;
  }
  if (
    !selectedCrucibleAsset ||
    !crucible ||
    !crucible.id ||
    !crucibleAssets[crucible.id]
  ) {
    return (
      <Box p={[6]} bg='white' color='gray.800' borderRadius='xl'>
        <Text>
          You have no unlocked assets available to withdraw from your Crucible.
        </Text>
        <Text>
          You can view a list of all of your assets in the "Inventory" tab.
        </Text>
      </Box>
    );
  }

  const tokenBalance = selectedCrucibleAsset?.value.amount;
  const tokenDecimals = selectedCrucibleAsset?.decimals;

  const handleTransferErc20 = () => {
    return withdrawFromCrucible(
      crucible.id,
      selectedCrucibleAsset?.address || '',
      selectedCrucibleAsset?.symbol || '',
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
        <Text>Select amount to withdraw</Text>
        <Text>
          Balance:{' '}
          {tokenBalance ? formatNumber.token(tokenBalance, tokenDecimals) : '-'}{' '}
          {truncate(selectedCrucibleAsset?.symbol)}
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
          parseUnits(sanitize(amount), 18).gt(
            selectedCrucibleAsset.value.amount
          )
        }
      >
        Withdraw from Crucible
      </Button>
    </Box>
  );
};

export default WithdrawFromCrucible;
