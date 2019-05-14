import fs from 'fs'
import tmp from 'tmp'
import git from 'simple-git/promise'
import move from 'mv'
import { ncp } from 'ncp'
import rimraf from 'rimraf'

ncp.limit = 16

const ls = (path = './') => new Promise((resolve, reject) => {
  fs.readdir(path, (err, files) => err ? reject(err) : resolve(files))
})

const cat = (path, encoding='utf8', parser = (f) => f) => new Promise((resolve, reject) => {
  fs.readFile(path, encoding, (err, file) => err ? reject(err) : resolve(parser(file)))
})

const mv = (src, dst) => new Promise((resolve, reject) => {
  move(src, dst,  err => err ? reject(err) : resolve());
});

const cp = (src, dst) => new Promise((resolve, reject) => {
  ncp(src, dst, err => err ? reject(err) : resolve())
});

const exists = (path) => new Promise(resolve => {
  fs.access(path, fs.constants.F_OK, (err) => err ? resolve(false) : resolve(true)) 
})

const rm = (path) => new Promise((resolve, reject) => {
  rimraf(path, [],  err => err ? reject(err) : resolve())
})

const mkdir = (path) => new Promise(async (resolve, reject) => {
  if (!(await exists(path))) {
    fs.mkdir(path, err => err ? reject(err) : resolve())
  }
  resolve();
})

const appendToStart = (content, path) => new Promise(async (resolve, reject) => {
  const oldData = Buffer.from(await cat(path));
  fs.open(path, 'w+', (err, fd) => {
    if (err) reject(err);
    const newData = Buffer.from(content);
    fs.write(fd, newData, 0, newData.length, 0, (err) => {
      if (err) reject(err);
      fs.write(fd, oldData, 0, oldData.length, newData.length, (err) => {
        if (err) reject(err);
        resolve();
      });
    });
  })
});

const mkTmpDir = () => new Promise((resolve, reject) => {
  tmp.dir((err, path, cleanUpCallback) => {
    if (err) reject(err)
    resolve({
      path,
      clean: () => {
        console.log('cleaning')
      }
    })
  })
})

const cloneAllWikis = (list, path) => Promise.all(
  list.reduce((acc, entry) => {
    if (!entry.active) return acc
    return [
      git(path)
        .clone(`https://github.com/makerdao/${entry.name}.wiki.git`)
        .then(() => mv(`${path}/${entry.name}.wiki`, `${path}/${entry.name}`)),
      ...acc
    ]
  }, [])
)

const addYmlToFiles = (list, tmpPath, project) => Promise.all(
  list.reduce((acc, entry) => {
    const content = `---\nid: ${entry.id}\ntitle: ${entry.title}\nsidebar_label: ${entry.title}\n---\n`
    return [
      appendToStart(content, `${tmpPath}/${project}/${entry.id}.md`),
      ...acc
    ]
  }, []))

const parseSidebar = async (path, project) => {
  const sidebar = `${path}/${project}/_Sidebar.md`
  let xkey
  return (await cat(sidebar))
    .replace(new RegExp('1. ', 'g'), '')
    .split('\n')
    .filter(el => el !== '')
    .reduce((acc, item) => {
      const firstChar = item.charAt(0)
      switch (firstChar) {
      case '#':
        xkey = item.split('#').pop().trim()
        return {
          ...acc,
          [ xkey ]: [],
        }
      case '[':
        const title = item.match(/\[.+?\]/g)[0].slice(1, -1)
        const id = `${item.match(/\(.+?\)/g)[0].slice(1, -1).split('/').pop()}`
        acc[xkey].push({ title, id })
        return acc
      default:
        return acc
      }
    }, {})
}

const transferFiles = async (src, dst, project, sources) => {
  await mkdir(`${dst}/${project}`)
  return Promise.all(sources.reduce((acc, entry) => [
    cp(`${src}/${project}/${entry.id}.md`, `${dst}/${project}/${entry.id}.md`)
  ]))
}


const main = async () => {
  const docsPath = `${(`${process.cwd()}`).split('/').slice(0, -1).join('/')}/docs/projects`;
  const { path: tmpPath } = await mkTmpDir()
  const whiteList = await cat('./scripts/whiteList.json', null, JSON.parse)
  await cloneAllWikis(whiteList, tmpPath)
  const structure = await parseSidebar(tmpPath, 'dai.js')
  console.log(JSON.stringify(structure, null, 2))
  const sources = [].concat(...Object.values(structure))
  await addYmlToFiles(sources, tmpPath, 'dai.js')
  const oldProjects = await ls(docsPath);
  await Promise.all(oldProjects.reduce((acc, folder) => [
    rm(`${docsPath}/${folder}`),
    ...acc
  ], []))

  await transferFiles(tmpPath, docsPath, 'dai.js', sources)
  
  const { oldDocsStructure, ...rest } = JSON.parse((await cat('./sidebars.json')))
  const docs = {
    'Dai.js': Object.keys(structure)
                    .reduceRight((acc, name) => [
                      {
                        "type": "subcategory",
                        "label": name,
                        "ids": structure[name].map(elem => elem.id)
                      },
                      ...acc
                    ], [])
  }
  console.log(JSON.stringify(docs, null, 2));
}
main()
