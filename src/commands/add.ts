import { confirm } from '@inquirer/prompts'
import {Args, Command, Flags} from '@oclif/core'

import {
  ChromePreference,
  CustomEmulatedDevice
} from '../utils/chromium-based-browsers.js'
import {
  chooseProfile,
  openJson
} from '../utils/index.js'

export default class Add extends Command {
  static override args = {
    file: Args.string({ name: 'file', required: true }),
  }
  static override description = 'Add custom emulated devices from a JSON config file.'
  static override examples = [
    `- To add a custom device to your browser, simply type:
    $ vibranium add vibranium.json
    $ vibranium add path/to/the/config.json`,
    `- If you want to swap all the devices with your config, type:
    $ vibranium add vibranium.json --replace`,
    `- If you want to add settings to Chrome Canary, type:
    $ vibranium add --browser chrome-canary`
  ]
  static override flags = {
    browser: Flags.string({ char: 'b', default: 'chrome', description: 'Specify a browser (e.g. chrome-canary, chromium, edge)' }),
    force: Flags.boolean({ char: 'f', description: 'Skip confirm when overwriting' }),
    help: Flags.help({ char: 'h' }),
    replace: Flags.boolean({ char: 'r', description: 'Replace all your existing emulated devices inside Chrome.' }),
  }

  public async run(): Promise<void> {
    const {args, flags} = await this.parse(Add)

    const browserPreference = new ChromePreference()
    const isLaunching = await browserPreference.isLaunching(flags.browser)
    if (isLaunching && !flags.force) {
      const browserName = browserPreference.getBrowserName(flags.browser)
      this.error(`${browserName} must be closed. use --force to run anyway.`)
      return
    }

    const profiles = await browserPreference.getProfileList(flags.browser)
    const profile = await chooseProfile(profiles, 'add device(s)')
    const configuration = await browserPreference.openConfiguration(profile.profileDirPath)
    const currentDevices = browserPreference.getCustomEmulatedDeviceList(configuration)
    const config = await openJson<CustomEmulatedDevice[]>(args.file)
    let list: CustomEmulatedDevice[] = currentDevices

    if (flags.replace) {
      const response = await confirm({
        default: false,
        message: 'It will replace all of your custom emulated devices. Continue?'
      })
      if (!response) {
        return
      }

      list = config
    } else {
      for (const c of config) {
        list.push(c)
        this.log(`  -> Added: ${c.title}`)
      }
    }

    const newConfiguration = browserPreference.setCustomEmulatedDeviceList(configuration, list)
    await browserPreference.saveConfiguration(newConfiguration, profile.profileDirPath)
  }
}
