const React = require('react');

const { Box } = require('@makerdao/ui-components-core');

class App extends React.Component {
  render() {

    const { config, language = 'en' } = this.props;
    return (
      <>
        <Box borderTop="1px solid black">
          This is the body
        </Box>
      </>
    );
  }
}

module.exports = App;
