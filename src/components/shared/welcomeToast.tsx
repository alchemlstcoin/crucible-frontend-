import React, { FC } from 'react';
import { useEffect } from 'react';
import { useToast } from '@chakra-ui/toast';
import { Box, Link, Text } from '@chakra-ui/layout';
import { Image } from '@chakra-ui/image';
import { Button, IconButton } from '@chakra-ui/button';
import { IoCloseCircle } from 'react-icons/io5';
import { useMediaQuery } from '@chakra-ui/react';
import pot3d from 'img/pot-3d.png';

const WelcomeToast: FC = () => {
  const toast = useToast();
  const toastId = 'faqs-toast';
  const faqsToastClosed = localStorage.getItem('faqs-toast-closed');
  const [isLargerThan350] = useMediaQuery('(min-width: 351px)');

  const handleClose = () => {
    localStorage.setItem('faqs-toast-closed', 'true');
    toast.closeAll({ positions: ['bottom-left'] });
  };

  useEffect(() => {
    if (!toast.isActive(toastId) && !faqsToastClosed) {
      toast({
        id: toastId,
        duration: null,
        isClosable: true,
        position: 'bottom-left',
        render: () => (
          <Box
            m={4}
            p={6}
            bg='gray.700'
            position='relative'
            borderRadius='3xl'
            width={isLargerThan350 ? '330px' : 'auto'}
          >
            <Box ml={isLargerThan350 ? [24, 28] : 0}>
              <Text fontWeight='bold' mb={2}>
                First time minting a crucible?
              </Text>
              <Button
                as={Link}
                color='white'
                variant='outline'
                fontWeight='normal'
                borderWidth='2px'
                borderColor='cyan.400'
                isExternal
                isFullWidth
                href='https://docs.alchemist.wtf/mist/crucible/getting-started'
                _hover={{
                  textDecor: 'none',
                }}
              >
                Read FAQs
              </Button>
            </Box>
            <IconButton
              bg='none'
              top={1}
              right={1}
              position='absolute'
              fontSize='xl'
              color='gray.200'
              icon={<IoCloseCircle />}
              onClick={handleClose}
              aria-label='close toast'
              _hover={{ bg: 'none' }}
              _active={{ bg: 'none' }}
            />
            <Image
              src={pot3d}
              display={isLargerThan350 ? 'block' : 'none'}
              top={-10}
              left={0}
              height={['160px', '186px']}
              position='absolute'
            />
          </Box>
        ),
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return null;
};

export default WelcomeToast;
