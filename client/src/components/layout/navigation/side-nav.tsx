import React from 'react';
import styled from 'styled-components';

import Logo from '../../branding/logo';
import { useOrientationContext } from './context/orientation';
import { useSideNavStateContext } from './context/side-nav-state';
import { useButtonClickedContext } from './context/buttonClicked';

interface Link {
  text: string;
  href: string;
}

interface Props {
  links?: Link[];
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

// button with heart emoji and pink background
const ActivateButton = styled.button`
  background-color: #2a06ae;
  border: none;
  border-radius: 2%;
  color: white;
  cursor: pointer;
  width: 90%;
  margin: auto;
  padding: 0 1rem;
`;





const SideNav: React.FC<Props> = ({ links = [] }) => {
  const { isVertical } = useOrientationContext();
  const { isOpen, setIsOpen } = useSideNavStateContext();
  const { isClicked, setIsClicked } = useButtonClickedContext();

  const setOpen = () => {
    if (isVertical) {
      setIsOpen(false);
    } else {
      setIsOpen(true);
    }
  };

  React.useEffect(() => {
    setOpen();
  }, [isVertical]);

  const containerRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    setOpen();
    const handleClickOutside = (event: MouseEvent) => {
      if (
        isVertical &&
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        // Clicked outside the container
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleClicked = () => {
    setIsClicked(true);
    setOpen();
  };
  
  /*
      {links && links.length > 0 && (
       // renderLinks(links)
      )}

            <UserManagementContainer>
        <UserIcon src="user-icon.svg" alt="User Icon" />
        <NotificationIcon src="notification-icon.svg" alt="Notification Icon" />
      </UserManagementContainer>
  */


  return (
    <NavContainer ref={containerRef} className={`${isOpen ? '' : 'hidden'} ${isVertical ? 'absolute' : ''}`}>
      { !isVertical && (
        <LogoContainer>
          <Logo alt="logo"></Logo>
        </LogoContainer>
      )}
      <ActivateButton onClick={handleClicked}>ACTIVATE</ActivateButton>

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

const NavContainer = styled.nav`
    /* Additional styles for absolute positioning */
    &.absolute {
    position: absolute;
    top: 0;
    left: 0;
    z-index: 999;
  }

  display: flex;
  flex-direction: column;
  height: 100vh;
  width: 250px;
  background-color: #f0f0f0;

  transition: transform 0.3s ease; /* CSS transition for smooth animation */

  /* Additional styles for the hidden state */
  &.hidden {
    transform: translateX(-250px); /* Move the container off-screen */
  }
`;

const LogoContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 70px;
  background-color: #111111;
`;

const NavItemsContainer = styled.div`
  flex: 1;
  overflow-y: auto;
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
  color: #333;

  &:hover {
    background-color: #ddd;
  }
`;

const UserManagementContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 70px;
  background-color: #e6e6e6;
`;

const UserIcon = styled.img`
  height: 30px;
  margin-right: 10px;
`;

const NotificationIcon = styled.img`
  height: 30px;
`;

export default SideNav;
