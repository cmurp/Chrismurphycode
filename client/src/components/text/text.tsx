import React from "react";
import styled from "styled-components";


interface Props {
    children: React.ReactNode;
  }

const TextDisplay = styled.div`
    font-size: 1.2rem;
    font-weight: bold;
    margin-bottom: 1rem;
    color: teal;
`;

const Text: React.FC<Props> = ({ children }) => {
    return (
        <TextDisplay>
            {children}
        </TextDisplay>
    );
};

export default Text;