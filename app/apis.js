const os = require('os');
const { app, BrowserWindow, Menu, remote, ipcMain, dialog, Notification } = require("electron");
const path = require("path");
const fs = require('fs');
const url = require("url");
const isDev = require("electron-is-dev");

const {spawn, exec} = require('child_process');
const async = require('async');

const tcpp = require('tcp-ping');
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

function encryptStr(val) {
  const cipher = crypto.createCipheriv('aes-256-cbc', ENC_KEY, IV);
  let value = null;

  if (typeof val === 'object') { // JSON
      value = JSON.stringify(val);
  } else {
      value = '' + val;
  }

  let encVal = cipher.update(value, 'utf8', 'base64');
  encVal += cipher.final('base64');

  return encVal;

}

function decryptStr(encVal, defaultVal) {
  const decipher = crypto.createDecipheriv('aes-256-cbc', ENC_KEY, IV);
  let decVal = decipher.update(encVal, 'base64', 'utf8');
  decVal += decipher.final('utf8');
  let retVal = null;

  if (typeof defaultVal === 'object') {
      retVal = JSON.parse(decVal);
    } else if (typeof defaultVal === 'number') {
      retVal = parseInt(decVal);
    } else if (typeof defaultVal === 'boolean') {
      retVal = (decVal == 'true');
  } else {
      retVal = '' + decVal;
  }

  return retVal;

}

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

function autoUpdateCheck(mainWindow, isCheck) {
  autoUpdater.init(mainWindow, isCheck);
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

function checkClient() {
  if(process.platform === "win32") {
    const regedit = require("regedit");
    let regPath = "HKLM\\SOFTWARE\\Wow6432Node\\VMware, Inc.\\VMware VDM\\Client\\";

    if (process.arch !== "x64") {
      regPath = "HKEY_LOCAL_MACHINE\\Software\\VMware, Inc.\\VMware VDM\\Client\\";
    }

    let ret = "Not installed";

    regedit.list(regPath, function (err, result) {
      if (!err) {
        for (let key in result) {
          ret = "Installed (" + result[key].values.Version.value + ")";
        }
      }
      return ret;
    });

  } else if(process.platform === "darwin") {
    let path = "/Applications/VMware Horizon Client.app";
    try {
      if (fs.existsSync(path)) {
        return "Installed";
      }
    } catch(err) {
      // console.error(err)
      return "-";
    }
  } else {
    return "-";
  }
}

// console.log(vmwareClient);
// process.exit(0);

// const spawn = require('child_process').spawnSync;
// const ls = spawn('wmic', ['-l']);

function init(mainWindow, appVersion) {

  vmwareClient = checkClient();
  __OS__.vhc = vmwareClient;

  initial(mainWindow, appVersion);

  // // WINDOWS
  // if(process.platform === "win32") {
  //   const regedit = require("regedit");
  //   let regPath = "HKLM\\SOFTWARE\\Wow6432Node\\VMware, Inc.\\VMware VDM\\Client\\";
  //
  //   if (process.arch !== "x64") {
  //     regPath = "HKEY_LOCAL_MACHINE\\Software\\VMware, Inc.\\VMware VDM\\Client\\";
  //   }
  //
  //   vmwareClient = "Not installed";
  //   __OS__.vhc = vmwareClient;
  //
  //   regedit.list(regPath, function (err, result) {
  //     if (!err) {
  //       for (let key in result) {
  //         vmwareClient = "Installed (" + result[key].values.Version.value + ")";
  //         __OS__.vhc = vmwareClient;
  //       }
  //     } else {
  //       // console.log(err);
  //     }
  //
  //     initial(mainWindow, appVersion);
  //   });
  // } else if(process.platform === "darwin") {
  //   let path = "/Applications/VMware Horizon Client.app";
  //   try {
  //     if (fs.existsSync(path)) {
  //       vmwareClient = "Installed";
  //     }
  //   } catch(err) {
  //     console.error(err)
  //   }
  //   initial(mainWindow, appVersion);
  // } else {
  //   initial(mainWindow, appVersion);
  // }
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
    serverInfo = store.get("server-info", {});
    authInfo = store.get("auth-info", {});

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

            mainWindow.webContents.send("notification-message", notif);

            myNotification.onclick = () => {
              // console.log('Notification clicked')
            };
          }
        };
      }

      event.reply('start-app', 'OK');

    } else {
      // settingThis.run(mainWindow);
      console.log("apis.js - start-app : ", serverInfo, authInfo);

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

    console.log(arg);

    if(arg.serverUrl) {
      let url = "http://" + arg.serverUrl + "/conninfo";

      axios.get(url)
      .then(function (response) {

        let encVal = response.data;
        let decVal = decipher.update(encVal, 'base64', 'utf8');

        decVal += decipher.final('utf8');
        let decJson = JSON.parse(decVal);
        decJson.serverUrl = arg.serverUrl;

        // console.log(decJson, arg);

        store.set("server-info", {
          serverUrl: arg.serverUrl,
          ViewServers: decJson.ViewServers,
          Domain: decJson.Domain,
        });

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
    autoUpdateCheck(mainWindow, true);
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

    let data = encryptStr(
      {
        username: arg.username,
        password: arg.password,
      }
    );

    axios({
      url: url,
      method: 'post',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      // data: `username=${encodeURIComponent(arg.username)}&password=${encodeURIComponent(arg.password)}`,
      data: `sec=${encodeURIComponent(data)}`,
    })
    .then(function (response) {
      let retJson = response.data;
      // console.log(retJson, typeof retJson);
      auth = decryptStr(retJson, { result: false }); // === "true";
      // event.returnValue = auth;

      console.log(auth);

      if(auth.result == "true") {
        store.set("auth-info", arg);
      }

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

  ipcMain.on("change-password", (event, arg) => {
    let serverInfo = store.get("server-info", {});

    _ARGUS_GATE_ = serverInfo.serverUrl;

    let url = 'http://' + _ARGUS_GATE_ + '/changepwd';
    let result = false;

    let data = encryptStr(
      {
        username: arg.username,
        currentPassword: arg.currentPassword,
        newPassword: arg.newPassword,
      }
    );

    // console.log(data);

    axios({
      url: url,
      method: 'put',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      data: `sec=${encodeURIComponent(data)}`,
      // data: `currentPassword=${encodeURIComponent(arg.currentPassword)}&newPassword=${encodeURIComponent(arg.newPassword)}`,
    })
    .then(function (response) {
      let retJson = response.data;
      // console.log(retJson, typeof retJson);
      // result = retJson; // === "true";
      result = decryptStr(retJson, { result: false }); // === "true";
      // event.returnValue = auth;

      // console.log(result);

      if(result.result == "true") {
        store.set("auth-info", {
          username: arg.username,
          password: arg.newPassword,
        });
      }


    })
    .catch(function (error) {
      console.error(error);
    })
    .then(function () {
      event.returnValue = result;
    });

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
        event.returnValue = {result: true};
      })
      .catch((err) => {
          // console.error(err);
          event.returnValue = {result: false, error: err};
      });
  });

  ipcMain.on("vm-restart", (event, arg) => {
    let machineId = arg;
    let url = 'http://' + _ARGUS_GATE_ + '/vms/restart';

    axios({
      url: url,
      method: 'put',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      data: `machineId=${encodeURIComponent(machineId)}`,
    })
     .then((response) => {
        let retJson = response.data;
        event.returnValue = {result: true};
      })
      .catch((err) => {
          // console.error(err);
          event.returnValue = {result: false, error: err};
      });
  });

  ipcMain.on("vm-connect", (event, arg) => {
    let vmName = arg;
    let osver = process.platform;

    serverInfo = store.get("server-info", {});
    authInfo = store.get("auth-info", {});

    // console.log(serverInfo, authInfo);

    let serverurl = serverInfo.ViewServers[Math.floor(Math.random() * serverInfo.ViewServers.length)];

    let json = {
      serverurl: serverurl,
      username: authInfo.username,
      password: authInfo.password,
      domainname: serverInfo.Domain,
      desktopname: vmName,
    };

    // console.log(json);
    // .serverurl}" --userName "${json.username}" --password "${json.password}" --domainName "${json.domainname}" --desktopName "${json.desktopname}
    // event.returnValue = 'connect: ' + vmName;

    if(osver === "darwin") {
      const psList = require('ps-list');
      psList().then((ps) => {
        // console.log(ps);
        let isExist = false;
        ps.map((p) => {
          if(p.cmd.indexOf('VMware Horizon Client') != -1) {
            console.log(p);
            isExist = true;
          }
        });

        if(isExist) {
          let nextCmd = `osascript -e 'quit app "VMware Horizon Client"'`;
          exec(nextCmd, (err, stdout, stderr) => {
            dialog.showErrorBox('정보', `다시 시도해 주세요.`);
          });

        } else {

          let fpath = "/Applications/VMware\\ Horizon\\ Client.app/Contents/MacOS/vmware-view";
          let cmd = `${fpath} --serverURL="${json.serverurl}" --userName="${json.username}" --password="${json.password}" --domainName="${json.domainname}" --desktopName="${json.desktopname}" --standAlone`;

          exec(cmd, (err, stdout, stderr) => {
            if (err) {
              console.error(err);
              dialog.showErrorBox('에러', `실행 중 에러가 발생했습니다.. \n${err}\n${cmd}`);
              return;
            }
          });

          let password = json.password.replace(/\\/gi, "");
          let nextCmd = `osascript `+
              // `-e 'delay 1' `+
              `-e 'tell app "System Events"' ` +
              // `-e   'if exists (window 1 of process "vmware-view") then' `+
              // `-e     'tell process "vmware-view" to quit' ` +
              // `-e   'end if' ` +
              `-e   'delay 1' `+
              `-e   'tell process "vmware-view"' `+
              `-e     'click button 2 of sheet 1 of window 1' ` +
              `-e     'delay 1' `+
              `-e     'set value of text field 2 of group 1 of window 1 to "${json.username}"' ` +
              `-e     'set value of text field 1 of group 1 of window 1 to "${password}"' ` +
              `-e     'tell app "VMware Horizon Client" to activate' ` +
              `-e     'delay 1' `+
              `-e     'click button 1 of window 1' ` +
              `-e ' end tell' ` +
              `-e 'end tell' `;

          let nextCmd2 = `osascript `+
              `-e 'tell app "System Events"' ` +
              `-e   'delay 1' `+
              `-e   'tell process "vmware-view"' `+
              `-e     'set value of text field "brokerAddressTextField" of group 1 of window 1 to "${json.serverurl}"' ` +
              `-e     'click button 1 of window 1' ` +
              `-e     'delay 1' `+
              `-e     'click button 2 of sheet 1 of window 1' ` +
              `-e     'delay 1' `+
              // `-e     'set value of text field "UsernameTextField" of group 1 of window 1 to "${password}"' ` +
              // `-e     'set value of text field "PasswordTextField" of group 1 of window 1 to "222"' ` +
              // `-e     'delay 5' `+
              `-e     'set focused of text field "UsernameTextField" of group 1 of window 1 to true' ` +
              `-e     'set value of attribute "AXValue" of text field "UsernameTextField" of group 1 of window 1 to "${json.username}"' ` +
              `-e     'delay 0.2' `+
              `-e     'set focused of text field "PasswordTextField" of group 1 of window 1 to true' ` +
              `-e     'set value of attribute "AXValue" of text field "PasswordTextField" of group 1 of window 1 to "${password}"' ` +
              // `-e     'delay 0.2' `+
              // `-e     'set focused of pop up button "DomainPopupButton" of group 1 of window 1 to true' ` +
              // `-e     'set value of attribute "AXValue" of pop up button "DomainPopupButton" of group 1 of window 1 to "SEED02"' ` +
              // `-e     'click button 1 of window 1' ` +
              // `-e     'set value of text field "UsernameTextField" of group 1 of window 1 to "${json.username}"' ` +
              // `-e     'set value of attribute "AXValue" of text field "PasswordTextField" of group 1 of window 1 to ""' ` +
              // `-e     'delay 1' `+
              // `-e     'set value of text field "PasswordTextField" of group 1 of window 1 to "${password}"' ` +
              `-e     'delay 0.5' `+
              `-e     'tell app "VMware Horizon Client" to activate' ` +
              `-e     'click button 1 of window 1' ` +
              `-e   'end tell' ` +
              `-e 'end tell' `;

          exec(nextCmd, (err, stdout, stderr) => {
            if (err) {
              exec(nextCmd2, (err, stdout, stderr) => {
                // console.log(nextCmd2);
                // dialog.showErrorBox('에러', "접속창을 닫으시고 다시 접속을 시도해주세요.");
                if (err) {
                  console.error(err);
                  // dialog.showErrorBox('에러', "다시 접속을 시도해주세요.");
                  return;
                }
              });
            }
          });
        }
      });

      ///////// WINDOWS ///////////

    } else if(osver === "win32") {
      let vmwarePath = '\\VmWare\\VMware Horizon View Client\\vmware-view.exe';
      let findPath = [
        path.join(process.env['ProgramFiles(x86)'] || '', vmwarePath),
        path.join(process.env.ProgramFiles || '', vmwarePath),
        path.join(process.env.ProgramW6432 || '', vmwarePath),
      ];
      let isInstalled = false;

      findPath.some((fpath) => {
        if(fs.existsSync(fpath)) {

          let cmd = `"${fpath}" --serverURL "${json.serverurl}" --userName "${json.username}" --password "${json.password}" --domainName "${json.domainname}" --desktopName "${json.desktopname}" --standAlone`;

          exec(cmd, (err, stdout, stderr) => {
            if (err) {
              console.error(err);
              dialog.showErrorBox('에러', `실행 중 에러가 발생했습니다.. \n${err}\n${cmd}`)
              return;
            }
          });

          isInstalled = true;
          return isInstalled;
        }
      });

      if(!isInstalled) { // 미설치
        dialog.showErrorBox('소프트웨어 미설치', 'VMWare Horizon View Client가 설치되지 않았습니다.')
      }

    } else {
      let fpath = "vmware-view";
      let cmd = `"${fpath}" --nonInteractive --serverURL="${json.serverurl}" --userName="${json.username}" --password="${json.password}" --domainName="${json.domainname}" --desktopName="${json.desktopname}"`;

      exec(cmd, (err, stdout, stderr) => {
        if (err) {
          console.error(err);
          dialog.showErrorBox('에러', `실행 중 에러가 발생했습니다.. \n${err}\n${cmd}`)
          return;
        }
      });
    }
  });

  ipcMain.on("vm-list", (event, arg) => {
    let userId = arg;
    let url = 'http://' + _ARGUS_GATE_ + '/vms/' + userId;
    // let vmList = null; // store.get("vm-list");

    // if(vmList) {
    //   let retJson = vmList;
    //   event.reply('vm-list', retJson);
    // } else {

      console.log("apis.js - vm-list", url);

      axios.get(url)
        .then(function (response) {
          let retJson = response.data;

          if(userId === 'all') {
            store.set("vm-list-admin", retJson);
          } else {
            store.set("vm-list", retJson);
          }

          // console.log("apis.js - vm-list",retJson);

          event.reply('vm-list', retJson);
        })
        .catch(function (error) {
          console.error(error);
          event.reply('vm-list', {error: error});
        })
        .then(function () {
        });

    // }
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
    let vmList = store.get("vm-list") || [];

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

  ipcMain.on("notice-list", (event, arg) => {
    let userId = arg;
    let url = 'http://' + _ARGUS_GATE_ + '/notice';
    let list = null;

    axios.get(url, {
      params: {
      }
    })
      .then(function (response) {
        let retJson = response.data;

        event.reply('notice-list', retJson);
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

  ipcMain.on("change-apply", (event, arg) => {
    let serverInfo = store.get("server-info", {});

    _ARGUS_GATE_ = serverInfo.serverUrl;

    let url = 'http://' + _ARGUS_GATE_ + '/change';

    let data = {
      user: arg.username,
      gb: arg.gb,
      target: arg.content.vmId,
      content: JSON.stringify(arg.content),
      status: 'APPLY',
      approver: '',
    };

    axios({
      url: url,
      method: 'post',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      data: encodeURI(`user=${data.user}&gb=${data.gb}&target=${data.target}&content=${data.content}&status=${data.status}&approver=${data.approver}`),
    })
    .then(function (response) {
      let retJson = response.data;

      // console.log("OK", retJson);

      event.returnValue = "OK";

    })
    .catch(function (error) {
      console.log("ERROR", error);
      event.returnValue = "ERROR";
    })
    .then(function () {
      // event.returnValue = auth;
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

  ipcMain.on("failure-diagnosis", (event, arg) => {
    let retJson = {};

    switch(arg.step) {
      case 0: // NW
        retJson = os.networkInterfaces();
        event.returnValue = retJson;
        break;

      case 1: // SW
        vmwareClient = checkClient();
        __OS__.vhc = vmwareClient;

        retJson = {
          vmwareClient: vmwareClient,
          // ...__OS__
        }
        event.returnValue = retJson;
        break;

      case 2: // VM
        let url = 'http://' + _ARGUS_GATE_ + '/vms/' + arg.auth;

        axios.get(url)
          .then(function (response) {
            retJson = response.data;
            event.returnValue = retJson;
          })
          .catch(function (error) {
            event.returnValue = {};
          });
        break;

      case 3: // SRV

        let srvAddress = _ARGUS_GATE_.split(":");

        tcpp.ping({ address: srvAddress[0], port: srvAddress[1] }, function(err, data) {
          // console.log(data);
          event.returnValue = data;
        });

        // tcpp.probe(srvAddress[0], srvAddress[1], function(err, available) {
        //   // console.log(available);
        //   event.returnValue = available;
        // });

        // event.returnValue = retJson;
        break;

      default:
        event.returnValue = retJson;
    }

  });

  ipcMain.on("failure-apply", (event, arg) => {
    let serverInfo = store.get("server-info", {});

    _ARGUS_GATE_ = serverInfo.serverUrl;

    let url = 'http://' + _ARGUS_GATE_ + '/failure';

    let data = {
      user: arg.username,
      gb: arg.gb,
      target: arg.content.vmId,
      content: JSON.stringify(arg.content),
      status: 'APPLY',
      result: '',
      worker: '',
    };

    axios({
      url: url,
      method: 'post',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      data: encodeURI(`user=${data.user}&gb=${data.gb}&target=${data.target}&content=${data.content}&status=${data.status}&result=${data.result}&worker=${data.worker}`),
    })
      .then(function (response) {
        let retJson = response.data;

        // console.log("OK", retJson);

        event.returnValue = "OK";

      })
      .catch(function (error) {
        console.log("ERROR", error);
        event.returnValue = "ERROR";
      })
      .then(function () {
        // event.returnValue = auth;
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
          setTimeout(() => {
            mainWindow.close();
          }, 1000);
        }
         // 1 for No
        if(res.response== 1){
         // Your Code
        }
      });
    }

  });

  setTimeout(() => {
    autoUpdateCheck(mainWindow, false);
  }, 500);

}

module.exports = {
  init,
};
