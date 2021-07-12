import React, { FC } from 'react';
import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
} from '@chakra-ui/accordion';
import { Alert } from '@chakra-ui/alert';
import { Box, Link, Text } from '@chakra-ui/layout';
import { useConfig } from 'store/config';
import { useWeb3React } from '@web3-react/core';

const linkProps = {
  isExternal: true,
  color: 'blue.400',
};

const MintingHelper: FC = () => {
  const { chainId = 1 } = useWeb3React();
  const { mintCrucibleDoc, lpTokensDoc, aludelRewardsDoc } =
    useConfig(chainId).commonConfig;

  return (
    <Accordion allowMultiple mb={4}>
      <AccordionItem border='none'>
        <h2>
          <AccordionButton px={0} fontWeight='semibold' fontSize='xl'>
            <Box flex='1' textAlign='left'>
              How does it work?
            </Box>
            <AccordionIcon bg='gray.700' borderRadius='100%' />
          </AccordionButton>
        </h2>
        <AccordionPanel pb={4} textAlign='left' px={0}>
          <Alert borderRadius='xl' fontSize='sm'>
            <Text>
              <Link {...linkProps} href={mintCrucibleDoc}>
                Mint a Crucible
              </Link>{' '}
              with your{' '}
              <Link {...linkProps} href={lpTokensDoc}>
                LP tokens
              </Link>{' '}
              to subscribe to the{' '}
              <Link {...linkProps} href={aludelRewardsDoc}>
                Aludel Rewards program
              </Link>{' '}
              and earn MIST. A Crucible is an NFT that acts like a universal
              vault, capable of storing your LP tokens and subscribing them to
              participating rewards programs. Your rewards rate increases with
              the duration of your subscription and you can increase the
              quantity of subscribed LP at any time.
            </Text>
          </Alert>
        </AccordionPanel>
      </AccordionItem>
    </Accordion>
  );
};

export default MintingHelper;
