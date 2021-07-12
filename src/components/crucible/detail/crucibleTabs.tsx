import React, { FC } from 'react';
import Rewards from 'components/crucible/detail/assets-detail/Rewards';
import Assets from 'components/crucible/detail/assets';
import { Box } from '@chakra-ui/layout';
import { Tab, TabList, TabPanel, TabPanels, Tabs } from '@chakra-ui/tabs';
import { Crucible } from 'store/crucibles';
import SubscribedPrograms from './assets-detail/SubscribedPrograms';

type Props = {
  crucible: Crucible;
};
const CrucibleTabs: FC<Props> = ({ crucible }) => {
  const tabProps = {
    borderRadius: 'lg',
    fontWeight: 'bold',
    fontSize: ['0.7rem', 'sm'],
    _selected: { color: 'gray.800', bg: 'cyan.400' },
  };

  const [tabIndex, setTabIndex] = React.useState(1);

  return (
    <Box position='relative'>
      <Tabs
        index={tabIndex}
        align='center'
        noOfLines={1}
        isFitted
        onChange={setTabIndex}
      >
        <TabList bg='gray.700' borderRadius='xl' border='none' p={2}>
          <Tab {...tabProps}>Transfer</Tab>
          <Tab {...tabProps}>Rewards</Tab>
          <Tab {...tabProps}>Inventory</Tab>
        </TabList>
        <TabPanels>
          <TabPanel px={0} pb={0}>
            <Assets crucible={crucible} />
          </TabPanel>
          <TabPanel px={0} pb={0}>
            <Rewards crucible={crucible} />
          </TabPanel>
          <TabPanel px={0} pb={0}>
            <SubscribedPrograms crucible={crucible} setTabIndex={setTabIndex} />
          </TabPanel>
        </TabPanels>
      </Tabs>
    </Box>
  );
};

export default CrucibleTabs;
