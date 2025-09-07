# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Overview

Vibranium is a CLI tool for managing custom emulated devices on Chromium-based browsers. It's built with oclif v4 framework and TypeScript, allowing users to import/export custom device emulator settings in Chrome DevTools.

## Commands to Build, Test, and Develop

```bash
# Build the project
npm run build

# Run tests
npm test

# Lint the code
npm run lint

# Run a single test file
npx mocha test/commands/add.test.ts

# Test the CLI locally
./bin/run.js <command>
```

## Architecture

### Core Structure

The application uses oclif v4 framework with TypeScript and ES modules. Main components:

- **Commands** (`src/commands/`): Two main commands - `add` and `export`
  - `add.ts`: Adds custom emulated devices from JSON to browser preferences
  - `export.ts`: Exports existing custom devices to JSON file

- **Utilities** (`src/utils/`):
  - `chromium-based-browsers.ts`: Core logic for reading/writing Chrome preferences, managing device lists, and browser detection
  - `chrome-profile.ts`: Browser profile discovery across different OS platforms and Chromium variants
  - `index.ts`: Helper functions for file I/O and user interaction

### Key Concepts

1. **Browser Preferences**: The tool modifies Chrome's preferences file directly, specifically the `devtools.preferences["custom-emulated-device-list"]` field.

2. **Profile Support**: Supports multiple Chrome profiles - users can select which profile to modify.

3. **Cross-platform Browser Detection**: Handles different Chromium-based browsers (Chrome, Canary, Edge, etc.) across macOS, Windows, and Linux by mapping to their respective configuration directories.

4. **CustomEmulatedDevice Interface**: Defines the structure for device emulation settings including screen dimensions, user agent, capabilities, and display modes.

5. **Safety Checks**: Verifies browser isn't running before modifying preferences (can be overridden with `--force`).

## Browser Support Matrix

Supported browsers via `--browser` flag:
- `chrome` (default)
- `chrome-canary`
- `chromium`
- `edge`, `edge-beta`, `edge-dev`, `edge-canary`