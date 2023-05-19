import React from "react";

interface ButtonClickedContextType {
    isClicked: boolean;
    setIsClicked: (v: boolean) => void;
}
  
export const ButtonClickedContext = React.createContext<ButtonClickedContextType>({
    isClicked: false,
    setIsClicked: () => {},
});

export const useButtonClickedContext = () => React.useContext(ButtonClickedContext);