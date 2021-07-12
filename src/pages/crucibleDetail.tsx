import { FC, useMemo, useState, useEffect } from 'react';
import { Center, Flex } from '@chakra-ui/layout';
import { Spinner } from '@chakra-ui/react';
import { useWeb3React } from '@web3-react/core';
import CrucibleDetailCard from 'components/crucible/detail/crucibleDetailCard';

const CrucibleDetail: FC = () => {
  const [accountLoading, setAccountLoading] = useState(true);
  const { account } = useWeb3React();

  // TODO: Change hacky workaround (wait for wallet to connect)
  useEffect(() => {
    setTimeout(() => {
      setAccountLoading(false);
    }, 300);
  }, []);

  const renderContent = useMemo(() => {
    if (accountLoading) {
      return (
        <Flex justifyContent='center' alignItems='center' flexGrow={1}>
          <Spinner />
        </Flex>
      );
    }

    if (!accountLoading && !account) {
      return (
        <Flex justifyContent='center' alignItems='center' flexGrow={1}>
          You must connect your wallet to view your crucible details
        </Flex>
      );
    }

    return <CrucibleDetailCard />;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [account, accountLoading]);

  return (
    <Center>
      <Flex
        p={[6, 10]}
        bg='purple.800'
        flexDir='column'
        mt={[20, 32, 40]}
        textAlign='center'
        width={['100%', '100%', 640]}
        borderRadius='3xl'
        boxShadow='xl'
        minH='400px'
      >
        {renderContent}
      </Flex>
    </Center>
  );
};

export default CrucibleDetail;
