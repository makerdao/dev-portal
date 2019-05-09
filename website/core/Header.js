const React = require('react');
const MakerTheme = require('./MakerTheme');
const Navbar = require('./components/Navbar');

class Header extends React.Component {

  render() {
    return (
      <MakerTheme>
        <Navbar
          baseUrl={ this.props.config.baseUrl }
          navRoutes={ this.props.config.navRoutes }
        />
      </MakerTheme>
    );
  }
}

module.exports = Header;
