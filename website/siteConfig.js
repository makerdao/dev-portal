const React = require('react')
const ServerStyleSheet = require('styled-components').ServerStyleSheet
const renderToStaticMarkup = require('react-dom/server').renderToStaticMarkup
const fs = require('fs');

const buildNavRoutesFromSidebar = (rootKey) => {
  const docPaths = JSON.parse(fs.readFileSync('sidebars.json'));
  if (docPaths[rootKey] === undefined) return null;

  return Object.keys(docPaths[rootKey])
        .reduce((acc, label) => {
          acc.push({ 
            label,
            url: `/docs/${docPaths[rootKey][label][0]}`,
          });
          return acc;
        }, []);  
}

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
  url: 'https://makerdao.com/',
  baseUrl: '/',
  projectName: 'dev-portal',
  organizationName: 'makerdao',
  headerLinks: [],
  navRoutes: [
    { 
      title: 'Docs',
      routes: [
        ...buildNavRoutesFromSidebar('docs'),
      ] },
    { 
      title: 'Education',
      routes: [
        ...buildNavRoutesFromSidebar('education'),
        { label: 'Playground', url: '/playground' }
      ]},
    {
      title: 'Products', 
      routes: [
        { label: 'Development', url: 'https://cdp.makerdao.com/' },
        { label: 'Design', url: 'https://makerdao.com/ui-components/' },
        { label: 'Product Showcase', url: '/showcase' }
      ]
    },
    {
      title: 'Community',
      routes: [
        ...buildNavRoutesFromSidebar('community'),
        { label: 'Blog', url: '/blog' },
        { label: 'Bug Bounty', url: 'https://gitcoin.co/explorer' }
      ]
      
    }
  ],
  users,
  headerIcon: 'img/maker.svg',
  footerIcon: 'img/maker.svg',
  favicon: 'img/favicon.png',
  colors: {
    primaryColor: '#33E332',
    secondaryColor: '#187DA4'
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
