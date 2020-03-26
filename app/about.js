"use strict";

const os = require('os');
const { app, BrowserWindow, Menu, remote, ipcMain } = require("electron");
const path = require("path");
const url = require("url");
const isDev = require("electron-is-dev");

const platform = `${os.platform()}_${os.arch()}`;


let modalWindow;

function run(mainWindow) {

  aboutModal(mainWindow);

  setTimeout(() => {
    modalWindow.webContents.send('version-data', {
      version: app.getVersion(),
      platform: platform,
    });
  }, 500);

}

function aboutModal(parent) {
  modalWindow = new BrowserWindow({
    width: 500, height: 180,
    'parent': parent,
    'show': false,
    'modal': true,
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
      pathname: "about.html",
      slashes: true
    });
  } else {
    indexPath = url.format({
      protocol: "file:",
      pathname: path.join(__dirname, "../dist", "about.html"),
      slashes: true
    });
  }

  // Load the HTML dialog box
  modalWindow.loadURL(indexPath);
  modalWindow.once('ready-to-show', () => { modalWindow.show() })
}

module.exports = {
  run
};
