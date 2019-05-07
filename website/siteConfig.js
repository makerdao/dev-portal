const React = require('react')
const ServerStyleSheet = require('styled-components').ServerStyleSheet
const renderToStaticMarkup = require('react-dom/server').renderToStaticMarkup
const fs = require('fs');

const users = [
  {
    caption: 'Maker',
    image: '/img/maker.svg',
    infoLink: 'https://www.makerdao.com',
    pinned: true,
  },
];

const siteConfig = {
  title: 'MakerDAO Developer Portal',
  tagline: 'Live free or Dai hard!',
  url: 'https://developers.makerdao.com',
  baseUrl: '/',
  projectName: 'Maker DevPortal',
  organizationName: 'facebook',
  headerLinks: [
    {doc: 'getting-started/introduction', label: 'Docs'},
    {doc: 'learn/introduction', label: 'Learn'},
    {page: 'help', label: 'Products'},
    {href: 'https://blog.makerdao.com/', label: 'Community'}
  ],
  docPaths: JSON.parse(fs.readFileSync('sidebars.json')),
  users,
  headerIcon: 'img/maker.svg',
  footerIcon: 'img/maker.svg',
  favicon: 'img/favicon.png',
  colors: {
    primaryColor: heading,
    secondaryColor: makerOrange,
  },
  copyright: `Copyright © ${new Date().getFullYear()} MakerDAO`,
  highlight: {
    theme: 'default',
  },
  scripts: ['https://buttons.github.io/buttons.js'],
  onPageNav: 'separate',
  cleanUrl: true,
  ogImage: 'img/docusaurus.png',
  twitterImage: 'img/docusaurus.png',
  enableUpdateBy: true,
  enableUpdateTime: true,
  renderToString: element => {
    const sheet = new ServerStyleSheet()
    const collected = sheet.collectStyles(
      element
    );

    const html = renderToStaticMarkup(
      collected
    )
    const insertStylesAt = html.lastIndexOf('</body>')
    const tags = sheet.getStyleTags();

    return `
      <!DOCTYPE html>
      ${html.slice(0, insertStylesAt)}
      ${tags}
      ${html.slice(insertStylesAt)}
    `.trim()
  },
}

module.exports = siteConfig;
