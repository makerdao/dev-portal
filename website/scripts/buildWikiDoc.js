import {
  ls,
  cat,
  mv,
  cp,
  exists,
  rm,
  mkdir,
  mkTmpDir,
  appendToStart
} from './cliCommands'
import git from 'simple-git/promise'
import path from 'path'

const transferWikiFiles = async ({ src, dst, files, wiki }) => {
  const wikiDstDir = path.join(dst, wiki.group, wiki.name)
  if (!(await exists(wikiDstDir))) {
    await mkdir(wikiDstDir)
  }
  return Promise.all(
    files.map(file => cp({
      src: path.join(src, wiki.name, file.name),
      dst: path.join(dst, wiki.group, wiki.name, file.name)
    }))
  )
}

const retrieveWiki = ({ wiki, route }) => new Promise(resolve => {
  if (!wiki.active) {
    resolve(null)
  } else {
    git(route)
      .clone(`https://github.com/makerdao/${wiki.name}.wiki.git`)
      .then(() => mv(`${route}/${wiki.name}.wiki`, `${route}/${wiki.name}`))
      .then(() => {
        resolve()
      })
  }
})

const yamlifyWiki = ({ files, route, wiki }) => Promise.all(
  files.map(file => appendToStart({
    content: `---\nid: ${file.id}\ntitle: ${file.title}\nsidebar_label: ${file.title}\n---\n`,
    route: path.join(route, wiki.name, file.name)
  }))
)

const parseWiki = async ({ name, route }) => {
  const sidebar = `${route}/${name}/_Sidebar.md`
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
        const name = `${id}.md`
        acc[xkey].push({ title, id, name })
        return acc
      default:
        return acc
      }
    }, {})
}

const genWikiSidebar = ({ name, group, category, subcategories }) => ({
  [ category ]: Object.keys(subcategories)
                      .map(subcategory => ({
                        "type": "subcategory",
                        "label": subcategory,
                        "ids": subcategories[subcategory].map(elem => (
                          path.join(group, name, elem.id)
                        ))
                      }))
})

const buildWikiDoc = async ({ wiki, dirs }) => {
  await retrieveWiki({ wiki, route: dirs.tmp })
  const wikiOrder = await parseWiki({ name: wiki.name, route: dirs.tmp })
  const files = [].concat(...Object.values(wikiOrder))
  await yamlifyWiki({
    files,
    route: dirs.tmp,
    wiki
  })
  await transferWikiFiles({
    src: dirs.tmp,
    dst: dirs.docs,
    files,
    wiki
  })
  return genWikiSidebar({
    name: wiki.name,
    group: wiki.group,
    category: wiki.label,
    subcategories: wikiOrder
  })
}

export default buildWikiDoc
