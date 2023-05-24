import React, { useEffect } from "react";
import styled, { keyframes } from "styled-components";

import Text from "./text";

type NumberOneToTen = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10;

interface TypingEffectProps {
  text: string;
  isClicked: boolean;
  speed: NumberOneToTen;
}

const typingIndicatorAnimation = keyframes`
  0% {
    opacity: 0;
  }
  50% {
    opacity: 1;
  }
  100% {
    opacity: 0;
  }
`;

const TypingIndicator = styled.span`
  display: inline-block;
  margin-left: 4px;
  animation: ${typingIndicatorAnimation} 1s linear infinite;
`;

export const TypingEffect: React.FC<TypingEffectProps> = ({ text, isClicked, speed }) => {
  const [displayText, setDisplayText] = React.useState('');
  const [currentIndex, setCurrentIndex] = React.useState(0);
  const [showTypingIndicator, setShowTypingIndicator] = React.useState(true);

  const handleTyping = () => {
    if (currentIndex < text.length) {
      setDisplayText((prevText) => prevText + text[currentIndex]);
      setCurrentIndex((prevIndex) => prevIndex + 1);
    }
  };

  useEffect(() => {
    if (isClicked) {
      setCurrentIndex(0);
      setDisplayText('');
      setShowTypingIndicator(true);
    }
  }, [isClicked, text]);

  useEffect(() => {
    if (currentIndex < text.length && isClicked) {
      const typingInterval = setInterval(handleTyping, 10/speed); // Adjust typing speed as needed

      return () => {
        clearInterval(typingInterval);
      };
    }
  }, [currentIndex, isClicked, text]);

  useEffect(() => {
    if (displayText.length === text.length) {
      setShowTypingIndicator(false);
    }
  }, [displayText, text]);

  return (
    <Text>
      {displayText}
      {showTypingIndicator && <TypingIndicator>|</TypingIndicator>}
    </Text>
  );
};

TypingEffect.defaultProps = {
  speed: 10,
};