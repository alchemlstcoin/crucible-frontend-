import React, { FC, useEffect, useState } from 'react';
import Logo from 'components/shared/logo';
import { Flex, GridItem, Grid, Box } from '@chakra-ui/layout';
import UserBalance from 'components/user/userBalance';
import UserWallet from 'components/user/userWallet';
import styled from '@emotion/styled';
import { Collapse, useDisclosure } from '@chakra-ui/react';
import { GiHamburgerMenu } from 'react-icons/all';

const StickyGrid = styled(Grid)`
  transition: background-color 0.2s ease;
`;

const Header: FC = () => {
  const [scrolled, setScrolled] = useState(false);
  const { isOpen, onToggle } = useDisclosure();

  useEffect(() => {
    const callback = () => {
      setScrolled(window.pageYOffset > 0);
    };

    window.addEventListener('scroll', () => callback());
    return window.removeEventListener('scroll', () => callback());
  }, []);

  // @ts-ignore
  return (
    <>
      <StickyGrid
        py={[3, 4]}
        templateColumns={'repeat(12, 1fr)'}
        bg={scrolled ? '#2a2a40' : 'rgba(0,0,0,0.1)'}
        alignItems='center'
        position='fixed'
        zIndex={99}
        width='100%'
        boxShadow={scrolled ? 'md' : undefined}
      >
        <GridItem colSpan={[2, null, 2, 4]} pl={4}>
          <Logo />
        </GridItem>
        <GridItem
          display={['none', null, 'block', 'block']}
          colSpan={[null, null, 5, 4]}
        >
          <Flex justifyContent='center'>
            <UserBalance />
          </Flex>
        </GridItem>
        <GridItem colSpan={[10, null, 5, 4]} pr={['none', null, 4, 4]}>
          <Flex justifyContent='flex-end'>
            <UserWallet />
            <Box
              pr={[4]}
              display={['flex', null, 'none']}
              justifyContent='center'
              flexDirection='column'
              ml='15px'
              cursor='pointer'
            >
              <GiHamburgerMenu size={20} onClick={onToggle} />
            </Box>
          </Flex>
        </GridItem>
        <GridItem colSpan={12} display={['block', null, 'none']}>
          <Collapse in={isOpen} animateOpacity>
            <Flex justifyContent='center' mt={3}>
              <UserBalance />
            </Flex>
          </Collapse>
        </GridItem>
      </StickyGrid>
    </>
  );
};

export default Header;
