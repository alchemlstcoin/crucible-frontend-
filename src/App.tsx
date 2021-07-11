import { FC, useEffect } from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
} from 'react-router-dom';
import { Flex, Box } from '@chakra-ui/layout';
import Footer from 'components/layout/footer';
import Header from 'components/layout/header';
import bg from 'img/bg_transparent.png';
import NoMatch from 'pages/noMatch';
import CrucibleDetail from 'pages/crucibleDetail';
import CrucibleMinting from 'pages/crucibleMinting';
import ModalRoot from 'components/modals/ModalRoot';
import { useEagerConnect } from 'hooks/useMetamaskEagerConnect';
import useTransactionPoller from 'store/transactions/useTransactionPoller';
import { useWeb3React } from '@web3-react/core';
import { useCrucibles } from 'store/crucibles';
import { useRewardPrograms } from 'store/rewardPrograms';
import { useCrucibleLocks } from 'store/crucibleLocks';
import { useWalletAssets } from 'store/walletAssets';
import { useBalances } from 'store/userBalances';

const App: FC = () => {
  useEagerConnect();
  useTransactionPoller();

  const { account, chainId } = useWeb3React();
  const { getOwnedCrucibles } = useCrucibles();
  const { getAssetsForWallet } = useWalletAssets();
  const { getLocksForAllCrucibles } = useCrucibleLocks();
  const { getUserBalances } = useBalances();
  const { setCurrentRewardProgram, defaultRewardProgramAddress } =
    useRewardPrograms();

  const getAssets = async () => {
    await getOwnedCrucibles();
    getLocksForAllCrucibles();
    getAssetsForWallet(account!);
  };

  useEffect(() => {
    if (account && chainId) {
      getUserBalances();
      getAssets();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chainId, account]);

  useEffect(() => {
    if (chainId) {
      setCurrentRewardProgram(chainId, defaultRewardProgramAddress[chainId]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chainId]);

  return (
    <>
      <ModalRoot />
      <Flex
        minHeight='100vh'
        flexDirection='column'
        background={`url(${bg})`}
        backgroundRepeat='no-repeat'
        backgroundAttachment='fixed'
        backgroundPosition='center'
        backgroundSize='cover'
      >
        <Router>
          <Header />
          <Box flexGrow={1} px={4} mt='100px'>
            <Switch>
              <Route
                exact
                path={process.env.PUBLIC_URL + '/'}
                component={CrucibleMinting}
              />
              <Route
                path={process.env.PUBLIC_URL + '/crucible/:crucibleId'}
                component={CrucibleDetail}
              />
              <Redirect from='/crucible/' to='/' />
              <Route path='*'>
                <NoMatch />
              </Route>
            </Switch>
          </Box>
          <Footer />
        </Router>
      </Flex>
    </>
  );
};

export default App;
