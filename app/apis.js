const os = require('os');
const { app, BrowserWindow, Menu, remote, ipcMain, dialog } = require("electron");
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
const BlackScreen = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAASAAAACWCAIAAADxBcILAAAAlElEQVR4nO3BAQEAAACCIP+vbkhAAQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADAiwH65QABlzjV7QAAAABJRU5ErkJggg==';

// Web socket

const WebSocket = require('ws');
var ws = null;

const props = {
  name: 'file',
  multiple: true,
  action: 'https://www.mocky.io/v2/5cc8019d300000980a055e76',

};

const aboutThis = require('./about');
const autoUpdater = require('./updater');

function autoUpdateCheck(mainWindow) {
  autoUpdater.init(mainWindow);
}

function init(mainWindow) {

  try {
    ws = new WebSocket('ws://' + _SEED_GATE_ + '/vms/' + 'mhkim');
  } catch(e) {
    console.error(e);
  }

  ws.onopen = () => {
    //
  };

  ws.onclose = () => {
    dialog.showMessageBox(mainWindow, {
      type: 'error',
      title: 'Server connection Error',
      message: 'Disconnect Server, try again... ', // + err.error.errno,
      buttons: ['Ok'],
    }).then(() => {
      // process.exit(2);
    });

  };

  ws.onerror = (err) => {
    // console.log(err);
    dialog.showMessageBox(mainWindow, {
      type: 'error',
      title: 'Server connection Error',
      message: 'Server is not ready, try again... ',
      buttons: ['Ok'],
    }).then(() => {
      // process.exit(2);
    });
  };

  ws.onmessage = (data, flags) => {
    mainWindow.webContents.send("reload-sig", data.data);
    mainWindow.webContents.send("log-message", data.data);
  };

  ///////////////////////////////////////


  ipcMain.on("about-this", (event, arg) => {
    aboutThis.run(mainWindow);
  });

  ipcMain.on("check-update", (event, arg) => {
    autoUpdateCheck(mainWindow);
  });

  ipcMain.on("ping", (event, arg) => {
    event.reply('pong', 'Hello!') // async
  });

  // CLIENTS

  ipcMain.on("client-list", (event, arg) => {
    let url = 'http://' + _SEED_GATE_ + '/clients/all';
    
    axios.get(url)
      .then(function (response) {
        let retJson = response.data;

        event.reply('client-list', retJson);
      })
      .catch(function (error) {
        console.error(error);
      })
      .then(function () {
      });
  });

  // VMS

  ipcMain.on("vm-reset", (event, arg) => {
    let machineId = arg;
    let url = 'http://' + _SEED_GATE_ + '/vms/reset';

    axios({
      url: url,
      method: 'put',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      data: `machineId=${encodeURIComponent(machineId)}`,
  })
     .then((response) => {
        let retJson = response.data;
        event.returnValue = retJson;
      })
      .catch((err) => {
          console.error(err);
          event.returnValue = err;
      });
  });

  ipcMain.on("vm-connect", (event, arg) => {
    let vmName = arg;
    event.returnValue = 'connect: ' + vmName;
  });

  ipcMain.on("vm-list", (event, arg) => {
    let userId = arg;
    let url = 'http://' + _SEED_GATE_ + '/vms/' + userId;
    let vmList = null; // store.get("vm-list");

    if(vmList) {
      let retJson = vmList;
      event.reply('vm-list', retJson);
    } else {
      axios.get(url, {
        params: {
        }
      })
        .then(function (response) {
          let retJson = response.data;

          if(userId === 'all') {
            store.set("vm-list-admin", retJson);
          } else {
            store.set("vm-list", retJson);
          }
          
          event.reply('vm-list', retJson);
        })
        .catch(function (error) {
          console.error(error);
        })
        .then(function () {
        });
    }
  });

  ipcMain.on("vm-list-refresh", (event, arg) => {
    let userId = arg;
    let vmList = store.get("vm-list");
    let url = 'http://' + _SEED_GATE_ + '/vms/' + userId;

    axios.get(url, {
      params: {
      }
    })
      .then(function (response) {
        vmList.map((vm) => {
          let index = response.data.findIndex(obj => obj.id === vm.id);
          if(index != -1) {
            vm.basicState = response.data[index].basicState;
          }
        });

        if(userId === 'all') {
          store.set("vm-list-admin", retJson);
        } else {
          store.set("vm-list", retJson);
        }
        event.reply('vm-list', vmList);
      })
      .catch(function (error) {
        console.error(error);
      })
      .then(function () {
      });
  });

  ipcMain.on("vm-list-reset", (event, arg) => {
    let userId = arg;
    let url = 'http://' + _SEED_GATE_ + '/vms/' + userId;

    axios.get(url, {
      params: {
      }
    })
      .then(function (response) {
        let retJson = response.data;

        if(userId === 'all') {
          store.set("vm-list-admin", retJson);
        } else {
          store.set("vm-list", retJson);
        }
        event.reply('vm-list', retJson);
      })
      .catch(function (error) {
        console.error(error);
      })
      .then(function () {
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

          event.reply('vm-screenshot', retJson);

        })
        .catch(function (error) {
          let retJson = {
            id: vm.id,
            image: BlackScreen,
          };
          event.reply('vm-screenshot', retJson);
        })
        .then(function () {
        });
    });
  });

  ipcMain.on("vm-screenshot-admin", (event, arg) => {
    let url = 'http://' + _SEED_GATE_ + '/vms/image/' + arg;
    
    axios.get(url, {})
      .then(function (response) {
        
        event.reply('vm-screenshot', response.data);

      })
      .catch(function (error) {
        
        event.reply('vm-screenshot', BlackScreen);
      })
      .then(function () {
      });
  });

  setTimeout(() => {
    autoUpdateCheck(mainWindow);
  }, 500);

}

module.exports = {
  init,
};
