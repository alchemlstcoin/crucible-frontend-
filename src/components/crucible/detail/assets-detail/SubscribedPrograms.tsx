import React, { FC, useMemo } from 'react';
import CrucibleLock from './CrucibleLock';
import { Box, Stack, Grid, GridItem } from '@chakra-ui/layout';
import { useCrucibleLocks } from 'store/crucibleLocks';
import { Crucible, useCrucibles } from 'store/crucibles';
import { useRewardPrograms } from 'store/rewardPrograms';
import { useWeb3React } from '@web3-react/core';
import { Text, Heading, Button, Flex, Spinner } from '@chakra-ui/react';
import AssetBadge from './AssetBadge';
import { useCrucibleAssets } from 'store/crucibleAssets';
import { STATUS } from 'types';

type Props = {
  crucible: Crucible;
  setTabIndex: React.Dispatch<React.SetStateAction<number>>;
};

const SubscribedPrograms: FC<Props> = ({ crucible, setTabIndex }) => {
  const { cruciblesLoading } = useCrucibles();
  const { status: lockStatus, crucibleLocks } = useCrucibleLocks();
  const { status: assetsStatus, crucibleAssets } = useCrucibleAssets();
  const { chainId = 1 } = useWeb3React();
  const { rewardPrograms } = useRewardPrograms();

  const selectedCrucibleLocks = useMemo(() => {
    if (crucible && crucible.id && crucibleLocks[crucible.id]) {
      return crucibleLocks[crucible.id];
    }
    return [];
  }, [crucible, crucibleLocks]);

  if (
    lockStatus === STATUS.PENDING ||
    assetsStatus === STATUS.PENDING ||
    cruciblesLoading
  ) {
    return (
      <Box p={[4, 8]} borderRadius='xl' bg='white' color='gray.800'>
        <Spinner />
      </Box>
    );
  }

  if (!crucible || !crucible.id || !crucibleAssets[crucible.id]) {
    return (
      <Box p={[4, 8]} bg='white' color='gray.800' borderRadius='xl'>
        Something went wrong, please try refreshing the page.
      </Box>
    );
  }

  return (
    <Stack spacing={4}>
      <Box p={[4, 8]} bg='white' color='gray.800' borderRadius='xl'>
        <Heading textAlign='left' size='sm' mb={4}>
          Locked assets{' '}
          {lockStatus === STATUS.UPDATING && <Spinner size='sm' />}
        </Heading>
        {lockStatus === STATUS.FAILED ? (
          <Text>Failed to get locked assets</Text>
        ) : selectedCrucibleLocks.length === 0 ? (
          <Text>You have no locked assets</Text>
        ) : (
          <Stack direction='column' spacing={4}>
            {selectedCrucibleLocks?.map((lock, idx) => {
              const rewardProgram = rewardPrograms[chainId].find(
                (p) => p.address === lock.rewardProgramAddress
              );
              return (
                <CrucibleLock
                  key={idx}
                  lock={lock}
                  rewardProgram={rewardProgram}
                  setTabIndex={setTabIndex}
                  crucible={crucible}
                />
              );
            })}
          </Stack>
        )}
      </Box>
      <Box p={[4, 8]} bg='white' color='gray.800' borderRadius='xl'>
        <Flex justifyContent='space-between' alignItems='center' mb={4}>
          <Heading textAlign='left' size='sm'>
            Unlocked assets{' '}
            {assetsStatus === STATUS.UPDATING && <Spinner size='sm' />}
          </Heading>
          <Button size='sm' onClick={() => setTabIndex(0)}>
            Withdraw
          </Button>
        </Flex>
        {assetsStatus === STATUS.FAILED ? (
          <Text>Failed to get contained assets</Text>
        ) : crucibleAssets[crucible.id].length === 0 ? (
          <Text>You have no contained assets</Text>
        ) : (
          <Grid
            direction='column'
            templateColumns='repeat(6, 1fr)'
            alignItems='center'
            gap={6}
          >
            {crucibleAssets[crucible.id].map((asset) => (
              <GridItem colSpan={[6, 2]} key={asset.address}>
                <AssetBadge asset={asset} />
              </GridItem>
            ))}
          </Grid>
        )}
      </Box>
    </Stack>
  );
};

export default SubscribedPrograms;
