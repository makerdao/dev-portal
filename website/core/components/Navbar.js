const React = require('react');
const styled = require('styled-components').default;
const { Box, Flex } = require('@makerdao/ui-components-core');
const Dropdown = require('./Dropdown');

const Logo = () => (
  <a href="/">
    <img src={'/img/makerLogo.svg'}/>
  </a>
);

const findTopLevelKey = ({ doc, paths }) => 
      Object.keys(paths)
            .find(topLevelKey =>
                  ([].concat.apply(
                    [], 
                    Object.values(paths[topLevelKey])
                  )).find(route => route === doc)
                  && topLevelKey)

const getDropdownRoutes = ({ paths, tlk }) =>
      Object.keys(paths[tlk])
        .reduce((acc, label) => {
          acc.push({ label, route: paths[tlk][label][0]});
          return acc;
        }, []);  

const NavDoc = ({ doc, label, paths }) => { 
  const tlk = findTopLevelKey({ doc, paths });
  const routes = getDropdownRoutes({ paths, tlk })
  return (
    <Box
      pl='90px'
      key={label}
      display={["none", "none", "block"]}>
      <Dropdown
        label={ label }
        routes={ routes }
      />
    </Box>
  )
}

const NavLink = ({ link, label }) => (
  <Box
    pl='90px'
    key={label}
    display={["none", "none", "block"]}>
    {label}
  </Box> 
)

class Navbar extends React.Component {
  constructor(props) {
    super(props)
    
    this.state = {
      mobileMenuOpen: false
    }
  }
  render() {
    const { headerLinks, docPaths } = this.props;
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
            {headerLinks.map(item => {
              if (item.language) 
                return null;
              switch(Object.keys(item)[0]) {
                case 'doc':
                  return <NavDoc { ...item } paths={ docPaths }/>;
                  break;
                case 'href':
                  return <NavLink link={ item.href } label={ item.label }/>
                  break;
                case 'page':
                  return <NavLink link={ item.page } label={ item.label }/>
                  break;
                default:
                  return null;
              }
            })}
          </Box>
        </Flex>
      </Box>
    );
  }
}

module.exports = Navbar;
