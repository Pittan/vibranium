import { confirm, select } from '@inquirer/prompts'
import beautify from 'json-beautify'
import fs from 'node:fs'
import Path from 'node:path'

import { ProfileInfo } from "./chrome-profile.js";
import {
    CustomEmulatedDevice
} from './chromium-based-browsers.js'

export async function openJson<T> (path: string): Promise<T> {
    return new Promise((resolve, reject) => {
        fs.readFile(path, 'utf8', (err, data) => {
            if (err) { reject(err) }
            try {
                const preference = JSON.parse(data)
                resolve(preference)
            } catch (error) {
                reject(error)
            }
        })
    })
}

export async function writeConfiguration<T> (config: T, path: string): Promise<void> {
    return new Promise((resolve, reject) => {
        fs.writeFile(path, JSON.stringify(config), err => {
            if (err) { reject(err) }
            resolve()
        })
    })
}

async function writeFile (path: string, data: string, force?: boolean): Promise<boolean> {
    const isExisting = await isFileExisting(path)
    return new Promise((resolve, reject) => {
        if (isExisting && !force) {
            // prompt
            confirm({
                default: false,
                message: `${path} is already existing. Overwrite?`,
            }).then((answer: boolean) => {
                if (!answer) {
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

async function isFileExisting (path: string): Promise<boolean> {
    return new Promise((resolve, reject) => {
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
    return new Promise((resolve, reject) => {
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
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    return writeFile(path, beautify(config, null, 2, 100), force)
}

export async function chooseProfile (profiles: ProfileInfo[], action: string): Promise<ProfileInfo> {
    if (profiles.length === 1) {
        return profiles[0]
    }

    const choice = await select<string>({
        choices: profiles.map(p => ({ name: p.displayName, value: p.displayName })),
        message: `Choose a profile you want to ${action}.`,
    })
    return profiles.find(p => p.displayName === choice) ?? profiles[0]
}
