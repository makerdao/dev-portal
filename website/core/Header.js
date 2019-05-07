const React = require('react');
const MakerTheme = require('./MakerTheme');
const Navbar = require('./components/Navbar');

class Header extends React.Component {

  render() {
    const { headerLinks, docPaths } = this.props.config;
    return (
      <MakerTheme>
        <Navbar
          headerLinks={ headerLinks }
          docPaths={ docPaths }
        />
      </MakerTheme>
    );
  }
}

module.exports = Header;
