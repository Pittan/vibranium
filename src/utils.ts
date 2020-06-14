import * as fs from 'fs'
import {
  ChromeProfile,
  CustomEmulatedDevice
} from './browsers/google-chrome'
import inquirer from 'inquirer'
import beautify from 'json-beautify'
import * as Path from 'path'

export async function openJson<T> (path: string): Promise<T> {
  return await new Promise((resolve, reject) => {
    fs.readFile(path, 'utf8', (err, data) => {
      if (err) { reject(err) }
      try {
        const preference = JSON.parse(data)
        resolve(preference)
      } catch (e) {
        reject(e)
      }
    })
  })
}

export async function writeConfiguration<T> (config: T, path: string): Promise<void> {
  return await new Promise((resolve, reject) => {
    fs.writeFile(path, JSON.stringify(config), err => {
      if (err) { reject(err) }
      resolve()
    })
  })
}

async function writeFile (path: string, data: any, force?: boolean): Promise<boolean> {
  const isExisting = await isFileExisting(path)
  return await new Promise((resolve, reject) => {
    if (isExisting && !force) {
      // prompt
      return inquirer.prompt([{
        type: 'confirm',
        name: 'overwrite',
        message: `${path} is already existing. Overwrite?`,
        default: false
      }]).then((answer: { overwrite: boolean }) => {
        if (!answer.overwrite) {
          resolve(false)
          return
        }
        fs.writeFile(path, data, err => {
          if (err) {
            reject(err)
            return
          }
          resolve(true)
        })
      })
    }
    fs.writeFile(path, data, err => {
      if (err) {
        reject(err)
        return
      }
      resolve(true)
    })
  })
}

async function isFileExisting (path: string): Promise<boolean> {
  return await new Promise((resolve, reject) => {
    fs.stat(path, (err, stats) => {
      if (err) {
        if (err.code === 'ENOENT') {
          resolve(false)
          return
        }
        reject(err)
        return
      }
      if (stats.isDirectory()) {
        reject(new Error('Path is a directory'))
        return
      }
      // is a file (override)
      resolve(true)
    })
  })
}

const DEFAULT_FILE_NAME = 'vibranium.json'
export async function getValidPath (path?: string): Promise<string> {
  return await new Promise((resolve, reject) => {
    if (!path) {
      resolve(Path.join(process.cwd(), DEFAULT_FILE_NAME))
      return
    }

    fs.stat(path, (err, stats) => {
      if (err) {
        if (err.code === 'ENOENT') {
          resolve(path)
          return
        }
        reject(err)
        return
      }
      if (stats.isDirectory()) {
        // is directory
        resolve(Path.join(path, DEFAULT_FILE_NAME))
        return
      }
      // is a file (override)
      resolve(path)
    })
  })
}

export async function writeVibraniumPreferences (config: CustomEmulatedDevice[], path: string, force?: boolean): Promise<boolean> {
  // @ts-expect-error
  return await writeFile(path, beautify(config, null, 2, 100), force)
}

export async function chooseProfile (profiles: ChromeProfile[], action: string): Promise<ChromeProfile> {
  if (profiles.length === 1) {
    return profiles[0]
  }
  return inquirer.prompt([{
    type: 'list',
    name: 'profile',
    message: `Choose a profile you want to ${action}.`,
    choices: profiles.map(p => p.displayName)
  }]).then((answer: { profile: string }) => {
    return profiles.find(p => p.displayName === answer.profile)
  })
}
