'use strict'

import { app, BrowserWindow, ipcMain } from 'electron'
import { autoUpdater } from 'electron-updater'
import settings from 'electron-settings'
import os from 'os'

/**
 * Set `__static` path to static files in production
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-static-assets.html
 */
if (process.env.NODE_ENV !== 'development') {
  global.__static = require('path').join(__dirname, '/static').replace(/\\/g, '\\\\')
}

let mainWindow
const winURL = process.env.NODE_ENV === 'development'
  ? `http://localhost:9080`
  : `file://${__dirname}/index.html`

function createWindow () {
  /**
   * Initial window options
   */
  mainWindow = new BrowserWindow({
    minWidth: 720,
    minHeight: 400,
    height: 512,
    // useContentSize: true,
    width: 1080,
    frame: false,
    webPreferences: {
      webSecurity: false
    }
  })

  mainWindow.loadURL(winURL)

  mainWindow.on('closed', () => {
    mainWindow = null
  })
}

app.on('ready', () => {
  if (!settings.has('recentFolders')) {
    settings.set('recentFolders', [])
  }
  if (!settings.has('theme')) {
    settings.set('theme', 'dark')
  }
  if (!settings.has('controlsTheme')) {
    let platform
    switch (os.platform()) {
      case 'darwin':
        platform = 'osx'
        break
      case 'linux':
        platform = 'linux'
        break
      default:
        platform = 'win'
        break
    }
    settings.set('controlsTheme', platform)
  }
  if (!settings.has('reverseControlsLocation')) {
    settings.set('reverseControlsLocation', os.platform() !== 'win32')
  }

  if (!settings.has('reoccurrencesIfBad')) {
    settings.set('reoccurrencesIfBad', 1)
  }
  if (!settings.has('reoccurrencesOnStart')) {
    settings.set('reoccurrencesOnStart', 2)
  }
  if (!settings.has('maxReoccurrences')) {
    settings.set('maxReoccurrences', 10)
  }
  createWindow()
  autoUpdater.checkForUpdates()
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow()
  }
})
// when the update has been downloaded and is ready to be installed, notify the BrowserWindow
autoUpdater.on('update-downloaded', () => {
  mainWindow.webContents.send('updateReady')
})

// when receiving a quitAndInstall signal, quit and install the new version ;)
ipcMain.on('quitAndInstall', () => {
  autoUpdater.quitAndInstall()
})

/**
 * Auto Updater
 *
 * Uncomment the following code below and install `electron-updater` to
 * support auto updating. Code Signing with a valid certificate is required.
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-electron-builder.html#auto-updating
 */

/*
import { autoUpdater } from 'electron-updater'

autoUpdater.on('update-downloaded', () => {
  autoUpdater.quitAndInstall()
})

app.on('ready', () => {
  if (process.env.NODE_ENV === 'production') autoUpdater.checkForUpdates()
})
 */
