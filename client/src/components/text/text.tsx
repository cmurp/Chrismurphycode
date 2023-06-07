import React from "react";
import styled, { useTheme, ThemeInterface } from "styled-components";


interface Props {
    children: React.ReactNode;
  }

interface TextDisplayProps {
    theme: any;
}

const TextDisplay = styled.div<TextDisplayProps>`
    font-size: ${(props: TextDisplayProps) => props.theme.fontSizes.medium};
    margin-bottom: 2rem;
    color: ${(props: TextDisplayProps) => props.theme.colors.textPrimary};
    font-weight: ${(props: TextDisplayProps) => props.theme.fontWeights.bold};
    line-height: 1.5;  // A line-height of 1.5 is generally comfortable for reading.
    max-width: 35em;  // A max-width in "em" ensures a limit to the line length.
    margin: 0 auto;  // Centres the paragraph if it's less than the max-width.
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