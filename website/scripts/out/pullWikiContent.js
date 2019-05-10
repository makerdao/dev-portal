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

const cat = (path, encoder) => new Promise((resolve, reject) => {
  _fs.default.readFile(path, (err, file) => err ? reject(err) : resolve(encoder(file)));
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

const cloneAllProjects = (list, path) => Promise.all(list.reduce((acc, entry) => {
  if (!entry.active) return acc;
  return [new Promise(async resolve => {
    await (0, _promise.default)(path).clone(`https://github.com/makerdao/${entry.name}.wiki.git`);
    await mv(`${path}/${entry.name}.wiki`, `${path}/${entry.name}`);
    resolve();
  }), ...acc];
}, [])); // const tmpObj = tmp.dirSync();
// const dir = tmpObj.name;
// const whiteList = JSON.parse(fs.readFileSync('./scripts/whiteList.json'));
// const projectUrl = ({ name }) => y`;
// const cloneAllProjects = ({ list }) => {
//   list.map(project => {
//     console.log(project);
//     if (project.active) {
//       git.clone(projectUrl({ name: project.name }))
//     }
//   })
// }
// cloneAllProjects({
//   list: whiteList
// });
// tmpObj.removeCallback();
//const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));


async function main() {
  const {
    path
  } = await mkTmpDir();
  const whiteList = await cat('./scripts/whiteList.json', JSON.parse);
  await cloneAllProjects(whiteList, path);
  console.log(whiteList);
  console.log((await ls(path)));
}

;
main();