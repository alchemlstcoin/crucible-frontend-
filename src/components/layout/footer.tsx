import React, { FC } from 'react';
import { IconButton } from '@chakra-ui/button';
import { externalLinks } from 'config/links';
import { Box, Flex, HStack, Link as ChakraLink } from '@chakra-ui/layout';
import { __PROD__ } from 'utils/constants';
import { Switch } from '@chakra-ui/switch';
import { useFeatureFlag } from 'store/featureFlag';
import { FormControl, FormLabel } from '@chakra-ui/form-control';
import { useMediaQuery } from '@chakra-ui/react';

const Footer: FC = () => {
  const { toggleFlag } = useFeatureFlag();
  const [isLargerThan1200] = useMediaQuery('(min-width: 1200px)');

  return (
    <Flex
      p={4}
      alignItems='flex-end'
      flexDirection='column'
      position={isLargerThan1200 ? 'fixed' : 'inherit'}
      bottom={0}
      right={0}
    >
      {!__PROD__ && (
        <Box position='absolute' bottom={8} left={8}>
          <FormControl display='flex' alignItems='center'>
            <FormLabel mb='0'>1.3.0-b.3</FormLabel>
            <Switch
              onChange={() => toggleFlag('enableMultipleRewardPrograms')}
            />
          </FormControl>
        </Box>
      )}
      <Box>
        <HStack spacing={4}>
          {externalLinks.map(({ href, label, icon: Icon }) => (
            <ChakraLink
              key={label}
              href={href}
              fontSize='sm'
              isExternal
              _hover={{
                color: 'white',
              }}
            >
              <IconButton
                isRound
                aria-label={label}
                variant='ghost'
                color='white'
                icon={<Icon width='40px' height='40px' />}
                _hover={{
                  background: 'none',
                  boxShadow: '-1px -1px 0px 1px #2EDCFF',
                }}
              />
            </ChakraLink>
          ))}
        </HStack>
      </Box>
      <Box py={2}>
        <HStack spacing={4}>
          <ChakraLink
            href='https://alchemistcoin.typeform.com/to/YKYwcK3Y'
            target='_blank'
            isExternal
          >
            Feedback/Report
          </ChakraLink>
          <ChakraLink
            href='https://duneanalytics.com/alchemistcoin/Alchemist-Dashboard'
            target='_blank'
            isExternal
          >
            Stats
          </ChakraLink>
          <ChakraLink
            href='https://docs.alchemist.wtf/mist/crucible/getting-started'
            target='_blank'
          >
            FAQs
          </ChakraLink>
        </HStack>
      </Box>
    </Flex>
  );
};

export default Footer;
