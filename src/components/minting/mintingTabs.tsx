import { FC, useEffect, useRef, useState } from 'react';
import { Tab, TabList, TabPanel, TabPanels, Tabs } from '@chakra-ui/tabs';
import { Box, Heading } from '@chakra-ui/layout';
import CruciblesListView from 'components/crucible/cruciblesListView';
import MintingForm from 'components/minting/mintingForm';
import { useCrucibles } from 'store/crucibles';

const MintingTabs: FC = () => {
  const [tabIndex, setTabIndex] = useState(1);
  const { crucibles } = useCrucibles();

  let cruciblesLength = useRef(crucibles.length);

  useEffect(() => {
    if (cruciblesLength.current !== crucibles.length) {
      cruciblesLength.current = crucibles.length;
      setTabIndex(1);
    }
  }, [crucibles]);

  const tabProps = {
    borderRadius: 'lg',
    fontWeight: 'bold',
    fontSize: ['14px', '16px'],
    _selected: { color: 'purple.800', bg: 'cyan.400' },
  };

  return (
    <Box position='relative'>
      <Heading top={['-80px', '-120px']} position='absolute' width='100%'>
        {tabIndex === 0 ? 'Mint a Crucible' : 'Crucible Collection'}
      </Heading>
      <Tabs
        index={tabIndex}
        isFitted
        defaultIndex={tabIndex}
        onChange={(index) => setTabIndex(index)}
      >
        <TabList bg='gray.700' borderRadius='xl' border='none' p={2}>
          <Tab {...tabProps}>Mint</Tab>
          <Tab {...tabProps}>Your Crucibles</Tab>
        </TabList>

        <TabPanels>
          <TabPanel px={0} pb={0}>
            <MintingForm />
          </TabPanel>
          <TabPanel px={0} pb={0}>
            <CruciblesListView />
          </TabPanel>
        </TabPanels>
      </Tabs>
    </Box>
  );
};

export default MintingTabs;
