"use strict";

const os = require('os');
const { app, BrowserWindow, Menu, remote, ipcMain } = require("electron");
const path = require("path");
const url = require("url");
const isDev = require("electron-is-dev");

const aboutThis = require('./about');
const autoUpdater = require('./updater');

function autoUpdateCheck(mainWindow) {
  autoUpdater.init(mainWindow);
}

function init(mainWindow) {

  ipcMain.on("about-this", (event, arg) => {
    aboutThis.run(mainWindow);
  });

  ipcMain.on("check-update", (event, arg) => {
    autoUpdateCheck(mainWindow);
  });

  ipcMain.on("ping", (event, arg) => {
    event.reply('pong', 'Hello!') // async
  });

  ipcMain.on("vm-reset", (event, arg) => {
    let vmName = arg;
    event.returnValue = 'reset: ' + vmName; // sync
  });

  ipcMain.on("vm-connect", (event, arg) => {
    let vmName = arg;
    event.returnValue = 'connect: ' + vmName; // sync
  });

  setTimeout(() => {
    autoUpdateCheck(mainWindow);
  }, 500);

}

module.exports = {
  init,
};
