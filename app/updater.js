"use strict";

const os = require('os');
const { app, BrowserWindow, Menu, remote, ipcMain } = require("electron");
const path = require("path");
const url = require("url");
const isDev = require("electron-is-dev");

const { autoUpdater } = require("electron-updater");

const server = 'http://211.232.94.233:1337';
const platform = `${os.platform()}_${os.arch()}`;
const feed = `${server}/update/${platform}`;

autoUpdater.setFeedURL(feed);

autoUpdater.logger = require("electron-log");
autoUpdater.logger.transports.file.level = 'info';
autoUpdater.autoInstallOnAppQuit = true;

let modalWindow;

function init(mainWindow) {

  autoUpdater.on('update-available', (info) => {

    updateModal(mainWindow);

    // autoUpdater.logger.info('Update available.' + JSON.stringify(info));

    setTimeout(() => {
      if(modalWindow) {
        modalWindow.webContents.send('status-data', "Update available.");
        modalWindow.webContents.send('version-data', info);
      }
    }, 2000);

  });

  autoUpdater.on('error', (err) => {
    // if(modalWindow) {
      modalWindow.webContents.send('status-data', "Error in auto-updater.");
    // } else {
    //   autoUpdater.logger.info('Error in auto-updater... ' + JSON.stringify(err));
    // }

    modalWindow.close();

  });

  autoUpdater.on('download-progress', (progressObj) => {
    // autoUpdater.logger.info('Download progress... ' + progressObj.percent + '%');
    modalWindow.webContents.send('progress-data', progressObj.percent);
  });

  autoUpdater.on('update-downloaded', (info) => {
    autoUpdater.logger.info('Downloaded ... ' + JSON.stringify(info));
    modalWindow.webContents.send('status-data', "Update downloaded; will restart in 5 seconds");
    setTimeout(() => {
      autoUpdater.quitAndInstall();
    }, 5000);
  });

  // autoUpdater.on('checking-for-update', () => {
  //   // autoUpdater.logger.info('Checking for update...');
  // });

  // autoUpdater.on('update-not-available', () => {
  //   // autoUpdater.logger.info('Update not available.');
  //   // modalWindow.webContents.send('status-data', "Update not available.");
  // });

  autoUpdater.checkForUpdates();

}

function updateModal(parent) {
  modalWindow = new BrowserWindow({
    width: 500, height: 250,
    'parent': parent,
    'show': false,
    // 'modal': true,
    'alwaysOnTop' : true,
    // 'title' : 'New update!',
    'autoHideMenuBar': true,
    'webPreferences' : {
      "nodeIntegration":true,
      "sandbox" : false
    }
  });
  modalWindow.on('closed', () => {
    modalWindow = null;
  });

  let indexPath;

  if (isDev && process.argv.indexOf("--noDevServer") === -1) {
    indexPath = url.format({
      protocol: "http:",
      host: "localhost:3100",
      pathname: "update.html",
      slashes: true
    });
  } else {
    indexPath = url.format({
      protocol: "file:",
      pathname: path.join(__dirname, "../dist", "update.html"),
      slashes: true
    });
  }

  // Load the HTML dialog box
  modalWindow.loadURL(indexPath);
  modalWindow.once('ready-to-show', () => { modalWindow.show() })
}

module.exports = {
  init
};
