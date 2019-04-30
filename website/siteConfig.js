const React = require('react')
const ServerStyleSheet = require('styled-components').ServerStyleSheet
const renderToStaticMarkup = require('react-dom/server').renderToStaticMarkup

const { makerTeal, makerOrange, daiYellow, heading, linkBlue } = require("@makerdao/ui-components-core").themeLight.colors;

// List of projects/orgs using your project for the users page.
const users = [
  {
    caption: 'Maker',
    // You will need to prepend the image path with your baseUrl
    // if it is not '/', like: '/test-site/img/docusaurus.svg'.
    image: '/img/maker.svg',
    infoLink: 'https://www.makerdao.com',
    pinned: true,
  },
];

const siteConfig = {
  title: 'MakerDAO Developer Portal', // Title for your website.
  tagline: 'Live free or Dai hard!',
  url: 'https://developers.makerdao.com', // Your website URL
  baseUrl: '/', // Base URL for your project */
  // For github.io type URLs, you would set the url and baseUrl like:
  //   url: 'https://facebook.github.io',
  //   baseUrl: '/test-site/',

  // Used for publishing and more
  projectName: 'Maker DevPortal',
  organizationName: 'facebook',
  // For top-level user or org sites, the organization is still the same.
  // e.g., for the https://JoelMarcey.github.io site, it would be set like...
  //   organizationName: 'JoelMarcey'

  // For no header links in the top nav bar -> headerLinks: [],
  headerLinks: [
    {doc: 'getting-started/introduction', label: 'Documentation'},
    {page: 'education', label: 'Education'},
    {page: 'products', label: 'Products'},
    {page: 'community', label: 'Community'}
  ],

  // If you have users set above, you add it here:
  users,

  /* path to images for header/footer */
  headerIcon: 'img/maker.svg',
  footerIcon: 'img/maker.svg',
  favicon: 'img/favicon.png',

  /* Colors for website */
  colors: {
    primaryColor: heading,
    secondaryColor: makerOrange,
  },

  /* Custom fonts for website */
  /*
  fonts: {
    myFont: [
      "Times New Roman",
      "Serif"
    ],
    myOtherFont: [
      "-apple-system",
      "system-ui"
    ]
  },
  */

  // This copyright info is used in /core/Footer.js and blog RSS/Atom feeds.
  copyright: `Copyright © ${new Date().getFullYear()} MakerDAO`,

  highlight: {
    // Highlight.js theme to use for syntax highlighting in code blocks.
    theme: 'default',
  },

  // Add custom scripts here that would be placed in <script> tags.
  scripts: ['https://buttons.github.io/buttons.js'],

  // On page navigation for the current documentation page.
  onPageNav: 'separate',
  // No .html extensions for paths.
  cleanUrl: true,

  // Open Graph and Twitter card images.
  ogImage: 'img/docusaurus.png',
  twitterImage: 'img/docusaurus.png',

  // Show documentation's last contributor's name.
  enableUpdateBy: true,

  // Show documentation's last update time.
  enableUpdateTime: true,

  // You may provide arbitrary config keys to be used as needed by your
  // template. For example, if you need your repo's URL...
  //   repoUrl: 'https://github.com/facebook/test-site',
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
    console.log(tags)
    return `
      <!DOCTYPE html>
      ${html.slice(0, insertStylesAt)}
      ${tags}
      ${html.slice(insertStylesAt)}
    `.trim()
  },

}

module.exports = siteConfig;
