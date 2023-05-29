import React from "react";
import styled, { useTheme, ThemeInterface } from "styled-components";


interface Props {
    children: React.ReactNode;
  }

interface TextDisplayProps {
    theme: any;
}

const TextDisplay = styled.div<TextDisplayProps>`
    font-size: 1.2rem;
    margin-bottom: 2rem;
    color: ${(props: TextDisplayProps) => props.theme.colors.textPrimary};
    font-weight: ${(props: TextDisplayProps) => props.theme.fontWeights.bold};
`;

const Text: React.FC<Props> = ({ children }) => {
    const theme = useTheme();
    return (
        <TextDisplay theme={theme}>
            {children}
        </TextDisplay>
    );
};

export default Text;