vibranium
=========

CLI tool for managing custom emulated devices on Chrome  
**This is a beta version. Stable version is [here](https://github.com/Pittan/vibranium-legacy). **

[![oclif](https://img.shields.io/badge/cli-oclif-brightgreen.svg)](https://oclif.io)
[![Version](https://img.shields.io/npm/v/vibranium.svg)](https://npmjs.org/package/vibranium)
[![Downloads/week](https://img.shields.io/npm/dw/vibranium.svg)](https://npmjs.org/package/vibranium)
[![License](https://img.shields.io/npm/l/vibranium.svg)](https://github.com/Pittan/vibranium/blob/master/package.json)

<!-- toc -->
* [Usage](#usage)
* [Roadmap](#roadmap)
* [Commands](#commands)
<!-- tocstop -->
# Usage
```
$ npx @pittankopta/vibranium@beta export
$ npx @pittankopta/vibranium@beta export --browser chrome-canary
$ npx @pittankopta/vibranium@beta add vibranium.json
```
<!-- usage -->
```sh-session
$ npm install -g @pittankopta/vibranium
$ vibranium COMMAND
running command...
$ vibranium (-v|--version|version)
@pittankopta/vibranium/1.0.0-alpha.4 darwin-x64 node-v12.13.1
$ vibranium --help [COMMAND]
USAGE
  $ vibranium COMMAND
...
```
<!-- usagestop -->

# Roadmap
- [ ] 💚 Add test code
- [ ] 🤖 Add integration with CircleCI
- [ ] 💻 Test with Windows/Linux
- [ ] ✨ Add nice documentation site
- [ ] 👀 Add support for other Chromium-based browsers (e.g. Edge) 

# Commands
<!-- commands -->
* [`vibranium add FILE`](#vibranium-add-file)
* [`vibranium export [FILE]`](#vibranium-export-file)
* [`vibranium help [COMMAND]`](#vibranium-help-command)

## `vibranium add FILE`

Add custom emulated devices from a JSON config file.

```
USAGE
  $ vibranium add FILE

OPTIONS
  -b, --browser=browser  [default: chrome] Specify a browser (e.g. chrome-canary, chromium)
  -f, --force            Skip confirm when overwriting
  -h, --help             show CLI help
  -r, --replace          Replace all your existing emulated devices inside Chrome.

EXAMPLES
  - To add a custom device to your browser, simply type:
       $ vibranium add vibranium.json
       $ vibranium add path/to/the/config.json
  - If you want to swap all the devices with your config, type:
       $ vibranium add vibranium.json --replace
  - If you want to add settings to Chrome Canary, type:
       $ vibranium add --browser chrome-canary
```

_See code: [src/commands/add.ts](https://github.com/Pittan/vibranium/blob/v1.0.0-alpha.4/src/commands/add.ts)_

## `vibranium export [FILE]`

Export custom virtual device list from your Chrome browser.

```
USAGE
  $ vibranium export [FILE]

OPTIONS
  -b, --browser=browser  [default: chrome] Specify a browser (e.g. chrome-canary, chromium)
  -f, --force            Skip confirm when overwriting
  -h, --help             show CLI help

EXAMPLES
  - To export your custom emulated device settings, simply type:
       $ vibranium export
  - You can specify a directory/name for the output file with:
       $ vibranium export ./path/to/the/config.json
  - If you want to export settings from Chrome Canary, type:
       $ vibranium export --browser chrome-canary
```

_See code: [src/commands/export.ts](https://github.com/Pittan/vibranium/blob/v1.0.0-alpha.4/src/commands/export.ts)_

## `vibranium help [COMMAND]`

display help for vibranium

```
USAGE
  $ vibranium help [COMMAND]

ARGUMENTS
  COMMAND  command to show help for

OPTIONS
  --all  see all commands in CLI
```

_See code: [@oclif/plugin-help](https://github.com/oclif/plugin-help/blob/v3.1.0/src/commands/help.ts)_
<!-- commandsstop -->
