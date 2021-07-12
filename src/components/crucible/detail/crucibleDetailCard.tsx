import { useEffect, useMemo, useState } from 'react';
import CrucibleTabs from 'components/crucible/detail/crucibleTabs';
import { Button, IconButton } from '@chakra-ui/button';
import { truncate } from 'utils/address';
import { useHistory, useParams } from 'react-router-dom';
import { FiArrowLeft, FiCopy, FiSend } from 'react-icons/fi';
import { Box, Flex, Heading, HStack, Text, Link } from '@chakra-ui/layout';
import { Spinner } from '@chakra-ui/react';
import { Tooltip } from '@chakra-ui/tooltip';
import { useClipboard } from '@chakra-ui/hooks';
import { useRef } from 'react';
import { useToast } from '@chakra-ui/toast';
import { useCrucibles } from 'store/crucibles';
import { useWeb3React } from '@web3-react/core';
import TransferModal from 'components/modals/transferModal';
import formatNumber from 'utils/formatNumber';
import { MdFeedback } from 'react-icons/md';
import { useCrucibleAssets } from 'store/crucibleAssets';
import { useSubscriptions } from 'store/subscriptions';
import {
  RewardProgramTokensState,
  useRewardProgramTokens,
} from 'store/rewardProgramTokens';
import { useRewardPrograms } from 'store/rewardPrograms';

const CrucibleDetailCard = () => {
  const id = 'copy-toast';
  const toast = useToast();
  const history = useHistory();

  const { crucibleId } = useParams<{ crucibleId: string }>();
  const { account, chainId = 1 } = useWeb3React();
  const { crucibles, cruciblesLoading, setSelectedCrucible } = useCrucibles();
  const { getAssetsForSingleCrucible, crucibleAssets, setSelectedAsset } =
    useCrucibleAssets();

  const { getSubscriptionsForCrucible } = useSubscriptions();
  const { getTokensForRewardProgram } = useRewardProgramTokens();
  const { currentRewardProgram } = useRewardPrograms();

  const chainIdRef = useRef(chainId);
  const accountRef = useRef(account);

  //Redirect the user if they change the chainId or account
  useEffect(() => {
    if (chainId !== chainIdRef.current || account !== accountRef.current) {
      history.replace('/');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chainId, account]);

  const crucible = useMemo(() => {
    if (cruciblesLoading) return;
    const selected = crucibles.find((crucible) => crucible.id === crucibleId);
    if (!selected) {
      history.replace('/');
    }
    setSelectedCrucible(selected!);
    return selected;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cruciblesLoading]);

  let { hasCopied, onCopy } = useClipboard(crucible?.id || '');
  const [isTransferModalOpen, setIsTransferModalOpen] = useState(false);
  const mintDate = useMemo(() => {
    return formatNumber.date(crucible ? crucible?.mintTimestamp * 1000 : 0);
  }, [crucible]);

  useEffect(() => {
    if (hasCopied && !toast.isActive(id)) {
      toast({
        title: 'Copied crucible address',
        status: 'info',
        duration: 4000,
        isClosable: true,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hasCopied]);

  useEffect(() => {
    if (crucible) {
      /*
         If we have the crucible assets in the cache
         then we set the first asset as the selected one.
         Otherwise, we get the contained assets for the crucible,
         which also handles setting the selected asset
      */
      if (crucibleAssets[crucible.id]) {
        setSelectedAsset(crucibleAssets[crucible.id][0]);
      } else {
        getAssetsForSingleCrucible(crucible.id);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [crucible]);

  useEffect(() => {
    if (currentRewardProgram && crucible) {
      getTokensForRewardProgram(currentRewardProgram).then(({ payload }) => {
        getSubscriptionsForCrucible(
          crucible.id,
          currentRewardProgram,
          payload as RewardProgramTokensState
        );
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [crucible, currentRewardProgram]);

  return (
    <Box position='relative'>
      <Heading top={['-80px', '-120px']} position='absolute' width='100%'>
        Manage Crucible
      </Heading>
      <Flex alignItems='center' justifyContent='space-between'>
        <Button
          pl={2}
          pr={3}
          variant='ghost'
          leftIcon={<FiArrowLeft />}
          onClick={() => history.push('/')}
        >
          All Crucibles
        </Button>
        <Button
          pl={2}
          pr={3}
          variant='ghost'
          textColor='gray.200'
          fontWeight='normal'
          bg='#220b46'
          as={Link}
          href='https://alchemistcoin.typeform.com/to/YKYwcK3Y'
          isExternal
          rightIcon={<MdFeedback />}
        >
          Feedback
        </Button>
      </Flex>
      <Flex
        mt={4}
        p={4}
        bg='gray.700'
        borderRadius='xl'
        justifyContent='space-between'
      >
        <HStack spacing={3} flexGrow={1}>
          <Box
            display={['none', 'block']}
            boxSize='48px'
            bgGradient='linear(to-tr, cyan.200, purple.100)'
            borderRadius='md'
          />
          {cruciblesLoading ? (
            <Spinner />
          ) : (
            <Box textAlign='left'>
              <Text fontSize='xl'>ID: {truncate(crucible?.id || '')}</Text>
              <HStack>
                <Text key={0} fontSize='sm' color='gray.300'>
                  Minted on {mintDate}
                </Text>
              </HStack>
            </Box>
          )}
        </HStack>
        <Flex flexDirection={['column', 'row']}>
          <Tooltip
            hasArrow
            label='Copy Crucible address'
            bg='gray.800'
            color='white'
            placement='top'
          >
            <div>
              <IconButton
                disabled={cruciblesLoading}
                aria-label='copy'
                fontSize='2xl'
                color='cyan.400'
                variant='ghost'
                icon={<FiCopy />}
                onClick={onCopy}
              />
            </div>
          </Tooltip>
          <Tooltip
            hasArrow
            label='Transfer Crucible'
            bg='gray.800'
            color='white'
            placement='top'
          >
            <IconButton
              disabled={cruciblesLoading}
              aria-label='transfer'
              fontSize='2xl'
              color='cyan.400'
              variant='ghost'
              icon={<FiSend />}
              onClick={() => {
                setIsTransferModalOpen(true);
              }}
            />
          </Tooltip>
        </Flex>
      </Flex>
      <Box paddingTop='20px'>
        <CrucibleTabs crucible={crucible!} />
      </Box>
      {isTransferModalOpen && (
        <TransferModal
          id={crucible!.id}
          onClose={() => setIsTransferModalOpen(false)}
        />
      )}
    </Box>
  );
};

export default CrucibleDetailCard;
