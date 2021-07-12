import React, { FC, useMemo } from 'react';
import { Center, Flex, Text, VStack } from '@chakra-ui/layout';
import { Spinner } from '@chakra-ui/spinner';
import { UnsupportedChainIdError, useWeb3React } from '@web3-react/core';
import MintingTabs from 'components/minting/mintingTabs';
import MintingGuide from 'components/minting/mintingGuide';
import { convertChainIdToNetworkName } from 'utils/convertChainIdToNetworkName';

const CrucibleMinting: FC = () => {
  const { account, chainId, error } = useWeb3React();
  const networkUnsupported = error instanceof UnsupportedChainIdError;

  const renderContent = useMemo(() => {
    if (networkUnsupported) {
      return (
        <Flex justifyContent='center' alignItems='center' flexGrow={1}>
          <VStack>
            <Spinner />
            <Text pt={4}>
              Unsupported network. Please switch to{' '}
              <strong>{convertChainIdToNetworkName(1)}</strong> to view your
              Crucibles.
            </Text>
          </VStack>
        </Flex>
      );
    }
    if (!account) {
      return <MintingGuide />;
    }
    return <MintingTabs />;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [account, networkUnsupported, chainId]);

  return (
    <Center>
      <Flex
        p={[6, 10]}
        bg='purple.800'
        flexDir='column'
        mt={[20, 32, 40]}
        textAlign='center'
        width={['100%', '100%', 497]}
        borderRadius='3xl'
        boxShadow='xl'
        minH='400px'
      >
        {renderContent}
      </Flex>
    </Center>
  );
};

export default CrucibleMinting;
