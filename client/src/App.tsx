import './App.css';
import Layout from './components/layout/layout';
import { GlobalStyle } from './GlobalStyle';
import theme from './theme';

import { ThemeProvider } from 'styled-components';

function App() {
  return (
    <>
      <ThemeProvider theme={theme}>
        <GlobalStyle />
        <Layout>...</Layout>
      </ThemeProvider>
    </>
  );
}

export default App;