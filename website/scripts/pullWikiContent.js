import fs from 'fs';
import tmp from 'tmp';
import git from 'simple-git/promise';

const ls = (path = './') => new Promise((resolve, reject) => {
  fs.readdir(path, (err, files) => err ? reject(err) : resolve(files));
});

const mv = (src, dst) => new Promise((resolve, reject) => {
  fs.rename(src, dst, (err) => err ? reject(err) : resolve());
});

const cat = (path, encoder) => new Promise((resolve, reject) => {
  fs.readFile(path, (err, file) => err ? reject(err) : resolve(encoder(file)));
});

const mkTmpDir = () => new Promise((resolve, reject) => {
  tmp.dir((err, path, cleanUpCallback) => {
    if (err) reject(err);
    console.log('New tmp directory created', path);
    resolve({ 
      path,
      clean: () => {
        console.log('cleaning')
      } 
    });
  });
});

const cloneAllProjects = (list, path) => Promise.all(
  list.reduce((acc, entry) => {
    if (!entry.active) return acc;
    return [
      new Promise(async resolve => {
        await git(path).clone(`https://github.com/makerdao/${entry.name}.wiki.git`);
        await mv(`${path}/${entry.name}.wiki`, `${path}/${entry.name}`)
        resolve();
      }),
      ...acc
    ]
  }, [])
);

async function main() {
  const { path } = await mkTmpDir();
  const whiteList = await cat('./scripts/whiteList.json', JSON.parse);
  await cloneAllProjects(whiteList, path);
  console.log(whiteList);
  console.log(await ls(path)) 
};

main();
