"use strict";

var _fs = _interopRequireDefault(require("fs"));

var _tmp = _interopRequireDefault(require("tmp"));

var _promise = _interopRequireDefault(require("simple-git/promise"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const ls = (path = './') => new Promise((resolve, reject) => {
  _fs.default.readdir(path, (err, files) => err ? reject(err) : resolve(files));
});

const mv = (src, dst) => new Promise((resolve, reject) => {
  _fs.default.rename(src, dst, err => err ? reject(err) : resolve());
});

const cat = (path, encoding = 'utf8', parser = f => f) => new Promise((resolve, reject) => {
  _fs.default.readFile(path, encoding, (err, file) => err ? reject(err) : resolve(parser(file)));
});

const exists = path => new Promise(resolve => {
  _fs.default.access(path, _fs.default.constants.F_OK, err => err ? resolve(false) : resolve(true));
});

const mkTmpDir = () => new Promise((resolve, reject) => {
  _tmp.default.dir((err, path, cleanUpCallback) => {
    if (err) reject(err);
    console.log('New tmp directory created', path);
    resolve({
      path,
      clean: () => {
        console.log('cleaning');
      }
    });
  });
});

const cloneAllWikis = (list, path) => Promise.all(list.reduce((acc, entry) => {
  if (!entry.active) return acc;
  return [new Promise(async resolve => {
    await (0, _promise.default)(path).clone(`https://github.com/makerdao/${entry.name}.wiki.git`);
    await mv(`${path}/${entry.name}.wiki`, `${path}/${entry.name}`);
    resolve();
  }), ...acc];
}, []));

const parseSidebar = async wiki => {
  const sidebar = `${wiki}/_Sidebar.md`;
  let xkey;
  return (await cat(sidebar)).replace(new RegExp('1. ', 'g'), '').split('\n').filter(el => el !== '').reduce((acc, item) => {
    const firstChar = item.charAt(0);

    switch (firstChar) {
      case '#':
        xkey = item.split('#').pop().trim();
        return { ...acc,
          [xkey]: []
        };

      case '[':
        const id = item.match(/\[.+?\]/g)[0].slice(1, -1);
        const file = `${item.match(/\(.+?\)/g)[0].slice(1, -1).split('/').pop()}.md`;
        acc[xkey].push({
          id,
          file
        });
        return acc;

      default:
        return acc;
    }
  }, {});
};

async function main() {
  const {
    path
  } = await mkTmpDir();
  const whiteList = await cat('./scripts/whiteList.json', null, JSON.parse);
  console.log(whiteList);
  await cloneAllWikis(whiteList, path);
  const structure = await parseSidebar(`${path}/dai.js`);
  console.log(JSON.stringify(structure, null, 2));
}

;
main();