import { Command, flags } from '@oclif/command'
import {
  ChromePreference,
  CustomEmulatedDevice
} from '../browsers/chromium-based-browsers'
import {
  chooseProfile,
  openJson
} from '../utils'
import inquirer from 'inquirer'

export default class Add extends Command {
  static description = 'Add custom emulated devices from a JSON config file.'

  static flags = {
    help: flags.help({ char: 'h' }),
    force: flags.boolean({ char: 'f', description: 'Skip confirm when overwriting' }),
    browser: flags.string({ char: 'b', description: 'Specify a browser (e.g. chrome-canary, chromium, edge)', default: 'chrome' }),
    replace: flags.boolean({ char: 'r', description: 'Replace all your existing emulated devices inside Chrome.' }),
  }

  static examples = [
    `- To add a custom device to your browser, simply type:
    $ vibranium add vibranium.json
    $ vibranium add path/to/the/config.json`,
    `- If you want to swap all the devices with your config, type:
    $ vibranium add vibranium.json --replace`,
    `- If you want to add settings to Chrome Canary, type:
    $ vibranium add --browser chrome-canary`
  ]

  static args = [{ name: 'file', required: true }]

  async run (): Promise<void> {
    const { args, flags } = this.parse(Add)

    const browserPreference = new ChromePreference()
    const isLaunching = await browserPreference.isLaunching(flags.browser)
    if (isLaunching && !flags.force) {
      const browserName = browserPreference.getBrowserName(flags.browser)
      this.error(`${browserName} must be closed. use --force to run anyway.`)
      return
    }

    const profiles = browserPreference.getProfileList(flags.browser)
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
    await browserPreference.saveConfiguration(newConfiguration, profile.profileDirPath)
  }
}
