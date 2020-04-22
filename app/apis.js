const os = require('os');
const { app, BrowserWindow, Menu, remote, ipcMain, dialog, Notification } = require("electron");
const path = require("path");
const url = require("url");
const isDev = require("electron-is-dev");

const axios = require('axios');
const https = require('https');

const {
  performance,
} = require('perf_hooks');

const Store = require('electron-store');
const store = new Store({
  encryptionKey: "oiV30mOp5lOwKnaFESjrWq2xFByNOvNj",
});

const crypto = require('crypto');

const ENC_KEY = "bf3c199c2470cb1759907b1e0905c17b";
const IV = "5185207c72eec9e4";

// const cipher = crypto.createCipheriv('aes-256-cbc', ENC_KEY, IV);
// const decipher = crypto.createDecipheriv('aes-256-cbc', ENC_KEY, IV);

const BlackScreen = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAASAAAACWCAIAAADxBcILAAAAlElEQVR4nO3BAQEAAACCIP+vbkhAAQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADAiwH65QABlzjV7QAAAABJRU5ErkJggg==';

var _ARGUS_GATE_ = ""; //"211.232.94.235:8000";

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
// const settingThis = require('./setting');

function autoUpdateCheck(mainWindow) {
  autoUpdater.init(mainWindow);
}

var __START_TIME__ = performance.now();

let cpus = os.cpus();
let networkInterfaces = os.networkInterfaces();
let nics = [];

for (var key in networkInterfaces) {
  networkInterfaces[key].map((nic) => {
    if(!nic.internal && nic.address.indexOf(".") != -1) { // nic.family === "IPv4"
      nics.push({
        address: nic.address,
        mac: nic.mac,
        cidr: nic.cidr,
      });
    }
  });
}

var vmwareClient = "-";
var __OS__ = {
  hostname: os.hostname(),
  os: os.type() + " " + os.release() + "-" + os.arch(),
  // type: os.type(),
  // platform: os.platform(),
  // arch: os.arch(),
  // release: os.release(),
  // loadavg: os.loadavg(),
  totalmem: os.totalmem(),
  // freemem: os.freemem(),
  cpus: cpus.length + " Core - " + cpus[0].model,
  nics: nics,
  vhc: vmwareClient,
};

// console.log(vmwareClient);
// process.exit(0);

// const spawn = require('child_process').spawnSync;
// const ls = spawn('wmic', ['-l']);

function init(mainWindow, appVersion) {
  // WINDOWS
  if(process.platform === "win32") {
    const regedit = require("regedit");
    let regPath = "HKLM\\SOFTWARE\\Wow6432Node\\VMware, Inc.\\VMware VDM\\Client\\";

    if(process.arch !== "x64") {
      regPath = "HKEY_LOCAL_MACHINE\\Software\\VMware, Inc.\\VMware VDM\\Client\\";
    }

    vmwareClient = "Not installed";
    __OS__.vhc = vmwareClient;

    regedit.list(regPath, function(err, result) {
      if(!err) {
        for(let key in result) {
          vmwareClient = "Installed (" + result[key].values.Version.value + ")";
          __OS__.vhc = vmwareClient;
        }
      } else {
        // console.log(err);
      }

      initial(mainWindow, appVersion);
    });

  } else {
    initial(mainWindow, appVersion);
  }
}

function initial(mainWindow, appVersion) {
  let serverInfo = store.get("server-info", {});
  let authInfo = store.get("auth-info", {});

  _ARGUS_GATE_ = serverInfo.serverUrl;

  if(_ARGUS_GATE_ && _ARGUS_GATE_.length > 0 && authInfo.username) {

    __START_TIME__ = performance.now();

    axios({
      method: 'post',
      url: 'http://' + _ARGUS_GATE_ + '/access/',
      data: {
        user: authInfo.username,
        gb: "CLIENT_START",
        target: appVersion,
        content: "",
        // ip: "",
        result: JSON.stringify(__OS__),
      }
    });

  }

  ipcMain.on("start-app", (event, arg) => {

    _ARGUS_GATE_ = serverInfo.serverUrl;

    if(_ARGUS_GATE_ && _ARGUS_GATE_.length > 0 && authInfo.username) {

      if(ws) {
        //
      } else {

        try {
          ws = new WebSocket('ws://' + _ARGUS_GATE_ + '/vms/' + authInfo.username);
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
            message: 'Disconnect Server, Try again... ',
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
            message: 'Server is not ready, Try again... ',
            buttons: ['Ok'],
          }).then(() => {
            // process.exit(2);
          });
        };

        ws.onmessage = (data, flags) => {
          // data 플래그로 작업 분기할 것...
           /*
            from ArgusServer server.js

            data.data =
            {
              to: "", // ALL or ID
              title: "",
              body: "",
              action: ""
            }
          */

          // console.log(data.data);

          let jsonData = JSON.parse(data.data);

          if(jsonData.action === "USER_VM_REFRESH") {
            mainWindow.webContents.send("reload-sig");



          } else if(jsonData.action === "ADM_LOG_MESSAGE") {
            mainWindow.webContents.send("log-message", data.data);
          }

          if(jsonData.notification) {
            let iconAddress = path.join(__dirname, "../resources/icons/seedclient_icon.ico");
            const notif={
              title: jsonData.title,
              body: jsonData.body,
              icon: iconAddress
            };
            let myNotification = new Notification(notif);

            myNotification.show();

            myNotification.onclick = () => {
              // console.log('Notification clicked')
            };
          }
        };
      }

      event.reply('start-app', 'OK');

    } else {
      // settingThis.run(mainWindow);
      console.log(serverInfo, authInfo);

      // dialog.showMessageBox(mainWindow, {
      //   type: 'error',
      //   title: 'Application Error',
      //   message: 'Invalid configuration. Try again... ',
      //   buttons: ['Ok'],
      // }).then(() => {
      //   process.exit(2);
      // });

      event.reply('start-app', 'INVALIDSETTING');

    }
  });

  ipcMain.on("about-this", (event, arg) => {
    aboutThis.run(mainWindow);
  });

  ipcMain.on("setting", (event, arg) => {
    // 현재 셋팅을 보낸다.

    event.returnValue = _ARGUS_GATE_ || "";

  });

  ipcMain.on("setting-update", (event, arg) => {
    let decipher = crypto.createDecipheriv('aes-256-cbc', ENC_KEY, IV);
    // Setting 값이 유효한지 확인 한다
    // 셋팅이 유효하면 store에 입력후 재기동 한다.
    // 유효하지 않으면 다시 입력

    // console.log(arg);

    if(arg.serverUrl) {
      let url = "http://" + arg.serverUrl + "/conninfo";

      axios.get(url)
      .then(function (response) {

        let encVal = response.data;
        let decVal = decipher.update(encVal, 'base64', 'utf8');

        decVal += decipher.final('utf8');
        let decJson = JSON.parse(decVal);

        decJson.serverUrl = arg.serverUrl;

        store.set("server-info", arg);
        // event.returnValue = true;

        // app.relaunch({ args: process.argv.slice(1).concat(['--relaunch']) });
        // app.exit(0);

        event.reply('setting-update', decJson);

      })
      .catch(function (error) {
        console.error(error);
        // console.log(arg);
        event.reply('setting-update', false);
      })
      .then(function () {
      });
    } else {
      // alert('ERROR');
      event.reply('setting-update', false);
    }



  });

  ipcMain.on("setting-reset", (event, arg) => {
    store.set("server-info", {});
    store.set("auth-info", {});

    event.returnValue = "DONE";

    // settingThis.run(mainWindow);
  });

  ipcMain.on("setting-cancel", (event, arg) => {
    app.exit(0);
  });

  ipcMain.on("check-update", (event, arg) => {
    autoUpdateCheck(mainWindow);
  });

  ipcMain.on("ping", (event, arg) => {
    event.reply('pong', 'Hello!'); // async
  });

  // LOGIN

  ipcMain.on("login", (event, arg) => {
    let serverInfo = store.get("server-info", {});

    _ARGUS_GATE_ = serverInfo.serverUrl;

    let url = 'http://' + _ARGUS_GATE_ + '/auth';
    let auth = false;

    // console.log(url, arg);

    axios({
      url: url,
      method: 'post',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      data: `username=${encodeURIComponent(arg.username)}&password=${encodeURIComponent(arg.password)}`,
    })
    .then(function (response) {
      let retJson = response.data;
      // console.log(retJson, typeof retJson);
      auth = retJson; // === "true";
      // event.returnValue = auth;

      store.set("auth-info", {
        username: arg.username,
        password: arg.password,
      });

    })
    .catch(function (error) {
      console.error(error);
    })
    .then(function () {
      event.returnValue = auth;
    });

    // if(arg.username === "mhkim") {
    //   auth = true;
    // } else {
    //   auth = false;
    // }

  });


  // CLIENTSl

  ipcMain.on("client-list", (event, arg) => {
    let url = 'http://' + _ARGUS_GATE_ + '/clients/all';

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
    let url = 'http://' + _ARGUS_GATE_ + '/vms/reset';

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
    let url = 'http://' + _ARGUS_GATE_ + '/vms/' + userId;
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

  ipcMain.on("vm-list-admin", (event, arg) => {
    let userId = arg;
    let url = 'http://' + _ARGUS_GATE_ + '/vms/' + userId;
    let vmList = null; 

    axios.get(url, {
      params: {
      }
    })
      .then(function (response) {
        let retJson = response.data;
        event.returnValue = retJson;
      })
      .catch(function (error) {
        console.error(error);
      })
      .then(function () {
      });

  });

  ipcMain.on("vm-list-refresh", (event, arg) => {
    let userId = arg;
    let vmList = store.get("vm-list");
    let url = 'http://' + _ARGUS_GATE_ + '/vms/' + userId;

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
    let url = 'http://' + _ARGUS_GATE_ + '/vms/' + userId;

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
    let url = 'http://' + _ARGUS_GATE_ + '/vms/image/';
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
    let url = 'http://' + _ARGUS_GATE_ + '/vms/image/' + arg;

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

  ipcMain.on("alarm-list", (event, arg) => {
    let userId = arg;
    let url = 'http://' + _ARGUS_GATE_ + '/alarm/' + userId;
    let list = null;

    axios.get(url, {
      params: {
      }
    })
      .then(function (response) {
        let retJson = response.data;

        event.reply('alarm-list', retJson);
      })
      .catch(function (error) {
        console.error(error);
      })
      .then(function () {
      });
  });

  ipcMain.on("change-list", (event, arg) => {
    let userId = arg;
    let url = 'http://' + _ARGUS_GATE_ + '/history/change/' + userId;
    let list = null;

    axios.get(url, {
      params: {
      }
    })
      .then(function (response) {
        let retJson = response.data;

        event.reply('change-list', retJson);
      })
      .catch(function (error) {
        console.error(error);
      })
      .then(function () {
      });
  });

  ipcMain.on("access-list", (event, arg) => {
    let userId = arg;
    let url = 'http://' + _ARGUS_GATE_ + '/history/access/' + userId;
    let list = null;

    axios.get(url, {
      params: {
      }
    })
      .then(function (response) {
        let retJson = response.data;

        event.reply('access-list', retJson);
      })
      .catch(function (error) {
        console.error(error);
      })
      .then(function () {
      });
  });

  ipcMain.on("failure-list", (event, arg) => {
    let userId = arg;
    let url = 'http://' + _ARGUS_GATE_ + '/history/failure/' + userId;
    let list = null;

    axios.get(url, {
      params: {
      }
    })
      .then(function (response) {
        let retJson = response.data;

        event.reply('failure-list', retJson);
      })
      .catch(function (error) {
        console.error(error);
      })
      .then(function () {
      });
  });

  let forceQuit = false;

  mainWindow.on("close", function(e) {
    let url = 'http://' + _ARGUS_GATE_ + '/access/';
    // let authInfo = store.get("auth-info", {});

    if (!forceQuit) {
      e.preventDefault();

      var choice = dialog.showMessageBox(mainWindow,
        {
          type: 'question',
          buttons: ['Yes', 'No'],
          title: 'Confirm',
          message: 'Are you sure you want to quit?'
       });
  
      choice.then(function(res){
         // 0 for Yes
        if(res.response== 0){
          let endTime = performance.now();
          let timeDiff = endTime - __START_TIME__; 
          timeDiff /= 1000; 
          let seconds = Math.round(timeDiff);

          axios({
            method: 'post',
            url: url,
            data: {
              user: authInfo.username,
              gb: "CLIENT_END",
              target: appVersion,
              content: seconds,
              // ip: "",
              result: JSON.stringify(__OS__),
            }
          });
          forceQuit = true;
          mainWindow.close();
        }
         // 1 for No
        if(res.response== 1){
         // Your Code
        }
      });
    }

  });

  setTimeout(() => {
    autoUpdateCheck(mainWindow);
  }, 500);

}

module.exports = {
  init,
};
