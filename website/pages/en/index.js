const React = require('react');
const styled = require('styled-components');
const componentsCore = require('@makerdao/ui-components-core');
const CompLibrary = require('../../core/CompLibrary.js');
const MarkdownBlock = CompLibrary.MarkdownBlock; /* Used to read markdown */
const Container = CompLibrary.Container;
const GridBlock = CompLibrary.GridBlock;
const ThemeProvider = styled.ThemeProvider;

const App = require(`${process.cwd()}/core/App`);

class Index extends React.Component {
  render() {
    return (
      <ThemeProvider theme={componentsCore.themeLight}>
        <App { ...this.props }/>
      </ThemeProvider>
    );
  }
}

module.exports = Index;
