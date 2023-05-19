import './App.css';
import Layout from './components/layout/layout';

import styled from 'styled-components';

const Content = styled.main`
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  padding: 1rem;
`;

const MinContent = styled.div`
  width: min-content;
  color: black;
`;


function App() {
  return (
    <>
      <Layout>S:)</Layout>
    </>
  );
}

export default App;
