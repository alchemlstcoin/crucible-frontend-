import { FC, useState } from 'react';
import { Button } from '@chakra-ui/button';
import { LightMode } from '@chakra-ui/color-mode';
import { HStack, Box, Flex, Text, Link } from '@chakra-ui/layout';
import { RiExternalLinkLine } from 'react-icons/all';
import formatNumber from 'utils/formatNumber';
import { useTransactions } from 'store/transactions/useTransactions';
import { useConfig } from 'store/config';
import { useWeb3React } from '@web3-react/core';
import { useBalances } from 'store/userBalances';
import CustomInput from 'components/shared/customInput';
import { formatEther, parseUnits } from 'ethers/lib/utils';
import { sanitize } from 'utils/sanitize';

const MintingFormControl: FC = () => {
  const { chainId = 1 } = useWeb3React();
  const { uniswapPoolUrl, lpTokenAddress } = useConfig(chainId).config;
  const [amount, setAmount] = useState('');
  const { getTokenBalance } = useBalances();
  const lpBalance = getTokenBalance(lpTokenAddress);

  const { mintCrucible } = useTransactions();

  const handleMintCrucible = () => {
    mintCrucible(parseUnits(amount, 18));
  };

  return (
    <Box>
      <LightMode>
        <Box bg='white' p={4} mb={6} borderRadius='xl' color='gray.800'>
          <Flex
            mb={4}
            justifyContent={['flex-end', 'space-between']}
            alignItems='center'
          >
            <Text display={['none', 'block']}>Select amount</Text>
            <HStack>
              <Text>
                Balance:{' '}
                <strong>
                  {lpBalance ? formatNumber.token(lpBalance) : '-'} LP
                </strong>
              </Text>
              <Link
                href={uniswapPoolUrl}
                isExternal
                color='cyan.600'
                fontSize='lg'
              >
                <RiExternalLinkLine />
              </Link>
            </HStack>
          </Flex>
          <CustomInput
            bg='gray.50'
            color='gray.800'
            max={formatEther(lpBalance)}
            value={amount}
            onUserInput={(input) => setAmount(input)}
            showRadioGroup
            showMaxButton
            maxButtonVariant='ghostLight'
            _placeholder={{
              color: 'gray.300',
            }}
          />
        </Box>
      </LightMode>
      <Button
        variant='cyanbutton'
        size='lg'
        isFullWidth
        isDisabled={
          parseUnits(sanitize(amount), 18).lte(0) ||
          parseUnits(sanitize(amount), 18).gt(lpBalance)
        }
        onClick={handleMintCrucible}
      >
        Mint a Crucible
      </Button>
    </Box>
  );
};

export default MintingFormControl;
