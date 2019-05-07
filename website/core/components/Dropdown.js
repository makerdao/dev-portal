const React = require('react');
const styled = require('styled-components').default;
const { Box, Card, Link } = require('@makerdao/ui-components-core');

var regex = new RegExp("^(http[s]?:\\/\\/(www\\.)?|ftp:\\/\\/(www\\.)?|www\\.){1}([0-9A-Za-z-\\.@:%_\+~#=]+)+((\\.[a-zA-Z]{2,3})+)(/(.)*)?(\\?(.)*)?");

const DropdownTitle = styled.div`
`;

const DropdownContainer = styled.div`
  cursor: pointer;
  margin: -25px;
  padding: 25px;
`;

const DropdownList = styled(Card)`
  opacity: 0;
  transition: opacity 0.2s;
  margin-top: 8px;
  ${DropdownContainer}:hover & {
    opacity: 1;
  }
`;

const DropdownListItem = styled.div`
  padding: 8px;
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
            { title }
          </DropdownTitle>
          <DropdownList>
            {routes.map(
              ({ label, url }, index) =>
                  <DropdownListItem key={index}>
                    { 
                      !regex.test(url) 
                      ? <Link href={url}>{label}</Link>
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
