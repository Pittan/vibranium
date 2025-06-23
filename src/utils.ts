import { readFile, writeFile as fsWriteFile, access, constants, stat } from 'node:fs/promises'
import { dirname } from 'node:path'
import inquirer from 'inquirer'
import type { ChromeProfile } from './browsers/chromium-based-browsers.js'

export async function openJson<T>(path: string): Promise<T> {
  try {
    const data = await readFile(path, 'utf-8')
    return JSON.parse(data) as T
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Failed to read JSON file: ${error.message}`)
    }
    throw error
  }
}

export async function writeConfiguration<T>(
  path: string,
  configuration: T
): Promise<void> {
  const data = JSON.stringify(configuration)
  await fsWriteFile(path, data, 'utf-8')
}

export async function isFileExisting(path: string): Promise<boolean> {
  try {
    await access(path, constants.F_OK)
    return true
  } catch {
    return false
  }
}

export async function isDirectory(path: string): Promise<boolean> {
  try {
    const stats = await stat(path)
    return stats.isDirectory()
  } catch {
    return false
  }
}

export function getValidPath(path: string | undefined, defaultPath: string): string {
  return path || defaultPath
}

export async function writeFile(
  path: string,
  data: string,
  options: { force?: boolean } = {}
): Promise<void> {
  const exists = await isFileExisting(path)
  
  if (exists && !options.force) {
    const response = await inquirer.prompt<{ overwrite: boolean }>([
      {
        type: 'confirm',
        name: 'overwrite',
        message: `File ${path} already exists. Overwrite?`,
        default: false
      }
    ])
    
    if (!response.overwrite) {
      throw new Error('File write cancelled by user')
    }
  }
  
  const dir = dirname(path)
  const dirExists = await isDirectory(dir)
  
  if (!dirExists) {
    throw new Error(`Directory ${dir} does not exist`)
  }
  
  await fsWriteFile(path, data, 'utf-8')
}

export async function writeVibraniumPreferences<T>(
  path: string,
  data: T,
  options: { force?: boolean } = {}
): Promise<void> {
  const formatted = JSON.stringify(data, null, 2)
  await writeFile(path, formatted, options)
}

export async function chooseProfile(
  profiles: ChromeProfile[],
  action: string
): Promise<ChromeProfile> {
  if (profiles.length === 0) {
    throw new Error('No Chrome profiles found')
  }
  
  if (profiles.length === 1) {
    const profile = profiles[0]
    if (!profile) {
      throw new Error('Invalid profile data')
    }
    return profile
  }
  
  const choices = profiles.map(profile => ({
    name: profile.profileName,
    value: profile
  }))
  
  const response = await inquirer.prompt<{ profile: ChromeProfile }>([
    {
      type: 'list',
      name: 'profile',
      message: `Which profile do you want to ${action}?`,
      choices
    }
  ])
  
  return response.profile
}