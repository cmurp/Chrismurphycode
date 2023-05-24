import React, { useEffect } from "react";
import styled from "styled-components";

import { useButtonClickedContext } from "../navigation/context/buttonClicked";
import { TypingEffect } from "../../text/typing-effect";
import Text from "../../text/text";

import { LIPSUM } from "../../../constants";


interface Props {
  children: React.ReactNode;
}

const ContentContainer = styled.div`
  flex: 1;
  padding: 1rem;
  margin-top: 45px;
  overflow: scroll;
`;


const Content: React.FC<Props> = ({ children }) => {
  const { isClicked, setIsClicked } = useButtonClickedContext();

  useEffect(() => {
    if (isClicked) {
      console.log("clicked");
    }
  }, [isClicked, setIsClicked]);


  return (
    <ContentContainer>
      {!isClicked && <Text>Click it.</Text>}
      <TypingEffect text={LIPSUM} isClicked={isClicked} speed={10} />

    </ContentContainer>
  );
};

export default Content;
