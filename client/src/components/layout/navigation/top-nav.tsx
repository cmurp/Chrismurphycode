import React from 'react';
import styled, { useTheme } from 'styled-components';

import Logo from '../../branding/logo';
import { useSideNavStateContext } from './context/side-nav-state';
import { BiMenuAltLeft } from 'react-icons/bi';
import { BiCog } from 'react-icons/bi';

interface TopNavigationProps {
  logo?: string;
  icon?: string;
  theme?: any;
}

const Navigation = styled.nav<TopNavigationProps>`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 2rem;
  background-color: ${(props: TopNavigationProps) => props.theme.colors.secondary};
  color: ${(props: TopNavigationProps) => props.theme.colors.textSecondary};
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 20px;
  z-index: 999;
`;

const Icon = styled.div`
  font-size: 24px;
`;

const Hamburger = styled.button`
  font-size: 1rem;
  background: none;
  color: teal;
  border: none;
  cursor: pointer;
`;

const TopNav: React.FC<TopNavigationProps> = ({ logo, icon }) => {
  const { isOpen, setIsOpen } = useSideNavStateContext();
  const theme = useTheme();

  const handleScroll = () => {
    const navigation = document.getElementById('top-nav');
    if (navigation && window.pageYOffset > 0) {
      navigation.classList.add('fixed');
    } else if (navigation) {
      navigation.classList.remove('fixed');
    }
  };

  React.useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleToggle = () => {
    setIsOpen(!isOpen);
  }; 


  return (
    <Navigation id="top-nav" theme={theme}>
      <Hamburger onClick={handleToggle}><BiMenuAltLeft/></Hamburger>
      {logo && <Logo alt="logo"></Logo>}
      {icon && <Icon><BiCog/></Icon>}

    </Navigation>
  );
};

TopNav.defaultProps = {
    logo: 'Logo',
    icon: 'Icon',
};

export default TopNav;