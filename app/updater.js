"use strict";

const os = require('os');
const { app, BrowserWindow, Menu, remote, ipcMain } = require("electron");
const path = require("path");
const url = require("url");
const isDev = require("electron-is-dev");

/*
const { autoUpdater } = require("electron-updater");

const server = 'http://cielcloud.iptime.org:8011'; // 'http://211.232.94.233:1337';
const platform = `${os.platform()}_${os.arch()}`;
const feed = `${server}/update/${platform}`;

autoUpdater.setFeedURL(feed);

autoUpdater.logger = require("electron-log");
autoUpdater.logger.transports.file.level = 'info';
autoUpdater.autoInstallOnAppQuit = true;
*/

const autoUpdater = require('electron-simple-updater');
// const updateServer = 'http://cielcloud.iptime.org:8011';

let updateServer = "https://raw.githubusercontent.com/okbody39/argusclient/master/updates/{platform}-{arch}-{channel}.json";

autoUpdater.init({
  autoDownload: true,
  checkUpdateOnStart: true,
  url: updateServer
});

// console.log(updateServer, autoUpdater);

let modalWindow;

function init(mainWindow) {


  // updateModal(mainWindow);

  if(isDev) {
    // updateModal(mainWindow);
    //
    // setTimeout(() => {
    //   modalWindow.webContents.send('version-data', {version: "1.1.16"});
    // }, 2000);
    //
    // return;
  }



  autoUpdater.on('update-available', (info) => {
    updateModal(mainWindow);

    autoUpdater.logger.info('Update available.' + JSON.stringify(info));
    setTimeout(() => {
      if(modalWindow) {
        modalWindow.webContents.send('status-data', "Update available." + JSON.stringify(info));
        // modalWindow.webContents.send('version-data', info);
      }
    }, 2000);

  });

  autoUpdater.on('error', (err) => {
    // if(modalWindow) {
    modalWindow.webContents.send('status-data', "Error in auto-updater." + JSON.stringify(err));
    // } else {
    //   autoUpdater.logger.info('Error in auto-updater... ' + JSON.stringify(err));
    // }

    modalWindow.close();

  });

  /*
  autoUpdater.on('download-progress', (progressObj) => {
    // autoUpdater.logger.info('Download progress... ' + progressObj.percent + '%');
    modalWindow.webContents.send('progress-data', progressObj.percent);
  });
  */

  autoUpdater.on('update-downloading', (progressObj) => {
    // console.log('Download progress... ');
    modalWindow.webContents.send('status-data', "Download progress..."  + JSON.stringify(progressObj));
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
  let osver = process.platform;
  let height = 180
  if(osver === "darwin") {
    //
  } else if(osver === "win32") {
    height = 200;
  }

  modalWindow = new BrowserWindow({
    width: 500, height: height,
    'parent': parent,
    'show': false,
    'modal': false,
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
