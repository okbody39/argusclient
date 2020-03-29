"use strict";

const os = require('os');
const { app, BrowserWindow, Menu, remote, ipcMain } = require("electron");
const path = require("path");
const url = require("url");
const isDev = require("electron-is-dev");

let modalWindow;

function run(mainWindow) {
  settingModal(mainWindow);

  // setTimeout(() => {
  //   modalWindow.webContents.send('serverurl', "");
  // }, 2000);
}

function settingModal(parent) {
  let osver = process.platform;
  let height = 180;
  let indexPath;

  if(osver === "darwin") {
    //
  } else if(osver === "win32") {
    height = 200;
  }

  modalWindow = new BrowserWindow({
    width: 500, height: height,
    'parent': parent,
    'show': false,
    // 'modal': true,
    'alwaysOnTop' : true,
    // 'title' : '서버 설정',
    'autoHideMenuBar': true,
    'webPreferences' : {
      "nodeIntegration":true,
      "sandbox" : false
    }
  });

  modalWindow.on('closed', () => {
    modalWindow = null;
  });

  if (isDev && process.argv.indexOf("--noDevServer") === -1) {
    indexPath = url.format({
      protocol: "http:",
      host: "localhost:3100",
      pathname: "setting.html",
      slashes: true
    });
  } else {
    indexPath = url.format({
      protocol: "file:",
      pathname: path.join(__dirname, "../dist", "setting.html"),
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
