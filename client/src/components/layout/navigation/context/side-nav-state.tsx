import React from "react";

interface SideNavStateContextType {
    isOpen: boolean;
    setIsOpen: (v: boolean) => void;
}
  
export const SideNavStateContext = React.createContext<SideNavStateContextType>({
    isOpen: true,
    setIsOpen: () => {},
});

export const useSideNavStateContext = () => React.useContext(SideNavStateContext);