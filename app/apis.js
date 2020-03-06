const os = require('os');
const { app, BrowserWindow, Menu, remote, ipcMain } = require("electron");
const path = require("path");
const url = require("url");
const isDev = require("electron-is-dev");
const axios = require('axios');
const Store = require('electron-store');
const store = new Store({
  encryptionKey: "oiV30mOp5lOwKnaFESjrWq2xFByNOvNj",
});

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
    let userId = arg;
    let url = 'http://211.232.94.235:8000/vcs/user/' + userId;
    let vmList = store.get("vm-list");

    if(vmList) {
      // event.returnValue = vmList;
      event.reply('vm-list', vmList);
    } else {
      axios.get(url, {
        params: {
          // ID: 12345
        }
      })
        .then(function (response) {
          // event.returnValue = response.data; // sync
          store.set("vm-list", response.data);
          event.reply('vm-list', response.data);
        })
        .catch(function (error) {
          console.error(error);
        })
        .then(function () {
          // always executed
        });
    }
  });

  ipcMain.on("vm-list-refresh", (event, arg) => {
    let userId = arg;
    let vmList = store.get("vm-list");
    // let url = 'http://211.232.94.235:8000/vcs/user/' + userId;
    let url = 'http://211.232.94.235:8000/vcs/vm/all';

    axios.get(url, {
      params: {
        // ID: 12345
      }
    })
      .then(function (response) {
        // event.returnValue = response.data; // sync
        vmList.map((vm) => {
          let index = response.data.findIndex(obj => obj.Name === vm.VmName);
          if(index != -1) {
            vm.BasicState = response.data[index].BasicState;
          }
        });

        store.set("vm-list", vmList);
        event.reply('vm-list', vmList);
      })
      .catch(function (error) {
        console.error(error);
      })
      .then(function () {
        // always executed
      });
  });

  ipcMain.on("vm-list-reset", (event, arg) => {
    let userId = arg;
    let url = 'http://211.232.94.235:8000/vcs/user/' + userId;
    
    axios.get(url, {
      params: {
        // ID: 12345
      }
    })
      .then(function (response) {
        // event.returnValue = response.data; // sync
        store.set("vm-list", response.data);
        event.reply('vm-list', response.data);
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
