const React = require('react');
const { Box, Flex } = require('@makerdao/ui-components-core');
const Dropdown = require('./Dropdown');

const Logo = () => (
  <a href="/">
    <img src={'/img/makerLogo.svg'}/>
  </a>
);

class Navbar extends React.Component {
  constructor(props) {
    super(props)
    
    this.state = {
      mobileMenuOpen: false
    }
  }
  render() {
    const { navRoutes } = this.props;
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
          <Box display={this.state.mobileMenuOpen ? "none" : "flex"}>
            { navRoutes.map(item => 
                            <Box 
                              pl='90px'
                              key={item.label} 
                              display={["none", "none", "block"]}>
                              <Dropdown
                                { ...item }
                              />
                            </Box>
                           )}
          </Box>
        </Flex>
      </Box>
    );
  }
}

module.exports = Navbar;
