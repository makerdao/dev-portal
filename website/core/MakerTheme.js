const React = require('react');
const styled = require('styled-components');
const componentsCore = require('@makerdao/ui-components-core');
const ThemeProvider = styled.ThemeProvider;

const MakerTheme = (props) => (
  <ThemeProvider theme={componentsCore.themeLight}>
    {props.children}
  </ThemeProvider>
);

module.exports = MakerTheme;
