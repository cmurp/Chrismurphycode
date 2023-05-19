import React from "react";

interface OrientationContextType {
    isVertical: boolean;
    setIsVertical: (v: boolean) => void;
}
  
export const OrientationContext = React.createContext<OrientationContextType>({
    isVertical: false,
    setIsVertical: () => {},
});

export const useOrientationContext = () => React.useContext(OrientationContext);