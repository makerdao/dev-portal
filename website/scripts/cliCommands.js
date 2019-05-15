import fs from 'fs'
import { ncp } from 'ncp'
import move from 'mv'
import rimraf from 'rimraf'
import tmp from 'tmp'

export const ls = (route = './') => new Promise((resolve, reject) => {
  fs.readdir(route, (err, files) => err ? reject(err) : resolve(files))
})

export const cat = (route, encoding='utf8', parser = (f) => f) => new Promise((resolve, reject) => {
  fs.readFile(route, encoding, (err, file) => err ? reject(err) : resolve(parser(file)))
})

export const mv = (src, dst) => new Promise((resolve, reject) => {
  move(src, dst, err => err ? reject(err) : resolve());
});

export const cp = ({ src, dst }) => new Promise((resolve, reject) => {
  ncp(src, dst, err => err ? reject(err) : resolve())
});

export const exists = (route) => new Promise(resolve => {
  fs.access(route, fs.constants.F_OK, (err) => err ? resolve(false) : resolve(true)) 
})

export const rm = (route) => new Promise((resolve, reject) => {
  rimraf(route, [], err => err ? reject(err) : resolve())
})

export const mkdir = (route) => new Promise(async (resolve, reject) => {
  if (!(await exists(route))) {
    fs.mkdir(route, err => err ? reject(err) : resolve())
  }
  resolve();
})

export const mkTmpDir = () => new Promise((resolve, reject) => {
  tmp.dir((err, route, cleanUpCallback) => err ? reject(err) : resolve(route))
})

export const appendToStart = ({ content, route }) => new Promise(
  async (resolve, reject) => {
    const oldData = Buffer.from(await cat(route));
    fs.open(route, 'w+', (err, fd) => {
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
  }
)
