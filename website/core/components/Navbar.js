const React = require('react');
const { Box, Flex, Dropdown, DefaultDropdown } = require('@makerdao/ui-components-core');

const Logo = () => (
  <a href="/">
    <img src={'/img/makerLogo.svg'}/>
  </a>
);

const NavActionContainer = () => (
  <Box bg='blue'>
    LINKS
  </Box> 
);

class Navbar extends React.Component {
  constructor(props) {
    super(props)
    
    this.state = {
      mobileMenuOpen: false
    }
  }
  render() {
    const { headerLinks, docPaths } = this.props;
    console.log(headerLinks, docPaths)
    return (
      <Box
        width='100%'
        position='relative'
      >
        <Flex
          p='2rem 2.5rem 1.4rem 2.5rem'
          maxWidth='1140px'
          m= '0 auto'
          justifyContent='space-between'
          align-items='center'
        >
          <Logo/>
        </Flex>
        <Box display={this.state.mobileMenuOpen ? "none" : "flex"}>
          {headerLinks.map(item => {
            if (item.language) 
              return null;
            return (
              <Box
                pl='90px'
                key={item.label}
                display={["none", "none", "block"]}>
                <Dropdown>
                </Dropdown>
              </Box>
            );
          })}
        </Box>
      </Box>
    );
  }
}

module.exports = Navbar;
