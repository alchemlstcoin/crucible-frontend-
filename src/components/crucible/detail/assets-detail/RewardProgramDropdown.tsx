import {
  Menu,
  MenuButton,
  Portal,
  MenuList,
  MenuItem,
  Flex,
  Text,
  HStack,
  Badge,
  Stack,
} from '@chakra-ui/react';
import { useRewardPrograms } from 'store/rewardPrograms';
import { useWeb3React } from '@web3-react/core';
import { FaCaretDown } from 'react-icons/fa';
import { useBlocktime } from 'hooks/useBlocktime';
import dayjs from 'dayjs';

const RewardProgramDropdown: React.FC = () => {
  const { chainId = 1 } = useWeb3React();
  const { blockTimestamp, blockTimestampLoading } = useBlocktime();
  const { currentRewardProgram, rewardPrograms, setCurrentRewardProgram } =
    useRewardPrograms();

  const rewardProgramExpired = (expiryTimestamp?: number) => {
    return dayjs
      .unix(expiryTimestamp as number)
      .isBefore(dayjs.unix(blockTimestamp));
  };

  return (
    <Stack bg='purple.200' color='white'>
      <Menu placement='bottom' matchWidth offset={[0, 0]}>
        {({ onClose }) => (
          <>
            <MenuButton py={2} px={4}>
              <Flex justifyContent='space-between' alignItems='center'>
                <Text
                  isTruncated
                  maxW={['180px', '100%']}
                  verticalAlign='middle'
                >
                  <strong>{currentRewardProgram.name}</strong> Reward Program
                </Text>
                <HStack>
                  <Badge bg='white' borderRadius='xl' p={2} color='purple.300'>
                    {currentRewardProgram.shortName}
                  </Badge>
                  <FaCaretDown />
                </HStack>
              </Flex>
            </MenuButton>
            <Portal>
              <MenuList maxHeight='240px' overflowY='auto' width='100%'>
                {rewardPrograms[chainId].map((rewardProgram) => (
                  <MenuItem
                    key={rewardProgram.name}
                    onClick={() => {
                      setCurrentRewardProgram(chainId, rewardProgram.address);
                      onClose();
                    }}
                  >
                    <Flex width='100%' justifyContent='space-between'>
                      <Text>{rewardProgram.name}</Text>
                      <Text>
                        {!blockTimestampLoading &&
                          rewardProgramExpired(rewardProgram.expiryTimestamp) &&
                          'ended'}
                      </Text>
                    </Flex>
                  </MenuItem>
                ))}
              </MenuList>
            </Portal>
          </>
        )}
      </Menu>
    </Stack>
  );
};

export default RewardProgramDropdown;
