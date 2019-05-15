"use strict";

var _promise = _interopRequireDefault(require("simple-git/promise"));

var _path = _interopRequireDefault(require("path"));

var _debug = _interopRequireDefault(require("debug"));

var _cliCommands = require("./cliCommands");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const log = (0, _debug.default)('log:build');

const removeFilesUnderPath = async ({
  route
}) => {
  const files = await (0, _cliCommands.ls)(route);
  return Promise.all(files.map(f => (0, _cliCommands.rm)(_path.default.join(route, f))));
};

const transferWikiFiles = async ({
  src,
  dst,
  files,
  wiki
}) => {
  const wikiDstDir = _path.default.join(dst, wiki.group, wiki.name);

  if (!(await (0, _cliCommands.exists)(wikiDstDir))) {
    await (0, _cliCommands.mkdir)(wikiDstDir);
  }

  return Promise.all(files.map(file => (0, _cliCommands.cp)({
    src: _path.default.join(src, wiki.name, file.name),
    dst: _path.default.join(dst, wiki.group, wiki.name, file.name)
  })));
};

const retrieveWiki = ({
  wiki,
  route
}) => new Promise(resolve => {
  if (!wiki.active) {
    resolve(null);
  } else {
    (0, _promise.default)(route).clone(`https://github.com/makerdao/${wiki.name}.wiki.git`).then(() => (0, _cliCommands.mv)(`${route}/${wiki.name}.wiki`, `${route}/${wiki.name}`)).then(() => {
      log(`${wiki.label} cloned to ${route}`);
      resolve();
    });
  }
});

const yamlifyWiki = ({
  files,
  route,
  wiki
}) => Promise.all(files.map(file => (0, _cliCommands.appendToStart)({
  content: `---\nid: ${file.id}\ntitle: ${file.title}\nsidebar_label: ${file.title}\n---\n`,
  route: _path.default.join(route, wiki.name, file.name)
})));

const parseWiki = async ({
  name,
  route
}) => {
  const sidebar = `${route}/${name}/_Sidebar.md`;
  let xkey;
  return (await (0, _cliCommands.cat)(sidebar)).replace(new RegExp('1. ', 'g'), '').split('\n').filter(el => el !== '').reduce((acc, item) => {
    const firstChar = item.charAt(0);

    switch (firstChar) {
      case '#':
        xkey = item.split('#').pop().trim();
        return { ...acc,
          [xkey]: []
        };

      case '[':
        const title = item.match(/\[.+?\]/g)[0].slice(1, -1);
        const id = `${item.match(/\(.+?\)/g)[0].slice(1, -1).split('/').pop()}`;
        const name = `${id}.md`;
        acc[xkey].push({
          title,
          id,
          name
        });
        return acc;

      default:
        return acc;
    }
  }, {});
};

const genWikiSidebar = ({
  name,
  group,
  category,
  subcategories
}) => ({
  [category]: Object.keys(subcategories).map(subcategory => ({
    "type": "subcategory",
    "label": subcategory,
    "ids": subcategories[subcategory].map(elem => _path.default.join(group, name, elem.id))
  }))
});

const runWikiSetup = async ({
  wiki,
  dirs
}) => {
  await retrieveWiki({
    wiki,
    route: dirs.tmp
  });
  const wikiOrder = await parseWiki({
    name: wiki.name,
    route: dirs.tmp
  });
  const files = [].concat(...Object.values(wikiOrder));
  await yamlifyWiki({
    files,
    route: dirs.tmp,
    wiki
  });
  await transferWikiFiles({
    src: dirs.tmp,
    dst: dirs.docs,
    files,
    wiki
  });
  return genWikiSidebar({
    name: wiki.name,
    group: wiki.group,
    category: wiki.label,
    subcategories: wikiOrder
  });
};

const retrieveDirectories = async () => ({
  'pwd': process.cwd(),
  'docs': _path.default.normalize(`${process.cwd()}/../docs`),
  'img': `${process.cwd()}/static/img`,
  'tmp': await (0, _cliCommands.mkTmpDir)()
});

const retrieveFiles = async () => ({
  'whiteList': await (0, _cliCommands.cat)('./whiteList.json', null, JSON.parse),
  'sidebars': await (0, _cliCommands.cat)('./sidebars.json', null, JSON.parse),
  'nav': await (0, _cliCommands.cat)('./nav.json', null, JSON.parse)
});

const main = async () => {
  const dirs = await retrieveDirectories();
  const files = await retrieveFiles(); // will remove all files under docs whenscript is better visualised

  await removeFilesUnderPath({
    route: _path.default.join(dirs.docs, 'projects')
  });
  const res = await Promise.all(files.whiteList.map(wiki => runWikiSetup({
    wiki,
    dirs
  })));
  log(JSON.stringify(res, null, 4));
};

main();