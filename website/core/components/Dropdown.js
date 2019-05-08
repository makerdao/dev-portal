const React = require('react');
const styled = require('styled-components').default;
const { Box, Card, Link, Text } = require('@makerdao/ui-components-core');

var regex = new RegExp("^(http[s]?:\\/\\/(www\\.)?|ftp:\\/\\/(www\\.)?|www\\.){1}([0-9A-Za-z-\\.@:%_\+~#=]+)+((\\.[a-zA-Z]{2,3})+)(/(.)*)?(\\?(.)*)?");

const DropdownTitle = styled.div`
`;

const DropdownContainer = styled.div`
  border: 1px solid black
  cursor: pointer;
  margin: -25px;
  padding: 25px;
  z-index: 2000;
`;

const DropdownList = styled.div`
  filter: drop-shadow(rgba(159, 159, 159, 0.18) 0px 1px 2px);
  background-color: white;
  border-radius: 8px;
  border-width: 1px;
  border-style: solid;
  border-color: rgba(14, 16, 41, 0.2);
  border-image: initial;
  padding: 0.2rem 1.6rem;
  opacity: 0;
  transition: opacity 0.2s;
  overflow: visible;
  ${DropdownContainer}:hover & {
    opacity: 1;
  }
`;

const DropdownListItem = styled.div`
  padding: 8px;
`;

const NavItemText=styled(Text)`
  font-size: 1.6rem;
  color: rgb(98, 118, 133);
  line-height: 2.4rem;

`;

class Dropdown extends React.Component {
  constructor(props) {
    super(props)
    
  }
  render() {
    const { title, routes } = this.props;
    return (
      <>
        <DropdownContainer>
          <DropdownTitle>
            <Text fontSize='1.0rem' fontWeight='bold'>{ title }</Text>
          </DropdownTitle>
          <DropdownList>
            {routes.map(
              ({ label, url }, index) =>
                  <DropdownListItem key={index}>
                    { 
                      !regex.test(url) 
                      ? <Link href={url}>
                          <Text.p>{label}</Text.p>
                        </Link>
                      : <Link href={url} target="_blank">{label}</Link>
                    }
                  </DropdownListItem>
            )}
          </DropdownList>
        </DropdownContainer>
      </>
    );
  }
}

module.exports = Dropdown;
