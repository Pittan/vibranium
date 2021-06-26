vibranium
=========
CLI for managing custom emulated devices on Chromium-based browsers.

[![oclif](https://img.shields.io/badge/cli-oclif-brightgreen.svg)](https://oclif.io)
[![Version](https://img.shields.io/npm/v/@pittankopta/vibranium.svg)](https://npmjs.org/package/@pittankopta/vibranium)
[![Downloads/week](https://img.shields.io/npm/dw/@pittankopta/vibranium.svg)](https://npmjs.org/package/@pittankopta/vibranium)
[![License](https://img.shields.io/npm/l/@pittankopta/vibranium.svg)](https://github.com/Pittan/vibranium/blob/master/package.json)

<!-- toc -->
* [🤔 What's this?](#-whats-this)
* [🚀 Getting started](#-getting-started)
* [✨Features](#features)
* [✅ OS / Browser support](#-os--browser-support)
* [🗺️ Roadmap](#️-roadmap)
* [🤖 Commands](#-commands)
* [📣 Feedback](#-feedback)
<!-- tocstop -->

# 🤔 What's this?
**Vibranium is a CLI that allows you to import/export custom device emulator settings in Chrome(or other Chromium-based browser) DevTools.**
If you use custom device emulator feature in Chrome DevTools, you might feel this is pretty handy.  Especially if you are a frontend-developer and dealing with WebView using _custom user agent_ , you're gonna love it!

If you are migrating to a new computer, vibranium can help you!  
If you want to share your custom device emulator settings with your colleagues, vibranium can help with that situation, too!  

# 🚀 Getting started
You can simply use this with typing:
```
$ npx @pittankopta/vibranium
```

...or you can install globally/locally

```
## Install globally
$ npm install -g @pittankopta/vibranium
$ vibranium --version

## Install locally
$ npm install @pittankopta/vibranium --dev
## ...or
$ yarn add @pittankopta/vibranium --dev
```

# ✨Features

## Export
You can export your custom device emulator settings.  
It will output as a JSON file, so you can put it under your version control.  
Profile feature is supported, so you can choose a profile to export.

```
$ npx @pittankopta/vibranium@beta export
$ npx @pittankopta/vibranium@beta export ./path/to/file.json
$ npx @pittankopta/vibranium@beta export --browser chrome-canary
```

## Add
Add a custom device settings from JSON file.  
Profile feature is supported, so you can choose a profile to add custom device settings.

```
$ npx @pittankopta/vibranium@beta add vibranium.json
$ npx @pittankopta/vibranium@beta add vibranium.json --browser chrome-canary
```

# ✅ OS / Browser support

You can select target browser using `--browser` command.  
Available option is `chrome` `chrome-canary` `chromium` `edge` `edge-beta` `edge-dev` `edge-canary`. (default is `chrome`.)
If your favorite browser is not listed below, feel free to contribute!


|  | macOS | Linux | Windows |
| ---: | :---: | :---: | :---: |
| Chrome | ✅ | 🏁 | ✅ |
| Chrome Canary | ✅ | 🏁 | ✅ |
| Chromium | ✅ | 🏁 | ✅ |
| Edge(Chromium based) | ✅ | - | 🏁 |
| Edge Beta(Chromium based) | ✅ | 🏁 | 🏁 |
| Edge Dev(Chromium based) | ✅ | 🏁 | 🏁 |
| Edge Canary(Chromium based) | ✅ | - | 🏁 |


- ✅: Supported / Tested  
- 🏁: Just implemented (Not tested)  
- \- : Not supported  

# 🗺️ Roadmap
- [ ] 💚 Add test code
- [ ] 🤖 Add integration with CircleCI
- [ ] 🐧 Test with Linux
- [ ] ✨ Add nice documentation site
- [x] 👀 Add support for other Chromium-based browsers (e.g. Edge) 

# 🤖 Commands
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
  -b, --browser=browser  [default: chrome] Specify a browser (e.g. chrome-canary, chromium, edge)
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

_See code: [src/commands/add.ts](https://github.com/Pittan/vibranium/blob/v1.1.0/src/commands/add.ts)_

## `vibranium export [FILE]`

Export custom virtual device list from your Chromium-based browser.

```
USAGE
  $ vibranium export [FILE]

OPTIONS
  -b, --browser=browser  [default: chrome] Specify a browser (e.g. chrome-canary, chromium, edge)
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

_See code: [src/commands/export.ts](https://github.com/Pittan/vibranium/blob/v1.1.0/src/commands/export.ts)_

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

_See code: [@oclif/plugin-help](https://github.com/oclif/plugin-help/blob/v3.2.2/src/commands/help.ts)_
<!-- commandsstop -->

# 📣 Feedback
If you have any issue, suggestion, or question, feel free to make an issue.  
Also, contribution is welcome!
