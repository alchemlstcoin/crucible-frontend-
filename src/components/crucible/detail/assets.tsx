import React from 'react';
import { Crucible, useCrucibles } from 'store/crucibles';
import { Box, Stack } from '@chakra-ui/layout';
import { Redirect } from 'react-router';
import AssetsLoadingSkeleton from 'components/crucible/detail/assets-detail/assetsLoadingSkeleton';
import WithdrawFromCrucible from './withdrawFromCrucible';
import DepositToCrucible from './depositToCrucible';

type Props = {
  crucible: Crucible;
};

const Assets: React.FC<Props> = ({ crucible }) => {
  const { crucibles, cruciblesLoading } = useCrucibles();

  if (cruciblesLoading) {
    return <AssetsLoadingSkeleton />;
  }

  if (crucibles.length === 0) {
    return <Redirect to='/' />;
  }

  return (
    <Box>
      <Stack spacing={4}>
        <DepositToCrucible crucible={crucible} />
        <WithdrawFromCrucible crucible={crucible} />
      </Stack>
    </Box>
  );
};

export default Assets;
