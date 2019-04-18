const React = require('react');

function Sandbox(props) {
  return (
    <iframe
      src="https://codesandbox.io/embed/new?codemirror=1"
      style={{
        width: '100%',
        height: '100%',
        border: '0',
        borderRadius: '4px',
        overflow: 'hidden'
      }}
      sandbox="allow-modals allow-forms allow-popups allow-scripts allow-same-origin"
    />
  );
}

module.exports = Sandbox;
