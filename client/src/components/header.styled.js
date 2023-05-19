import styled from 'styled-components'

const StyledHeader = styled.div`
    display: block;
    margin: 0 auto;
    width: 100%;
    max-width: 100%;
    box-shadow: none;
    background-color: #FC466B;
    position: fixed;
    height: 60px!important;
    overflow: hidden;
    z-index: 10;
`

class Header extends React.Component {
    render() {
      return <StyledHeader></StyledHeader>;
    }
  }
