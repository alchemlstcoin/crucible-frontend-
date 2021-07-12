import { FC, useEffect, useMemo } from 'react';
import { truncate } from 'utils/address';
import { useHistory } from 'react-router-dom';
import { IconButton } from '@chakra-ui/button';
import { Crucible, useCrucibles } from 'store/crucibles';
import { Box, Flex, Stack, Text } from '@chakra-ui/layout';
import { useClipboard } from '@chakra-ui/hooks';
import { useToast } from '@chakra-ui/toast';
import { IoIosArrowDroprightCircle } from 'react-icons/io';
import { FiCopy } from 'react-icons/fi';
import { getAddress } from 'ethers/lib/utils';
import { useCrucibleLocks } from 'store/crucibleLocks';
import { Spinner, Tag } from '@chakra-ui/react';
import { Tooltip } from '@chakra-ui/tooltip';
import formatNumber from 'utils/formatNumber';
import { STATUS } from 'types';

type Props = {
  crucible: Crucible;
};

const CrucibleCard: FC<Props> = ({ crucible }) => {
  const history = useHistory();
  const toast = useToast();
  const crucibleId = getAddress(crucible.id);

  let { hasCopied, onCopy } = useClipboard(crucibleId);

  const { status, crucibleLocks } = useCrucibleLocks();
  const { setSelectedCrucible } = useCrucibles();

  const routeToCrucibleDetails = () => {
    setSelectedCrucible(crucible);
    // do not checksum this id
    history.push(`/crucible/${crucible.id}`);
  };

  const crucibleSubscriptionLength = useMemo(() => {
    if (crucible && crucible.id && crucibleLocks[crucible.id]) {
      let sum = 0;
      crucibleLocks[crucible.id].forEach(
        (lock) => (sum += lock.subscriptionCount)
      );
      return sum;
    }
  }, [crucibleLocks, crucible]);

  useEffect(() => {
    if (hasCopied) {
      toast({
        title: 'Copied crucible address',
        status: 'info',
        duration: 4000,
        isClosable: true,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hasCopied]);

  return (
    <Box
      p={4}
      bg='white'
      color='gray.800'
      borderRadius='xl'
      position='relative'
      paddingRight='50px'
    >
      <Flex
        justifyContent='space-between'
        alignItems='center'
        w='100%'
        flexWrap='wrap'
      >
        <Box flexGrow={1}>
          <Stack direction={['column', 'row']}>
            <Box
              display={['none', 'block']}
              boxSize='42px'
              bgGradient='linear(to-tr, cyan.200, purple.100)'
              borderRadius='md'
              mr={1}
            />
            <Box textAlign='left'>
              <Stack direction='row' cursor='pointer' onClick={onCopy}>
                <Text onClick={onCopy}>ID: {truncate(crucibleId)}</Text>
                <FiCopy style={{ marginTop: 4 }} />
              </Stack>
              <Text fontSize='xs' color='gray.400' width='100%'>
                {`Minted on ${formatNumber.date(
                  crucible.mintTimestamp * 1000
                )}`}
              </Text>
            </Box>
          </Stack>
        </Box>
        <Box>
          {status === STATUS.PENDING ? (
            <Tag>
              <Spinner size='sm' />
            </Tag>
          ) : (
            <Tooltip
              hasArrow
              label='This is the amount of subscriptions you have across our reward programs'
              bg='gray.800'
              color='white'
              placement='top'
            >
              <Tag textColor='gray.300'>
                {crucibleSubscriptionLength} Subscription
                {crucibleSubscriptionLength === 1 ? '' : 's'}
              </Tag>
            </Tooltip>
          )}
        </Box>
        <IconButton
          position='absolute'
          right='15px'
          aria-label='Manage crucible'
          size='sm'
          bg='none'
          fontSize='2xl'
          color='gray.300'
          icon={<IoIosArrowDroprightCircle />}
          onClick={routeToCrucibleDetails}
          _hover={{ bg: 'none', color: 'gray.800' }}
          _active={{ bg: 'none' }}
        />
      </Flex>
    </Box>
  );
};

export default CrucibleCard;
