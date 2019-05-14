"use strict";

var _fs = _interopRequireDefault(require("fs"));

var _tmp = _interopRequireDefault(require("tmp"));

var _promise = _interopRequireDefault(require("simple-git/promise"));

var _mv = _interopRequireDefault(require("mv"));

var _ncp = require("ncp");

var _rimraf = _interopRequireDefault(require("rimraf"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

_ncp.ncp.limit = 16;

const ls = (path = './') => new Promise((resolve, reject) => {
  _fs.default.readdir(path, (err, files) => err ? reject(err) : resolve(files));
});

const cat = (path, encoding = 'utf8', parser = f => f) => new Promise((resolve, reject) => {
  _fs.default.readFile(path, encoding, (err, file) => err ? reject(err) : resolve(parser(file)));
});

const mv = (src, dst) => new Promise((resolve, reject) => {
  (0, _mv.default)(src, dst, err => err ? reject(err) : resolve());
});

const cp = (src, dst) => new Promise((resolve, reject) => {
  (0, _ncp.ncp)(src, dst, err => err ? reject(err) : resolve());
});

const exists = path => new Promise(resolve => {
  _fs.default.access(path, _fs.default.constants.F_OK, err => err ? resolve(false) : resolve(true));
});

const rm = path => new Promise((resolve, reject) => {
  (0, _rimraf.default)(path, [], err => err ? reject(err) : resolve());
});

const mkdir = path => new Promise(async (resolve, reject) => {
  if (!(await exists(path))) {
    _fs.default.mkdir(path, err => err ? reject(err) : resolve());
  }

  resolve();
});

const appendToStart = (content, path) => new Promise(async (resolve, reject) => {
  const oldData = Buffer.from((await cat(path)));

  _fs.default.open(path, 'w+', (err, fd) => {
    if (err) reject(err);
    const newData = Buffer.from(content);

    _fs.default.write(fd, newData, 0, newData.length, 0, err => {
      if (err) reject(err);

      _fs.default.write(fd, oldData, 0, oldData.length, newData.length, err => {
        if (err) reject(err);
        resolve();
      });
    });
  });
});

const mkTmpDir = () => new Promise((resolve, reject) => {
  _tmp.default.dir((err, path, cleanUpCallback) => {
    if (err) reject(err);
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
  return [(0, _promise.default)(path).clone(`https://github.com/makerdao/${entry.name}.wiki.git`).then(() => mv(`${path}/${entry.name}.wiki`, `${path}/${entry.name}`)), ...acc];
}, []));

const addYmlToFiles = (list, tmpPath, project) => Promise.all(list.reduce((acc, entry) => {
  const content = `---\nid: ${entry.id}\ntitle: ${entry.title}\nsidebar_label: ${entry.title}\n---\n`;
  return [appendToStart(content, `${tmpPath}/${project}/${entry.id}.md`), ...acc];
}, []));

const parseSidebar = async (path, project) => {
  const sidebar = `${path}/${project}/_Sidebar.md`;
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
        const title = item.match(/\[.+?\]/g)[0].slice(1, -1);
        const id = `${item.match(/\(.+?\)/g)[0].slice(1, -1).split('/').pop()}`;
        acc[xkey].push({
          title,
          id
        });
        return acc;

      default:
        return acc;
    }
  }, {});
};

const transferFiles = async (src, dst, project, sources) => {
  await mkdir(`${dst}/${project}`);
  return Promise.all(sources.reduce((acc, entry) => [cp(`${src}/${project}/${entry.id}.md`, `${dst}/${project}/${entry.id}.md`)]));
};

const main = async () => {
  const docsPath = `${`${process.cwd()}`.split('/').slice(0, -1).join('/')}/docs/projects`;
  const {
    path: tmpPath
  } = await mkTmpDir();
  const whiteList = await cat('./scripts/whiteList.json', null, JSON.parse);
  await cloneAllWikis(whiteList, tmpPath);
  const structure = await parseSidebar(tmpPath, 'dai.js');
  console.log(JSON.stringify(structure, null, 2));
  const sources = [].concat(...Object.values(structure));
  await addYmlToFiles(sources, tmpPath, 'dai.js');
  const oldProjects = await ls(docsPath);
  await Promise.all(oldProjects.reduce((acc, folder) => [rm(`${docsPath}/${folder}`), ...acc], []));
  await transferFiles(tmpPath, docsPath, 'dai.js', sources);
  const {
    oldDocsStructure,
    ...rest
  } = JSON.parse((await cat('./sidebars.json')));
  const docs = {
    'Dai.js': Object.keys(structure).reduceRight((acc, name) => [{
      "type": "subcategory",
      "label": name,
      "ids": structure[name].map(elem => elem.id)
    }, ...acc], [])
  };
  console.log(JSON.stringify(docs, null, 2));
};

main();