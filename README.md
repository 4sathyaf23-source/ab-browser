# AB Browser

A lightweight, fast web browser for Windows, built with Electron.

## Features

- Tabbed browsing
- Built-in ad blocker (ElectronBlocker)
- Clean, minimal interface
- AI sidebar (coming soon)

## Download

1. Go to the **Actions** tab of this repository.
2. Open the latest successful workflow run.
3. Download the build from the **Artifacts** section.
4. Unzip it and run the `.exe`.

> Windows may show a "Windows protected your PC" warning because the app isn't code-signed yet. Click **More info → Run anyway**.

## Run from source

```bash
git clone https://github.com/4sathyaf23-source/ab-browser.git
cd ab-browser
npm install
npm start
```

## Tech stack

- Electron
- HTML / CSS / JavaScript
- @cliqz/adblocker-electron
- GitHub Actions for automated builds

## Roadmap

- [ ] Bookmarks
- [ ] AI sidebar
- [ ] Settings page
- [ ] Installer and auto-update

## License

MIT
