import { Command, flags } from '@oclif/command'
import {
  ChromePreference,
  CustomEmulatedDevice
} from '../browsers/google-chrome'
import {
  chooseProfile,
  openJson, writeConfiguration,
} from '../utils'
import inquirer from 'inquirer'

export default class Add extends Command {
  static description = 'Add custom emulated devices from a JSON config file.'

  static flags = {
    help: flags.help({ char: 'h' }),
    force: flags.boolean({ char: 'f' }),
    replace: flags.boolean({ char: 'r', description: 'Replace all your existing emulated devices inside Chrome.' }),
  }

  static args = [{ name: 'file', required: true }]

  async run (): Promise<void> {
    const { args, flags } = this.parse(Add)

    const browserPreference = new ChromePreference()
    const isLaunching = await browserPreference.isLaunching()
    if (isLaunching && !flags.force) {
      this.error('Chrome must be closed. use --force to run anyway.')
      return
    }

    const profiles = browserPreference.getProfileList()
    const profile = await chooseProfile(profiles, 'add device(s)')
    const configuration = await browserPreference.openConfiguration(profile.profileDirPath)
    const currentDevices = browserPreference.getCustomEmulatedDeviceList(configuration)
    const config = await openJson<CustomEmulatedDevice[]>(args.file)
    let list: CustomEmulatedDevice[] = currentDevices

    if (flags.replace) {
      const responses: any = await inquirer.prompt([{
        name: 'confirm',
        message: 'It will replace all of your custom emulated devices. Continue?',
        type: 'confirm',
        default: false
      }])
      if (!responses.confirm) {
        return
      }
      list = config
    } else {
      config.forEach(c => {
        list.push(c)
        this.log(`  -> Added: ${c.title}`)
      })
    }
    const newConfiguration = await browserPreference.setCustomEmulatedDeviceList(configuration, list)
    await writeConfiguration(newConfiguration, profile.profileDirPath)
  }
}
