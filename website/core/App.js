const React = require('react');

const Navbar = require('./components/Navbar');
const { Box } = require('@makerdao/ui-components-core');

class App extends React.Component {
  render() {

    const { config, language = 'en' } = this.props;
    return (
      <>
        <Navbar { ...config }/>
      </>
    );
  }
}

module.exports = App;
