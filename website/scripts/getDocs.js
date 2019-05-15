import path from 'path'
import debug from 'debug'
import {
  ls,
  cat,
  rm,
  mkTmpDir
} from './cliCommands'
import buildWikiDoc from './buildWikiDoc'

const log = debug('log:build')

const removeFilesUnderPath = async ({ route }) => {
  const files = await ls(route);
  return Promise.all(
    files.map(f => rm(path.join(route, f)))
  )
};

const retrieveDirectories = async () => ({
  'pwd': process.cwd(),
  'docs': path.normalize(`${process.cwd()}/../docs`),
  'img': `${process.cwd()}/static/img`,
  'tmp': (await mkTmpDir())
})

const retrieveFiles = async () => ({
  'whiteList': (await cat('./whiteList.json', null, JSON.parse)),
  'sidebars': (await cat('./sidebars.json', null, JSON.parse)),
  'nav': (await cat('./nav.json', null, JSON.parse))
})

const main = async () => {
  const dirs = await retrieveDirectories();
  const files = await retrieveFiles();
  // will remove all files under docs whenscript is better visualised
  await removeFilesUnderPath({ route: path.join(dirs.docs, 'projects') })
  const res = await Promise.all(
    files.whiteList.map(wiki => buildWikiDoc({ wiki, dirs }))
  )
  log(JSON.stringify(res, null, 4));
}

main()
