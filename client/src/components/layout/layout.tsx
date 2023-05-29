import React, { Ref } from 'react';
import styled from 'styled-components';

import Content from './content/content';
import { OrientationContext } from './navigation/context/orientation';
import { ButtonClickedContext } from './navigation/context/buttonClicked';
import { SideNavStateContext } from "./navigation/context/side-nav-state";
import SideNav from "./navigation/side-nav";
import TopNav from "./navigation/top-nav";

interface Props {
  children: React.ReactNode;
  isVertical?: boolean;
}

const LayoutContainer = styled.div<Props>`
  display: flex;
  flex-direction: ${({ isVertical }: Props) => (isVertical ? 'column':'row')};
  height: 100vh;
  overflow: hidden;
`;

const links = [
    { text: 'Home', href: '/' },
    { text: 'About', href: '/about' },  
    { text: 'Contact', href: '/contact' },
];  

const NavContainer = styled.div`
  position: relative;
`;

const Layout: React.FC<Props> = ({ children }) => {
  const [isVertical, setIsVertical] = React.useState<boolean>(false);
  const [isClicked, setIsClicked] = React.useState<boolean>(false);
  const [isOpen, setIsOpen] = React.useState<boolean>(() => {
    return !isVertical; // start open for widescreen
  });
  const containerRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const handleResize = () => {
      setIsVertical(window.innerHeight > window.innerWidth);
    };
    handleResize();
    window.addEventListener('resize', handleResize);

    const handleClickOutside = (event: MouseEvent) => {
      if (
        isVertical &&
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false); // Clicked outside the container
      }
    };

    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      window.removeEventListener('resize', handleResize);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <OrientationContext.Provider value={{ isVertical, setIsVertical }}>
    <ButtonClickedContext.Provider value={{ isClicked, setIsClicked }}>
    <SideNavStateContext.Provider value={{ isOpen, setIsOpen }}>
    <LayoutContainer isVertical={isVertical}>
      <NavContainer ref={containerRef}>
        {isVertical ? <TopNav /> : <></>}
        <SideNav />
      </NavContainer>
      <Content>{children}</Content>
    </LayoutContainer>
    </SideNavStateContext.Provider>
    </ButtonClickedContext.Provider>
    </OrientationContext.Provider>
  );
};

export default Layout;
