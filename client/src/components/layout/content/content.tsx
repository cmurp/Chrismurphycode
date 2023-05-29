import React, { useEffect } from "react";
import styled, { useTheme } from "styled-components";

import { useButtonClickedContext } from "../navigation/context/buttonClicked";
import { TypingEffect } from "../../text/typing-effect";
import Text from "../../text/text";

import { LIPSUM } from "../../../constants";

interface Props {
  children: React.ReactNode;
}

interface ContainerProps {
  theme: any;
}

const ContentContainer = styled.div<ContainerProps>`
  flex: 1;
  padding: 2rem;
  overflow-y: scroll;
  background-color: ${(props: ContainerProps) => props.theme.colors.main};
  color: ${(props: ContainerProps) => props.theme.colors.textPrimary};
`;


const Content: React.FC<Props> = ({ children }) => {
  const { isClicked, setIsClicked } = useButtonClickedContext();
  const theme = useTheme();

  return (
    <ContentContainer theme={theme}>
      {!isClicked && <Text>Click it.</Text>}
      <TypingEffect text={LIPSUM} isClicked={isClicked} speed={10} />

    </ContentContainer>
  );
};

export default Content;
