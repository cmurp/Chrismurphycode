// This code uses the React.useEffect hook to add a resize listener to the window object. 
// It then uses the React.useState hook to set the initial value of the isWideScreen state variable to false. 
// The handleResize function is used to set the isWideScreen state variable to true if the window width is greater than 768px. 
// The handleResize function is called when the component is mounted, and when the window is resized. 
// The React.useEffect hook is used to call the handleResize function when the component is mounted, and when the window is resized.
// The navigation is rendered as a nav element when the isWideScreen state variable is true, and as an aside element when the isWideScreen state variable is false.

import React, { ReactNode } from "react";
import styled from "styled-components";

import SideNav from "./side-nav";
import TopNav from "./top-nav";
import { useOrientationContext } from "./context/orientation";
import { SideNavStateContext } from "./context/side-nav-state";

const NavContainer = styled.div`
  position: relative;
`

function Navigation() {
  const { isVertical } = useOrientationContext();
  const [isOpen, setIsOpen] = React.useState<boolean>(() => {
    return !isVertical;
  });


  return (
    <SideNavStateContext.Provider value={{ isOpen, setIsOpen }}>
    <NavContainer>
      {isVertical ? <TopNav /> : <></>}
      <SideNav />
    </NavContainer>
    </SideNavStateContext.Provider>
  )};

Navigation.defaultProps = {
  links: [],
};

export default Navigation;