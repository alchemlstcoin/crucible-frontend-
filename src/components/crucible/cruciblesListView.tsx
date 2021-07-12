import React, { FC } from 'react';
import { Box, Stack, VStack } from '@chakra-ui/layout';
import { useCrucibles } from 'store/crucibles';
import { Skeleton } from '@chakra-ui/skeleton';
import { LightMode } from '@chakra-ui/color-mode';
import MissingCrucibles from 'components/crucible/missingCrucibles';
import CrucibleCard from 'components/crucible/crucibleCard';

const CruciblesListView: FC = () => {
  const { crucibles, cruciblesLoading } = useCrucibles();

  if (cruciblesLoading) {
    return (
      <Box p={4} bg='white' borderRadius='xl'>
        <LightMode>
          <Stack borderRadius='xl'>
            <Skeleton height='17px' />
            <Skeleton height='17px' />
          </Stack>
        </LightMode>
      </Box>
    );
  }

  if (crucibles.length === 0) {
    return <MissingCrucibles />;
  }

  return (
    <VStack align='stretch' spacing={4}>
      {crucibles.map((crucible) => {
        return <CrucibleCard key={crucible.id} crucible={crucible} />;
      })}
    </VStack>
  );
};

export default CruciblesListView;
