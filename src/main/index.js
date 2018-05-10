'use strict'

import { app, BrowserWindow } from 'electron'
import settings from 'electron-settings'

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
    minWidth: 540,
    minHeight: 320,
    height: 563,
    // useContentSize: true,
    width: 1000,
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
  if (!settings.has('theme')) {
    settings.set('theme', 'light')
  }
  if (!settings.has('controlsTheme')) {
    settings.set('controlsTheme', 'win')
  }
  if (!settings.has('reverseControlsLocation')) {
    settings.set('reverseControlsLocation', false)
  }

  if (!settings.has('reoccurrencesIfBad')) {
    settings.set('reoccurrencesIfBad', 1)
  }
  if (!settings.has('reoccurrencesOnStart')) {
    settings.set('reoccurrencesOnStart', 2)
  }
  if (!settings.has('setMaxReoccurrences')) {
    settings.set('setMaxReoccurrences', 10)
  }
  createWindow()
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
