vibranium
=========

CLI tool for managing custom emulated devices on Chrome

[![oclif](https://img.shields.io/badge/cli-oclif-brightgreen.svg)](https://oclif.io)
[![Version](https://img.shields.io/npm/v/vibranium.svg)](https://npmjs.org/package/vibranium)
[![Downloads/week](https://img.shields.io/npm/dw/vibranium.svg)](https://npmjs.org/package/vibranium)
[![License](https://img.shields.io/npm/l/vibranium.svg)](https://github.com/Pittan/vibranium/blob/master/package.json)

<!-- toc -->
* [Usage](#usage)
* [Commands](#commands)
<!-- tocstop -->
# Usage
<!-- usage -->
```sh-session
$ npm install -g @pittankopta/vibranium
$ vibranium COMMAND
running command...
$ vibranium (-v|--version|version)
@pittankopta/vibranium/1.0.0-alpha.1 darwin-x64 node-v12.13.1
$ vibranium --help [COMMAND]
USAGE
  $ vibranium COMMAND
...
```
<!-- usagestop -->
# Commands
<!-- commands -->
* [`vibranium add [FILE]`](#vibranium-add-file)
* [`vibranium export [FILE]`](#vibranium-export-file)
* [`vibranium hello [FILE]`](#vibranium-hello-file)
* [`vibranium help [COMMAND]`](#vibranium-help-command)

## `vibranium add [FILE]`

describe the command here

```
USAGE
  $ vibranium add [FILE]

OPTIONS
  -f, --force
  -h, --help       show CLI help
  -n, --name=name  name to print
```

_See code: [src/commands/add.ts](https://github.com/Pittan/vibranium/blob/v1.0.0-alpha.1/src/commands/add.ts)_

## `vibranium export [FILE]`

describe the command here

```
USAGE
  $ vibranium export [FILE]

OPTIONS
  -f, --force
  -h, --help       show CLI help
  -n, --name=name  name to print
```

_See code: [src/commands/export.ts](https://github.com/Pittan/vibranium/blob/v1.0.0-alpha.1/src/commands/export.ts)_

## `vibranium hello [FILE]`

describe the command here

```
USAGE
  $ vibranium hello [FILE]

OPTIONS
  -f, --force
  -h, --help       show CLI help
  -n, --name=name  name to print

EXAMPLE
  $ vibranium hello
  hello world from ./src/hello.ts!
```

_See code: [src/commands/hello.ts](https://github.com/Pittan/vibranium/blob/v1.0.0-alpha.1/src/commands/hello.ts)_

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
