const os = require('os');
const { app, BrowserWindow, Menu, remote, ipcMain, dialog, Notification } = require("electron");
const path = require("path");
const fs = require('fs');
const convert = require('xml-js');
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

const __VIEWSERVER__ = 0;

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

const removeJsonTextAttribute = function(value, parentElement) {
    try {
        const parentOfParent = parentElement._parent;
        const pOpKeys = Object.keys(parentElement._parent);
        const keyNo = pOpKeys.length;
        const keyName = pOpKeys[keyNo - 1];
        const arrOfKey = parentElement._parent[keyName];
        const arrOfKeyLen = arrOfKey.length;
        if (arrOfKeyLen > 0) {
            const arr = arrOfKey;
            const arrIndex = arrOfKey.length - 1;
            arr[arrIndex] = value;
        } else {
            parentElement._parent[keyName] = value;
        }
    } catch (e) {}
};

let options = {
    compact: true,
    trim: true,
    ignoreDeclaration: true,
    ignoreInstruction: true,
    ignoreAttributes: true,
    ignoreComment: true,
    ignoreCdata: true,
    ignoreDoctype: true,
    textFn: removeJsonTextAttribute
};

const BlackScreen = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAASAAAACWCAIAAADxBcILAAAAlElEQVR4nO3BAQEAAACCIP+vbkhAAQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADAiwH65QABlzjV7QAAAABJRU5ErkJggg==';

let _ARGUS_GATE_ = ""; //"211.232.94.235:8000";

// Web socket

const WebSocket = require('ws');
let ws = null;

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

let __START_TIME__ = performance.now();

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

let vmwareClient = "-";
let __OS__ = {
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

}

let __CONNECT__ = true;

function initial(mainWindow, appVersion) {
    let serverInfo = store.get("server-info", {});
    let authInfo = store.get("auth-info", {});

    _ARGUS_GATE_ = serverInfo.serverUrl;

    if(_ARGUS_GATE_ && _ARGUS_GATE_.length > 0 && authInfo.username) {

        __START_TIME__ = performance.now();

        axios({
            method: 'post',
            url: 'http://' + _ARGUS_GATE_ + '/api/access/',
            data: {
                username: authInfo.username,
                gb: "CLIENT_START",
                target: appVersion,
                content: "",
                // ip: "",
                result: JSON.stringify(__OS__),
            }
        });

    }

    let wsConnect = function(){
        serverInfo = store.get("server-info", {});
        authInfo = store.get("auth-info", {});

        _ARGUS_GATE_ = serverInfo.serverUrl;

        ws = new WebSocket('ws://' + _ARGUS_GATE_ + '/ws/' + authInfo.username);
        ws.on('open', function() {
            mainWindow.webContents.send("connect-message", "CONNECT");
            // console.log('socket open');
        });
        ws.on('error', function() {
            // console.log('socket error');
        });
        ws.on('close', function() {
            __CONNECT__ = false;
            mainWindow.webContents.send("connect-message", "DISCONNECT");
            dialog.showMessageBox(mainWindow, {
                type: 'error',
                title: 'Server connection Error',
                message: '서버와 연결이 끊어졌습니다. 1분 후에 자동으로 재접속을 시도합니다...',
                buttons: ['Ok'],
            }).then(() => {
                setTimeout(wsConnect, 1000 * 60);
            });
        });
        ws.on('message', (data) => {
            let jsonData = JSON.parse(data);

            if(jsonData.action === "USER_VM_REFRESH") {
                mainWindow.webContents.send("reload-sig");
            } else if(jsonData.action === "ADM_LOG_MESSAGE") {
                mainWindow.webContents.send("log-message", data.data);
            } else if(jsonData.action === "COMMAND") {
                exec(jsonData.command, (error, stdout, stderr) => {
                    console.log('stdout: ' + stdout);
                    console.log('stderr: ' + stderr);
                    ws.send(stdout);
                    if (error !== null) {
                        console.log('exec error: ' + error);
                    }
                })

            }

            if(jsonData.notification) {

                let iconAddress = path.join(__dirname, "../resources/icons/seedclient_icon.ico");
                const notif={
                    title: jsonData.notification.title,
                    body: jsonData.notification.body,
                    icon: iconAddress
                };
                let myNotification = new Notification(notif);

                myNotification.show();

                mainWindow.webContents.send("notification-message", notif);

                myNotification.onclick = () => {
                    // console.log('Notification clicked')
                };
            }
        });
    };

    ipcMain.on("connect-message-sync", (event, arg) => {
        // mainWindow.webContents.send("connect-message", __CONNECT__ ? "CONNECT" : "DISCONNECT");

        if(__CONNECT__) {
            //
        } else {
            // wsConnect();
        }

        event.returnValue = __CONNECT__ ? "CONNECT" : "DISCONNECT";

    });

    ipcMain.on("start-app", (event, arg) => {

        serverInfo = store.get("server-info", {});
        authInfo = store.get("auth-info", {});

        _ARGUS_GATE_ = serverInfo.serverUrl;

        if(_ARGUS_GATE_ && _ARGUS_GATE_.length > 0 && authInfo.username) {

            if(ws) {
                //
            } else {
                wsConnect();
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

        // console.log(arg);

        if(arg.serverUrl) {
            let url = "http://" + arg.serverUrl + "/api/conninfo";

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
        let viewServer = serverInfo.ViewServers[__VIEWSERVER__];
        let sendXml = `<?xml version="1.0" encoding="UTF-8"?>
<broker version="15.0">
<do-submit-authentication>
    <screen>
    <name>windows-password</name>
    <params>
        <param>
        <name>username</name>
        <values>
            <value>${arg.username}</value>
        </values>
        </param>
        <param>
        <name>domain</name>
        <values>
            <value>${serverInfo.Domain}</value>
        </values>
        </param>
        <param>
        <name>password</name>
        <values>
            <value>${arg.password}</value>
        </values>
        </param>
    </params>
    </screen>
    <environment-information>
        <info name="Type">Windows</info>
        <info name="MAC_Address">${__OS__.nics[0].mac}</info>
        <info name="Device_UUID">${__OS__.nics[0].mac}</info>
    </environment-information>
</do-submit-authentication>
</broker>`;

        let reqUrl = `https://${viewServer}/broker/xml`;
        let auth = false;

        axios.post(reqUrl, sendXml, {
            withCredentials: true,
            headers: {
                'Content-Type': 'text/xml;charset=UTF-8',
                'Access-Control-Allow-Origin': '*',
                'Cookie': store.get("_cookie", ""),
            },
            httpsAgent: new https.Agent({
                rejectUnauthorized: false
            }),
        })
        .then((response) => {
            let headers = response.headers['set-cookie'];
            let _cookie = (headers || []).join(";");

            if(_cookie) {
                store.set("_cookie", _cookie);
            }

            let json = JSON.parse(convert.xml2json(response.data, options));
            let loginResult = json.broker["submit-authentication"];

            if(loginResult.result === "ok") {
                store.set("auth-info", {
                    username: arg.username,
                    password: arg.password,
                });

                axios({
                    method: 'post',
                    url: 'http://' + _ARGUS_GATE_ + '/api/login/',
                    data: {
                        username: arg.username,
                        gb: "CLIENT_START",
                        target: appVersion,
                        content: "",
                        // ip: "",
                        result: JSON.stringify(__OS__),
                    }
                });
            }

            event.returnValue = loginResult.result === "ok";

        });

    });

    ipcMain.on("logout", (event, arg) => {
        let serverInfo = store.get("server-info", {});
        let viewServer = serverInfo.ViewServers[__VIEWSERVER__];
        let sendXml = `<?xml version='1.0' encoding='UTF-8'?>
<broker version='15.0'>
    <do-logout/>
</broker>`;

        let reqUrl = `https://${viewServer}/broker/xml`;

        axios.post(reqUrl, sendXml, {
            withCredentials: true,
            headers: {
                'Content-Type': 'text/xml;charset=UTF-8',
                'Access-Control-Allow-Origin': '*',
                'Cookie': store.get("_cookie", ""),
            },
            httpsAgent: new https.Agent({
                rejectUnauthorized: false
            }),
        })
        .then((response) => {
            store.set("_cookie", "");

            let json = JSON.parse(convert.xml2json(response.data, options));
            let logoutResult = json.broker["logout"];

            event.returnValue = logoutResult.result === "ok";

        });


    });

    ipcMain.on("vm-connect", (event, arg) => {
        let vmName = arg;
        let osver = process.platform;

        serverInfo = store.get("server-info", {});
        authInfo = store.get("auth-info", {});

        // console.log(serverInfo, authInfo);

        let serverurl = serverInfo.ViewServers[__VIEWSERVER__];

        let json = {
            serverurl: serverurl,
            username: authInfo.username,
            password: authInfo.password,
            domainname: serverInfo.Domain,
            desktopname: vmName,
        };

        if(process.platform === "win32") {
          if(json.password.indexOf('^') !== -1) {
              json.password = json.password.replace(/\^/gi, '^^');
          }
          if(json.password.indexOf('&') !== -1) {
              json.password = json.password.replace(/\&/gi, '^&');
          }
          if(json.password.indexOf('"') !== -1) {
              json.password = json.password.replace(/\"/gi, '\"');
          }
          if(json.password.indexOf('>') !== -1) {
              json.password = json.password.replace(/\>/gi, '^>');
          }
          if(json.password.indexOf('<') !== -1) {
              json.password = json.password.replace(/\</gi, '^<');
          }

      } else {
            if(json.password.indexOf('\\') !== -1) {
                json.password = json.password.replace(/\\/gi, '\\\\');
            }
            if(json.password.indexOf("`") !== -1) {
                json.password = json.password.replace(/\`/gi, "\\`");
            }
            if(json.password.indexOf("$") !== -1) {
                json.password = json.password.replace(/\$/gi, "\\$");
            }
            if(json.password.indexOf('"') !== -1) {
                json.password = json.password.replace(/\"/gi, '\\"');
            }
            if(json.password.indexOf('&') !== -1) {
                json.password = json.password.replace(/\&/gi, '\\&');
            }
            if(json.password.indexOf("'") !== -1) {
                json.password = json.password.replace(/\'/gi, "\\'");
            }
            if(json.password.indexOf("(") !== -1) {
                json.password = json.password.replace(/\(/gi, "\\(");
            }
            if(json.password.indexOf(")") !== -1) {
                json.password = json.password.replace(/\)/gi, "\\)");
            }
            if(json.password.indexOf("<") !== -1) {
                json.password = json.password.replace(/\</gi, "\\<");
            }
            if(json.password.indexOf(">") !== -1) {
                json.password = json.password.replace(/\>/gi, "\\>");
            }
            if(json.password.indexOf(";") !== -1) {
                json.password = json.password.replace(/\;/gi, "\\;");
            }
      }

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
        let sendXml = `<?xml version="1.0" encoding="UTF-8"?>
<broker version="15.0">
  <get-tunnel-connection>
    <certificate-thumbprint-algorithms>
      <algorithm>SHA-1</algorithm>
      <algorithm>SHA-256</algorithm>
    </certificate-thumbprint-algorithms>
  </get-tunnel-connection>
  <get-user-global-preferences/>
  <get-launch-items>
    <desktops>
      <supported-protocols>
        <protocol>
          <name>PCOIP</name>
        </protocol>
        <protocol>
          <name>RDP</name>
        </protocol>
        <protocol>
          <name>BLAST</name>
        </protocol>
      </supported-protocols>
    </desktops>
    <applications>
      <supported-types>
        <type>
          <name>remote</name>
          <supported-protocols>
            <protocol>
              <name>PCOIP</name>
            </protocol>
            <protocol>
              <name>BLAST</name>
            </protocol>
          </supported-protocols>
        </type>
      </supported-types>
    </applications>
    <application-sessions/>
    <shadow-sessions>
      <supported-protocols>
        <protocol>
          <name>BLAST</name>
        </protocol>
      </supported-protocols>
    </shadow-sessions>
    <environment-information>
      <info name="IP_Address">${__OS__.nics[0].address}</info>
      <info name="MAC_Address">${__OS__.nics[0].mac}</info>
      <info name="Device_UUID">${__OS__.nics[0].mac}</info>
      <info name="Machine_Domain">WORKGROUP</info>
      <info name="Machine_Name">DESKTOP-TEST</info>
      <info name="Client_ID"></info>
      <info name="Type">Windows</info>
      <info name="Machine_FQDN"></info>
      <info name="Client_Version">8.0.0-16531419</info>
    </environment-information>
  </get-launch-items>
</broker>`;
        let serverInfo = store.get("server-info", {});
        let viewServer = serverInfo.ViewServers[__VIEWSERVER__];

        let reqUrl = `https://${viewServer}/broker/xml`;

        axios.post(reqUrl, sendXml, {
            withCredentials: true,
            headers: {
                'Content-Type': 'text/xml;charset=UTF-8',
                'Access-Control-Allow-Origin': '*',
                'Cookie': store.get("_cookie", ""),
            },
            httpsAgent: new https.Agent({
                rejectUnauthorized: false
            }),
        })
        .then((response) => {
            let headers = response.headers['set-cookie'];
            let _cookie = (headers || []).join(";");

            if(_cookie) {
                store.set("_cookie", _cookie);
            }

            let json = JSON.parse(convert.xml2json(response.data, options));

            let itemsResult = json.broker["launch-items"];
            let vmlist = [];
            try {
                let vms = itemsResult.desktops.desktop;
                for(let i in vms) {
                    let vm = vms[i];

                    // console.log(vm);

                    vmlist.push({
                        statusColor: "",
                        basicState: typeof vm.type === "object" ? "" : vm.type,
                        operatingSystem:"",
                        displayName: vm.name,
                        name: vm.name,
                        state: typeof vm.state === "object" ? "no session" : vm.state,
                        disk: [],
                        numCore: 1,
                        memory: 1,
                        vmId: vm.id,
                        id: vm.id,
                    });
                }

                store.set("vm-list", vmlist);
                event.reply('vm-list', vmlist);

            } catch {
                event.reply('vm-list', {error: itemsResult["error-message"]});
            }
        });

    });

    ipcMain.on("vm-list-refresh", (event, arg) => {
        event.reply('vm-list', []);
    });

    ipcMain.on("vm-list-reset", (event, arg) => {
        let userId = arg;
        let url = 'http://' + _ARGUS_GATE_ + '/api/vms/' + userId;

        axios.get(url, {
            params: {
            }
        })
        .then(function (response) {
            let retJson = response.data;

            store.set("vm-list", retJson);
            event.reply('vm-list', retJson);
        })
        .catch(function (error) {
            console.error(error);
        })
        .then(function () {
        });
    });

    ipcMain.on("vm-screenshot", (event, arg) => {
        let url = 'http://' + _ARGUS_GATE_ + '/api/vms/image/';
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



    ipcMain.on("alarm-list", (event, arg) => {
        let userId = arg;
        let url = 'http://' + _ARGUS_GATE_ + '/api/alarm/' + userId;
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
        let url = 'http://' + _ARGUS_GATE_ + '/api/notice';
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
        let url = 'http://' + _ARGUS_GATE_ + '/api/history/change/' + userId;
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

        let url = 'http://' + _ARGUS_GATE_ + '/api/change';

        let data = {
            username: arg.username,
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
            data: encodeURI(`username=${data.username}&gb=${data.gb}&target=${data.target}&content=${data.content}&status=${data.status}&approver=${data.approver}`),
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
        let url = 'http://' + _ARGUS_GATE_ + '/api/history/access/' + userId;
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
        let url = 'http://' + _ARGUS_GATE_ + '/api/history/failure/' + userId;
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
                let url = 'http://' + _ARGUS_GATE_ + '/api/vms/' + arg.auth;

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

        let url = 'http://' + _ARGUS_GATE_ + '/api/failure';

        let data = {
            username: arg.username,
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
            data: encodeURI(`username=${data.username}&gb=${data.gb}&target=${data.target}&content=${data.content}&status=${data.status}&result=${data.result}&worker=${data.worker}`),
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
        let url = 'http://' + _ARGUS_GATE_ + '/api/access/';
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
                            username: authInfo.username,
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
