import React, { useEffect } from "react";
import styled from "styled-components";

import { useButtonClickedContext } from "../navigation/context/buttonClicked";
import { TypingEffect } from "../../text/typing-effect";
import Text from "../../text/text";


interface Props {
  children: React.ReactNode;
}

const ContentContainer = styled.div`
  flex: 1;
  padding: 1rem;
  margin-top: 45px;
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
      <TypingEffect text={"Lorem ipsum, etc."} isClicked={isClicked} />
    </ContentContainer>
  );
};

export default Content;
