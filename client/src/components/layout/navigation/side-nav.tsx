import React from 'react';
import styled, { useTheme } from 'styled-components';

import Logo from '../../branding/logo';
import { useOrientationContext } from './context/orientation';
import { useSideNavStateContext } from './context/side-nav-state';
import { useButtonClickedContext } from './context/buttonClicked';

import { BiChevronRight, BiChevronLeft } from 'react-icons/bi';
import { FaUserAstronaut } from 'react-icons/fa';
import { BiCog } from 'react-icons/bi'; 

interface Link {
  text: string;
  href: string;
}

interface Props {
  links?: Link[];
  theme?: any;
}

const renderLinks = (links: Link[]) => {
  return (
    <NavItemsContainer>
      <NavItems>
      {links.map((link) => (
        <NavItem key={link.text} href={link.href}>
          {link.text}
        </NavItem>
      ))}
      </NavItems>
    </NavItemsContainer>
  );
};

const SideNav: React.FC<Props> = ({ links = [] }) => {
  const { isVertical } = useOrientationContext();
  const { isOpen, setIsOpen } = useSideNavStateContext();
  const { isClicked, setIsClicked } = useButtonClickedContext();
  const theme = useTheme();

  const openForHorizontal = () => {
    if (!isVertical) {
      setIsOpen(true);
    } else {
      setIsOpen(false);
    }
  };
  
  React.useEffect(() => {
    openForHorizontal();
  }, []);

  React.useEffect(() => {
    openForHorizontal();
  }, [isVertical]);

  const handleClicked = () => {
    setIsClicked(true);
    setIsOpen(false);
  };
  
  return (
    <NavContainer className={`${isOpen ? '' : 'hidden absolute'} ${isVertical ? 'absolute' : ''}`}>
      { !isVertical && (
        <>
          <LogoContainer>
            <Logo alt="logo" />
          </LogoContainer>
      
          <HalfCircleButton onClick={() => {setIsOpen(!isOpen)}}>
            {isOpen ? <BiChevronLeft/> : <BiChevronRight/>}
          </HalfCircleButton>
        </>
      )}
      {links && links.length > 0 && renderLinks(links)}
      <ActivateButton onClick={handleClicked}>ACTIVATE</ActivateButton>
      <LogoContainer>
        <FaUserAstronaut />
        <BiCog />
      </LogoContainer>
    </NavContainer>
  );
};

SideNav.defaultProps = {
    links: [
        {text:"Home", href:""},
        {text:"About", href:""},
        {text:"Contact", href:""},
    ]
  };

interface ThemedProps {
  theme: any;
}

const NavContainer = styled.nav<ThemedProps>`
  /* Additional styles for absolute positioning */
  &.absolute {
    position: absolute;
    top: 0;
    left: 0;
    z-index: 999;
  }

  display: flex;
  flex-direction: column;
  justify-content: space-around;
  
  height: 100vh;
  width: 7rem;
  background-color: ${(props: ThemedProps) => props.theme.colors.secondary};
  color: ${(props: ThemedProps) => props.theme.colors.textSecondary};

  transition: transform 0.3s ease; /* CSS transition for smooth animation */

  /* Additional styles for the hidden state */
  &.hidden {
    transform: translateX(-7rem); /* Move the container off-screen */
  }
`;

const LogoContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-grow: 0;
  flex-shrink: 2;

  height: 3rem;
`;

// button with heart emoji and pink background
const ActivateButton = styled.button<Props>`
  border: none;
  border-radius: 2%;
  background-color: ${(props: ThemedProps) => props.theme.colors.accent};
  color: ${(props: ThemedProps) => props.theme.colors.textSecondary};
  cursor: pointer;
  width: 90%;
  margin: auto;
  padding: 0 1rem;
`;

const NavItemsContainer = styled.div`
  flex: 1;
  overflow-y: auto;

  display: flex;
  flex-direction: column;
  justify-content: center;
`;

const NavItems = styled.ul`
  list-style-type: none;
  padding: 0;
  margin: 0;
`;

const NavItem = styled.a`
  display: block;
  padding: 10px;
  text-decoration: none;
  color: ${(props: ThemedProps) => props.theme.colors.textSecondary};

  &:hover {
    background-color: ${(props: ThemedProps) => props.theme.colors.main};
  }
`;

const HalfCircleButton = styled.button`
  position: absolute;
  top: .1rem;
  left: 97%;
  width: .8rem;
  padding: 0;
  height: 2rem;
  border-radius: 0 2px 2px 0;
  background-color: ${(props: ThemedProps) => props.theme.colors.secondary};
  border: none;
  color: ${(props: ThemedProps) => props.theme.colors.textSecondary};
  font-size: 1rem;
  cursor: pointer;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

export default SideNav;
