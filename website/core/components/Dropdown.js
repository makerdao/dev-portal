const React = require('react');
const styled = require('styled-components').default;
const { Box, Card } = require('@makerdao/ui-components-core');

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
    const { label, routes } = this.props;
    return (
      <>
        <DropdownContainer>
          <DropdownTitle>
            {label}
          </DropdownTitle>
          <DropdownList>
            {routes.map(
              (item, index) =>
                  <DropdownListItem key={index}>{item.label}</DropdownListItem>
            )}
          </DropdownList>
        </DropdownContainer>
      </>
    );
  }
}

module.exports = Dropdown;
