vibranium-v2
=================

A new CLI generated with oclif


[![oclif](https://img.shields.io/badge/cli-oclif-brightgreen.svg)](https://oclif.io)
[![Version](https://img.shields.io/npm/v/vibranium-v2.svg)](https://npmjs.org/package/vibranium-v2)
[![Downloads/week](https://img.shields.io/npm/dw/vibranium-v2.svg)](https://npmjs.org/package/vibranium-v2)


<!-- toc -->
* [Usage](#usage)
* [Commands](#commands)
<!-- tocstop -->
# Usage
<!-- usage -->
```sh-session
$ npm install -g vibranium-v2
$ vibranium COMMAND
running command...
$ vibranium (--version)
vibranium-v2/0.0.0 darwin-arm64 node-v22.12.0
$ vibranium --help [COMMAND]
USAGE
  $ vibranium COMMAND
...
```
<!-- usagestop -->
# Commands
<!-- commands -->
* [`vibranium hello PERSON`](#vibranium-hello-person)
* [`vibranium hello world`](#vibranium-hello-world)
* [`vibranium help [COMMAND]`](#vibranium-help-command)
* [`vibranium plugins`](#vibranium-plugins)
* [`vibranium plugins add PLUGIN`](#vibranium-plugins-add-plugin)
* [`vibranium plugins:inspect PLUGIN...`](#vibranium-pluginsinspect-plugin)
* [`vibranium plugins install PLUGIN`](#vibranium-plugins-install-plugin)
* [`vibranium plugins link PATH`](#vibranium-plugins-link-path)
* [`vibranium plugins remove [PLUGIN]`](#vibranium-plugins-remove-plugin)
* [`vibranium plugins reset`](#vibranium-plugins-reset)
* [`vibranium plugins uninstall [PLUGIN]`](#vibranium-plugins-uninstall-plugin)
* [`vibranium plugins unlink [PLUGIN]`](#vibranium-plugins-unlink-plugin)
* [`vibranium plugins update`](#vibranium-plugins-update)

## `vibranium hello PERSON`

Say hello

```
USAGE
  $ vibranium hello PERSON -f <value>

ARGUMENTS
  PERSON  Person to say hello to

FLAGS
  -f, --from=<value>  (required) Who is saying hello

DESCRIPTION
  Say hello

EXAMPLES
  $ vibranium hello friend --from oclif
  hello friend from oclif! (./src/commands/hello/index.ts)
```

_See code: [src/commands/hello/index.ts](https://github.com/pittan/vibranium-v2/blob/v0.0.0/src/commands/hello/index.ts)_

## `vibranium hello world`

Say hello world

```
USAGE
  $ vibranium hello world

DESCRIPTION
  Say hello world

EXAMPLES
  $ vibranium hello world
  hello world! (./src/commands/hello/world.ts)
```

_See code: [src/commands/hello/world.ts](https://github.com/pittan/vibranium-v2/blob/v0.0.0/src/commands/hello/world.ts)_

## `vibranium help [COMMAND]`

Display help for vibranium.

```
USAGE
  $ vibranium help [COMMAND...] [-n]

ARGUMENTS
  COMMAND...  Command to show help for.

FLAGS
  -n, --nested-commands  Include all nested commands in the output.

DESCRIPTION
  Display help for vibranium.
```

_See code: [@oclif/plugin-help](https://github.com/oclif/plugin-help/blob/v6.2.32/src/commands/help.ts)_

## `vibranium plugins`

List installed plugins.

```
USAGE
  $ vibranium plugins [--json] [--core]

FLAGS
  --core  Show core plugins.

GLOBAL FLAGS
  --json  Format output as json.

DESCRIPTION
  List installed plugins.

EXAMPLES
  $ vibranium plugins
```

_See code: [@oclif/plugin-plugins](https://github.com/oclif/plugin-plugins/blob/v5.4.46/src/commands/plugins/index.ts)_

## `vibranium plugins add PLUGIN`

Installs a plugin into vibranium.

```
USAGE
  $ vibranium plugins add PLUGIN... [--json] [-f] [-h] [-s | -v]

ARGUMENTS
  PLUGIN...  Plugin to install.

FLAGS
  -f, --force    Force npm to fetch remote resources even if a local copy exists on disk.
  -h, --help     Show CLI help.
  -s, --silent   Silences npm output.
  -v, --verbose  Show verbose npm output.

GLOBAL FLAGS
  --json  Format output as json.

DESCRIPTION
  Installs a plugin into vibranium.

  Uses npm to install plugins.

  Installation of a user-installed plugin will override a core plugin.

  Use the VIBRANIUM_NPM_LOG_LEVEL environment variable to set the npm loglevel.
  Use the VIBRANIUM_NPM_REGISTRY environment variable to set the npm registry.

ALIASES
  $ vibranium plugins add

EXAMPLES
  Install a plugin from npm registry.

    $ vibranium plugins add myplugin

  Install a plugin from a github url.

    $ vibranium plugins add https://github.com/someuser/someplugin

  Install a plugin from a github slug.

    $ vibranium plugins add someuser/someplugin
```

## `vibranium plugins:inspect PLUGIN...`

Displays installation properties of a plugin.

```
USAGE
  $ vibranium plugins inspect PLUGIN...

ARGUMENTS
  PLUGIN...  [default: .] Plugin to inspect.

FLAGS
  -h, --help     Show CLI help.
  -v, --verbose

GLOBAL FLAGS
  --json  Format output as json.

DESCRIPTION
  Displays installation properties of a plugin.

EXAMPLES
  $ vibranium plugins inspect myplugin
```

_See code: [@oclif/plugin-plugins](https://github.com/oclif/plugin-plugins/blob/v5.4.46/src/commands/plugins/inspect.ts)_

## `vibranium plugins install PLUGIN`

Installs a plugin into vibranium.

```
USAGE
  $ vibranium plugins install PLUGIN... [--json] [-f] [-h] [-s | -v]

ARGUMENTS
  PLUGIN...  Plugin to install.

FLAGS
  -f, --force    Force npm to fetch remote resources even if a local copy exists on disk.
  -h, --help     Show CLI help.
  -s, --silent   Silences npm output.
  -v, --verbose  Show verbose npm output.

GLOBAL FLAGS
  --json  Format output as json.

DESCRIPTION
  Installs a plugin into vibranium.

  Uses npm to install plugins.

  Installation of a user-installed plugin will override a core plugin.

  Use the VIBRANIUM_NPM_LOG_LEVEL environment variable to set the npm loglevel.
  Use the VIBRANIUM_NPM_REGISTRY environment variable to set the npm registry.

ALIASES
  $ vibranium plugins add

EXAMPLES
  Install a plugin from npm registry.

    $ vibranium plugins install myplugin

  Install a plugin from a github url.

    $ vibranium plugins install https://github.com/someuser/someplugin

  Install a plugin from a github slug.

    $ vibranium plugins install someuser/someplugin
```

_See code: [@oclif/plugin-plugins](https://github.com/oclif/plugin-plugins/blob/v5.4.46/src/commands/plugins/install.ts)_

## `vibranium plugins link PATH`

Links a plugin into the CLI for development.

```
USAGE
  $ vibranium plugins link PATH [-h] [--install] [-v]

ARGUMENTS
  PATH  [default: .] path to plugin

FLAGS
  -h, --help          Show CLI help.
  -v, --verbose
      --[no-]install  Install dependencies after linking the plugin.

DESCRIPTION
  Links a plugin into the CLI for development.

  Installation of a linked plugin will override a user-installed or core plugin.

  e.g. If you have a user-installed or core plugin that has a 'hello' command, installing a linked plugin with a 'hello'
  command will override the user-installed or core plugin implementation. This is useful for development work.


EXAMPLES
  $ vibranium plugins link myplugin
```

_See code: [@oclif/plugin-plugins](https://github.com/oclif/plugin-plugins/blob/v5.4.46/src/commands/plugins/link.ts)_

## `vibranium plugins remove [PLUGIN]`

Removes a plugin from the CLI.

```
USAGE
  $ vibranium plugins remove [PLUGIN...] [-h] [-v]

ARGUMENTS
  PLUGIN...  plugin to uninstall

FLAGS
  -h, --help     Show CLI help.
  -v, --verbose

DESCRIPTION
  Removes a plugin from the CLI.

ALIASES
  $ vibranium plugins unlink
  $ vibranium plugins remove

EXAMPLES
  $ vibranium plugins remove myplugin
```

## `vibranium plugins reset`

Remove all user-installed and linked plugins.

```
USAGE
  $ vibranium plugins reset [--hard] [--reinstall]

FLAGS
  --hard       Delete node_modules and package manager related files in addition to uninstalling plugins.
  --reinstall  Reinstall all plugins after uninstalling.
```

_See code: [@oclif/plugin-plugins](https://github.com/oclif/plugin-plugins/blob/v5.4.46/src/commands/plugins/reset.ts)_

## `vibranium plugins uninstall [PLUGIN]`

Removes a plugin from the CLI.

```
USAGE
  $ vibranium plugins uninstall [PLUGIN...] [-h] [-v]

ARGUMENTS
  PLUGIN...  plugin to uninstall

FLAGS
  -h, --help     Show CLI help.
  -v, --verbose

DESCRIPTION
  Removes a plugin from the CLI.

ALIASES
  $ vibranium plugins unlink
  $ vibranium plugins remove

EXAMPLES
  $ vibranium plugins uninstall myplugin
```

_See code: [@oclif/plugin-plugins](https://github.com/oclif/plugin-plugins/blob/v5.4.46/src/commands/plugins/uninstall.ts)_

## `vibranium plugins unlink [PLUGIN]`

Removes a plugin from the CLI.

```
USAGE
  $ vibranium plugins unlink [PLUGIN...] [-h] [-v]

ARGUMENTS
  PLUGIN...  plugin to uninstall

FLAGS
  -h, --help     Show CLI help.
  -v, --verbose

DESCRIPTION
  Removes a plugin from the CLI.

ALIASES
  $ vibranium plugins unlink
  $ vibranium plugins remove

EXAMPLES
  $ vibranium plugins unlink myplugin
```

## `vibranium plugins update`

Update installed plugins.

```
USAGE
  $ vibranium plugins update [-h] [-v]

FLAGS
  -h, --help     Show CLI help.
  -v, --verbose

DESCRIPTION
  Update installed plugins.
```

_See code: [@oclif/plugin-plugins](https://github.com/oclif/plugin-plugins/blob/v5.4.46/src/commands/plugins/update.ts)_
<!-- commandsstop -->
