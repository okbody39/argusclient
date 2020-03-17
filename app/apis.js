const os = require('os');
const { app, BrowserWindow, Menu, remote, ipcMain } = require("electron");
const path = require("path");
const url = require("url");
const isDev = require("electron-is-dev");

const axios = require('axios');
const https = require('https');

const Store = require('electron-store');
const store = new Store({
  encryptionKey: "oiV30mOp5lOwKnaFESjrWq2xFByNOvNj",
});

const _SEED_GATE_ = "211.232.94.235:8000";

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
    let url = 'http://' + _SEED_GATE_ + '/vms/' + userId;
    let vmList = null; // store.get("vm-list");

    if(vmList) {
      // event.returnValue = vmList;
      let retJson = vmList;
      event.reply('vm-list', retJson);
    } else {
      axios.get(url, {
        params: {
          // ID: 12345
        }
      })
        .then(function (response) {
          // event.returnValue = response.data; // sync
          // console.log(response.data);

          let retJson = response.data;
          
          store.set("vm-list", retJson);
          event.reply('vm-list', retJson);
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
    let url = 'http://' + _SEED_GATE_ + '/vms/' + userId;

    axios.get(url, {
      params: {
        // ID: 12345
      }
    })
      .then(function (response) {
        // event.returnValue = response.data; // sync
        vmList.map((vm) => {
          let index = response.data.findIndex(obj => obj.id === vm.id);
          if(index != -1) {
            vm.basicState = response.data[index].basicState;
            // vm.vmImage = 'http://' + _SEED_GATE_ + '/vms/image/' + vm.id + '?' + (new Date().getTime());
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
    let url = 'http://' + _SEED_GATE_ + '/vms/' + userId;
    
    axios.get(url, {
      params: {
        // ID: 12345
      }
    })
      .then(function (response) {
        // event.returnValue = response.data; // sync

        let retJson = response.data;
        // retJson.map((vm) =>{
        //   vm.vmImage = 'http://' + _SEED_GATE_ + '/vms/image/' + vm.id + '?' + (new Date().getTime());
        // });
          
        store.set("vm-list", retJson);
        event.reply('vm-list', retJson);
      })
      .catch(function (error) {
        console.error(error);
      })
      .then(function () {
        // always executed
      });
  });

  ipcMain.on("vm-screenshot", (event, arg) => {
    let url = 'http://' + _SEED_GATE_ + '/vms/image/';
    let vmList = store.get("vm-list");

    vmList.map((vm) => {
      axios.get(url + vm.id, {})
        .then(function (response) {
          let retJson = {
            id: vm.id,
            image: response.data,
          };

          // console.log(response.data);
          event.reply('vm-screenshot', retJson);

        })
        .catch(function (error) {
          console.error(error);
          res.status(501).send(error);
        })
        .then(function () {
          // always executed
        });
    });
  });

  setTimeout(() => {
    autoUpdateCheck(mainWindow);
  }, 500);

}

module.exports = {
  init,
};
