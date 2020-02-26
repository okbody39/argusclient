"use strict";

const os = require('os');
const { app, BrowserWindow, Menu, remote, ipcMain } = require("electron");
const path = require("path");
const url = require("url");
const isDev = require("electron-is-dev");

const axios = require('axios');

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

  ipcMain.on("vm-list", (event, arg) => {
    let vmName = arg;

    // http://192.168.15.17:8000/vcs/vm/all

    let url = 'http://192.168.15.17:8000/vcs/vm/' + vmName;

    // console.log(url);
    //
    // (async () => {
    //   const body = await fetch(url, {type: 'text'});
    //   console.log(body);
    //   event.returnValue = body; // sync
    //   //=> '170.56.15.35'
    // })();

    // fetch(url)
    //   // .then(res => res.text())
    //   .then(body => {
    //     console.log(body);
    //     event.returnValue = body; // sync
    //   })
    //   .catch(err => console.error(err));

    axios.get(url, {
      params: {
        // ID: 12345
      }
    })
      .then(function (response) {
        // console.log(response.data);
        event.returnValue = response.data; // sync
      })
      .catch(function (error) {
        console.error(error);
      })
      .then(function () {
        // always executed
      });


  });

  setTimeout(() => {
    autoUpdateCheck(mainWindow);
  }, 500);

}

module.exports = {
  init,
};
