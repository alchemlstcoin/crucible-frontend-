import {
  Box,
  Grid,
  GridItem,
  Tag,
  TagLeftIcon,
  TagLabel,
  Circle,
  Text,
  Flex,
  IconButton,
  Menu,
  MenuButton,
  MenuList,
  MenuGroup,
  MenuItem,
  Tooltip,
  Spinner,
} from '@chakra-ui/react';
import { BsThreeDotsVertical, VscOpenPreview, BsUnlock } from 'react-icons/all';
import { Dispatch, FC, SetStateAction } from 'react';
import bigNumberishToNumber from 'utils/bigNumberishToNumber';
import { useWeb3React } from '@web3-react/core';
import { FaLock } from 'react-icons/fa';
import { RewardProgram, useRewardPrograms } from 'store/rewardPrograms';
import { CrucibleLock as Lock, STATUS } from 'types';
import formatNumber from 'utils/formatNumber';
import { useSubscriptions } from 'store/subscriptions';
import { Crucible } from 'store/crucibles';
import { useModal } from 'store/modals';
import { ModalType } from 'components/modals/types';
import { useCrucibleAssets } from 'store/crucibleAssets';

type Props = {
  lock: Lock;
  rewardProgram?: RewardProgram;
  setTabIndex: Dispatch<SetStateAction<number>>;
  crucible: Crucible;
};

const CrucibleLock: FC<Props> = ({
  lock,
  rewardProgram,
  setTabIndex,
  crucible,
}) => {
  const { setCurrentRewardProgram } = useRewardPrograms();
  const { subscriptionsLoading } = useSubscriptions();
  const { status: crucibleAssetsStatus } = useCrucibleAssets();
  const { chainId = 1 } = useWeb3React();
  const { openModal } = useModal();

  const handleViewClick = (rewardProgramAddress: string) => {
    setCurrentRewardProgram(chainId, rewardProgramAddress);
    setTabIndex(1);
  };

  const handleUnsubscribeClick = async (rewardProgramAddress: string) => {
    setCurrentRewardProgram(chainId, rewardProgramAddress);
    openModal(ModalType.claimRewards, {
      crucibleId: crucible.id,
      subscriptionIdx: 0,
    });
  };

  return (
    <Grid templateColumns='repeat(16, 1fr)' gap={6}>
      <GridItem colSpan={[16, 6]}>
        <Flex>
          <Box
            boxSize='32px'
            bgGradient='linear(to-tr, cyan.200, purple.100)'
            borderRadius='md'
            mr={2}
          />
          <Tooltip
            hasArrow
            label={
              <Text>
                {bigNumberishToNumber(
                  lock.subscribedToken.value.amount
                ).toString()}{' '}
                <strong>{lock.subscribedToken.symbol}</strong>
              </Text>
            }
            bg='gray.800'
            color='white'
            placement='top'
          >
            <Tag bg='gray.50' maxW='210px' minW='60px' color='gray.800'>
              <TagLeftIcon boxSize='12px' as={FaLock} />
              <TagLabel>
                {formatNumber.token(lock.subscribedToken.value.amount)}{' '}
                <strong>{lock.subscribedToken.symbol}</strong>
              </TagLabel>
            </Tag>
          </Tooltip>
        </Flex>
      </GridItem>
      <GridItem colSpan={[16, 10]} width='100%'>
        <Flex alignItems='center'>
          <Text
            textAlign='left'
            width='100%'
            maxWidth={['200px', '100%']}
            isTruncated
          >
            {rewardProgram?.name} Reward Program
          </Text>
          <Menu>
            <MenuButton
              as={IconButton}
              aria-label='Options'
              height='30px'
              width='40px'
              icon={
                <Circle
                  size='30px'
                  bg='gray.300'
                  color='white'
                  cursor='pointer'
                >
                  <BsThreeDotsVertical />
                </Circle>
              }
              variant='outline'
            />
            <MenuList>
              <MenuGroup
                color='white'
                title={`You have ${lock.subscriptionCount} ${
                  rewardProgram?.name
                }  subscription${lock.subscriptionCount > 1 ? 's' : ''}`}
              >
                <MenuItem
                  icon={<VscOpenPreview />}
                  color='white'
                  onClick={() =>
                    handleViewClick(rewardProgram?.address as string)
                  }
                >
                  View {rewardProgram?.name} rewards
                </MenuItem>
                <MenuItem
                  isDisabled={
                    subscriptionsLoading ||
                    crucibleAssetsStatus === STATUS.UPDATING
                  }
                  icon={<BsUnlock />}
                  color='white'
                  onClick={() =>
                    handleUnsubscribeClick(rewardProgram?.address as string)
                  }
                >
                  Unsubscribe & Claim
                  {(subscriptionsLoading ||
                    crucibleAssetsStatus === STATUS.UPDATING) && (
                    <Spinner size='sm' />
                  )}
                </MenuItem>
              </MenuGroup>
            </MenuList>
          </Menu>
        </Flex>
      </GridItem>
    </Grid>
  );
};

export default CrucibleLock;
