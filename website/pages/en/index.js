/**
 * Copyright (c) 2017-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

const React = require('react');

const CompLibrary = require('../../core/CompLibrary.js');

const MarkdownBlock = CompLibrary.MarkdownBlock; /* Used to read markdown */
const Container = CompLibrary.Container;
const GridBlock = CompLibrary.GridBlock;
const styled = require('styled-components').default;
const { Card, Link } = require('@makerdao/ui-components');

class Index extends React.Component {
  render() {
    console.log(JSON.stringify(this.props, null, 4))
    const {config: siteConfig, language = ''} = this.props;
    const {baseUrl} = siteConfig;
    return (
      <div>
        <div className="mainContainer">
          <Card>
          </Card>
        </div>
      </div>
    );
  }
}

module.exports = Index;
