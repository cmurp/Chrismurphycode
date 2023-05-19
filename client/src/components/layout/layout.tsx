import React from 'react';
import styled from 'styled-components';
import Navigation from './navigation/navigation';
import Content from './content/content';
import { OrientationContext } from './navigation/context/orientation';
import { ButtonClickedContext } from './navigation/context/buttonClicked';

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

const Layout: React.FC<Props> = ({ children }) => {
  const [isVertical, setIsVertical] = React.useState<boolean>(false);
  const [isClicked, setIsClicked] = React.useState<boolean>(false);

  React.useEffect(() => {
    const handleResize = () => {
      setIsVertical(window.innerHeight > window.innerWidth);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <OrientationContext.Provider value={{ isVertical, setIsVertical }}>
    <ButtonClickedContext.Provider value={{ isClicked, setIsClicked }}>
    <LayoutContainer isVertical={isVertical}>
      <Navigation />
      <Content>{children}</Content>
    </LayoutContainer>
    </ButtonClickedContext.Provider>
    </OrientationContext.Provider>
  );
};

export default Layout;
