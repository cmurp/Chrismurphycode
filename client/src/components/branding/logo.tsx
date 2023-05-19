import React from 'react';
import styled from 'styled-components';

interface LogoProps {
  alt: string;
}

const StyledLogo = styled.img`
  max-width: 100%;
  max-height: 100%;
`;

//const logonum=Math.floor(Math.random() * 4) + 1;
const src = 'logo4.png';

const Logo: React.FC<LogoProps> = ({ alt }) => {
  return <StyledLogo src={src} alt={alt} />;
};

export default Logo;