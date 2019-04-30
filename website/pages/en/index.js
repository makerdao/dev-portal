/**
 * Copyright (c) 2017-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

const React = require('react');
const styled = require('styled-components');
const componentsCore = require('@makerdao/ui-components-core');
const CompLibrary = require('../../core/CompLibrary.js');

const MarkdownBlock = CompLibrary.MarkdownBlock; /* Used to read markdown */
const Container = CompLibrary.Container;
const GridBlock = CompLibrary.GridBlock;
const ThemeProvider = styled.ThemeProvider;
const { Box, Text, Card, Button } = componentsCore;

class Index extends React.Component {
  render() {
    return (
      <ThemeProvider theme={componentsCore.themeLight}>
        <Box p="xl">
          <Text t="p2"> I'm a Big title</Text>
          <Card m="l" p="l"> I'm a card! </Card>
          <Button variant="primary"> hello world </Button>
        </Box>
      </ThemeProvider>
    );
  }
}

module.exports = Index;
