const os = require('os');
const { app, BrowserWindow, Menu, remote, ipcMain, dialog, Notification } = require("electron");
const path = require("path");
const fs = require('fs');
const convert = require('xml-js');
const url = require("url");
const isDev = require("electron-is-dev");

const {spawn, exec} = require('child_process');
const async = require('async');

const tcpp = require('tcp-ping');3
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
let _INTERVAL_ = null;
let _INTERVALCNT_ = 0;
const __INTERVAL_TERM__ = 2000;
const __INTERVAL_MAX__ = 30;

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

let __TMPDIR__ = process.env.TMPDIR
    || process.env.TMP
    || process.env.TEMP
    || ( process.platform === "win32"
        ? "c:\\windows\\temp"
        : "/tmp" );

const BlackScreen = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAASAAAACWCAIAAADxBcILAAAAlElEQVR4nO3BAQEAAACCIP+vbkhAAQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADAiwH65QABlzjV7QAAAABJRU5ErkJggg==';
let _ARGUS_GATE_ = ""; //"211.232.94.235:8000";

// Web socket
const WebSocket = require('ws');
let ws = null;
let __WS_CONNECT__ = true;

const aboutThis = require('./about');
const autoUpdater = require('./updater');

function autoUpdateCheck(mainWindow, isCheck) {
    autoUpdater.init(mainWindow, isCheck);
}

let __START_TIME__ = performance.now();

let __VM_START_TIME__ = 0;

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

// function checkLogin(username, password) {
//     let serverInfo = store.get("server-info", {});
//     let viewServer = serverInfo.ViewServers[__VIEWSERVER__];
//     let sendXml = `<?xml version="1.0" encoding="UTF-8"?>
// <broker version="15.0">
// <do-submit-authentication>
// <screen>
// <name>windows-password</name>
// <params>
//     <param>
//     <name>username</name>
//     <values>
//         <value>${username}</value>
//     </values>
//     </param>
//     <param>
//     <name>domain</name>
//     <values>
//         <value>${serverInfo.Domain}</value>
//     </values>
//     </param>
//     <param>
//     <name>password</name>
//     <values>
//         <value>${password}</value>
//     </values>
//     </param>
// </params>
// </screen>
// <environment-information>
//     <info name="Type">Windows</info>
//     <info name="MAC_Address">${__OS__.nics[0].mac}</info>
//     <info name="Device_UUID">${__OS__.nics[0].mac}</info>
// </environment-information>
// </do-submit-authentication>
// </broker>`;
//
//     let reqUrl = `https://${viewServer}/broker/xml`;
//     let auth = false;
//
//     axios.post(reqUrl, sendXml, {
//         withCredentials: true,
//         headers: {
//             'Content-Type': 'text/xml;charset=UTF-8',
//             'Access-Control-Allow-Origin': '*',
//             'Cookie': store.get("_cookie", ""),
//         },
//         httpsAgent: new https.Agent({
//             rejectUnauthorized: false
//         }),
//     })
//     .then((response) => {
//         let headers = response.headers['set-cookie'];
//         let _cookie = (headers || []).join(";");
//
//         if(_cookie) {
//             store.set("_cookie", _cookie);
//         }
//
//         let json = JSON.parse(convert.xml2json(response.data, options));
//         let loginResult = json.broker["submit-authentication"];
//
//         console.log(JSON.stringify(json), serverInfo.Domain);
//
//         return loginResult.result === "ok"  || loginResult["error-code"] === "ALREADY_AUTHENTICATED";
//
//     });
// }

// console.log(vmwareClient);
// process.exit(0);

// const spawn = require('child_process').spawnSync;
// const ls = spawn('wmic', ['-l']);

function init(mainWindow, appVersion) {

    vmwareClient = checkClient();
    __OS__.vhc = vmwareClient;

    initial(mainWindow, appVersion);

}

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
            __WS_CONNECT__ = false;
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
        // mainWindow.webContents.send("connect-message", __WS_CONNECT__ ? "CONNECT" : "DISCONNECT");

        if(__WS_CONNECT__) {
            //
        } else {
            // wsConnect();
        }

        event.returnValue = __WS_CONNECT__ ? "CONNECT" : "DISCONNECT";

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

            // let isLogin = checkLogin(authInfo.username, authInfo.password);

            // console.log(isLogin, authInfo);

            // event.reply('start-app', isLogin ? 'OK' : 'INVALIDSESSION');
            event.reply('start-app', 'OK');
        } else {

            if(_ARGUS_GATE_ && _ARGUS_GATE_.length > 0) {
                if(authInfo.username) {
                } else {
                    event.reply('start-app', 'INVALIDSESSION');
                    return;
                }
            } else {

            }


            // settingThis.run(mainWindow);

            store.set("server-info", {});
            store.set("auth-info", {});

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


        // console.log(serverInfo, arg);

        if(serverInfo.serverUrl) {

            let url = "http://" + serverInfo.serverUrl + "/api/conninfo";

            axios.get(url)
            .then(function (response) {

                let decipher = crypto.createDecipheriv('aes-256-cbc', ENC_KEY, IV);
                let encVal = response.data;
                let decVal = decipher.update(encVal, 'base64', 'utf8');

                decVal += decipher.final('utf8');
                let decJson = JSON.parse(decVal);
                decJson.serverUrl = serverInfo.serverUrl;

                store.set("server-info", {
                    serverUrl: serverInfo.serverUrl,
                    ViewServers: decJson.ViewServers,
                    Domain: decJson.Domain,
                });

                // console.log(store.get("server-info"));


                ////////////////////

                let viewServer = decJson.ViewServers[__VIEWSERVER__];

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

                    if(loginResult.result === "partial") {
                        loginResult.authentication.screen.params.param.map((p) => {
                            if(p.name === "error") {
                                event.returnValue = {
                                    result: false,
                                    error: p.values.value,
                                };
                            }
                        });
                        return;
                    }

                    if(loginResult.result === "ok" || loginResult["error-code"] === "ALREADY_AUTHENTICATED") {
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

                    event.returnValue = {
                        result: loginResult.result === "ok"  || loginResult["error-code"] === "ALREADY_AUTHENTICATED",
                        error: loginResult["user-message"]
                    };

                });

                ////////////////////

            })
            .catch(function (error) {
                console.log(error);
                event.returnValue = {
                    result: false,
                    error: JSON.stringify(error),
                };
            });
        }

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

        })
        .catch((err) =>{
            event.returnValue = JSON.stringify(err);
        });


    });

    ipcMain.on("vm-connect", (event, arg) => {
        let vm = arg;
        let vmName = vm.name
        let vmId = vm.vmId;
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

        //////////////////////////////

        const child = new BrowserWindow({
            parent: mainWindow,
            modal: process.platform !== "darwin",
            show: false, // isDev,
            width: 1500,
            height: 1000,
            webPreferences: {
                allowRunningInsecureContent: true
            }
        });
        // child.webContents.openDevTools();
        child.setMenu(null);
        child.loadURL(`https://${serverurl}/portal/webclient/index.html`)
        // child.on("closed", async() => {
        //     await child.webContents.capturePage().then( image => {
        //
        //         fs.writeFileSync('test.png', image.toPNG(), (err) => {
        //             if (err) throw err
        //         });
        //
        //         console.log('It\'s saved!')
        //         // return image.toDataURL()
        //
        //     });
        //
        // });
        child.once('close', async() => {
            event.reply("vm-connect", "CLOSE");

            if(__VM_START_TIME__) {
                await child.webContents.capturePage().then(image => {
                    let vmImageFile = path.join(__TMPDIR__, vmName + '.png');

                    console.log(vmImageFile);

                    fs.writeFileSync(vmImageFile, image.toPNG(), (err) => {
                        if (err) throw err
                    });

                    // console.log('It\'s saved!')
                    // return image.toDataURL()

                });
            }

            _INTERVALCNT_ = 0;
            clearInterval(_INTERVAL_);

            let endTime = performance.now();
            let timeDiff = endTime - __VM_START_TIME__;
            timeDiff /= 1000;
            let seconds = Math.round(timeDiff);

            if(__VM_START_TIME__) {
                axios({
                    method: 'post',
                    url: 'http://' + _ARGUS_GATE_ + '/api/access/',
                    data: {
                        username: authInfo.username,
                        gb: "VM_END",
                        target: vmName,
                        content: seconds,
                        // ip: "",
                        result: "",
                    }
                });
            } else {
                //
            }

            __VM_START_TIME__ = 0;


        });
        child.once('ready-to-show', () => {
        });
        child.webContents.on('did-finish-load', () => {
            let currentUrl = child.webContents.getURL();
            let username = json.username +"@" + json.domainname;
            let password = json.password;


            setTimeout(() =>{
                child.webContents.executeJavaScript(`
                    setTimeout(() => {

                        let selectedDomain = document.querySelector('.ui-selectmenu-text').innerText;

                        if(selectedDomain === "*DefaultDomain*") {
                            document.querySelector('input[name="username"]').value = '${username}';
                        } else {
                            document.querySelector('input[name="username"]').value = '${json.username}';
                        }

                        document.querySelector('input[name="password"]').value = '${password}';

                        setTimeout(() => {
                            var evt = document.createEvent("HTMLEvents");
                            evt.initEvent("change", false, true);

                            document.getElementById('username').dispatchEvent(evt);
                            document.getElementById('password').dispatchEvent(evt);

                            document.getElementById('password').focus();

                            setTimeout(function() {
                                document.getElementById("loginButton").click();
                            }, 500);
                        }, 500);

                    }, 500);
                `).then((result) => {
                    // dialog.showErrorBox('접속 에러', result);
                }).catch((err) =>{
                    // console.log('>>>>', err);
                });

                setTimeout(() => {
                    _INTERVAL_ = setInterval(() => {
                        let curUrl = child.webContents.getURL();
                        // console.log(">>>>", curUrl);

                        if(curUrl.indexOf("#/desktop") !== -1) {
                            child.show();
                            _INTERVALCNT_ = 0;
                            clearInterval(_INTERVAL_);
                            event.reply("vm-connect", "DONE");

                            __VM_START_TIME__ = performance.now();

                            axios({
                                method: 'post',
                                url: 'http://' + _ARGUS_GATE_ + '/api/access/',
                                data: {
                                    username: authInfo.username,
                                    gb: "VM_START",
                                    target: vmName,
                                    content: "",
                                    // ip: "",
                                    result: "",
                                }
                            });
                        } else if(curUrl.indexOf("#/launchitems") !== -1) {

                            child.webContents.executeJavaScript(`
                                setTimeout(() => {
                                    document.getElementById('${vmId}').click();
                                }, 0);
                            `)
                            .then()
                            .catch();

                        } else {
                            child.webContents.executeJavaScript(`
                                try {
                                    document.querySelector('div[class="dialog-content"]').innerText;
                                } catch {
                                    try {
                                        document.querySelector('div.alert.alert-danger').innerText;
                                    } catch {
                                        document.querySelector('#errorMsg').innerText;
                                    }
                                }

                            `).then((result) => {

                                // console.log("["+result.replace(/\r\n/g, '').trim()+"]");

                                let rslt = result.replace(/\r\n/g, '').trim();

                                if(rslt) {
                                    _INTERVALCNT_ = 0;
                                    clearInterval(_INTERVAL_);
                                    child.close();

                                    event.reply("vm-connect", "ERROR");

                                    dialog.showErrorBox('접속 에러', result);
                                }

                            }).catch((err) =>{
                                // console.log('**>>>>', err);
                            });
                        }

                        _INTERVALCNT_ ++;

                        // INTERVAL Count 초과시 에러 발생
                        if(_INTERVALCNT_ > __INTERVAL_MAX__) {
                            // child.show();
                            _INTERVALCNT_ = 0;
                            clearInterval(_INTERVAL_);

                            // child.hide();
                            child.close();

                            event.reply("vm-connect", "ERROR");

                            dialog.showErrorBox('접속 에러', '접속에 실패하였습니다. 문제가 계속 발생시 관리자에게 문의해 주시기 바랍니다.');

                        }

                    }, __INTERVAL_TERM__);

                }, 2000);

            }, 1000);

        });

        return;

        //////////////////////////////

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

        if(osver === "win32") {
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

            // console.log(itemsResult.desktops.desktop);

            let vmlist = [];
            try {
                let vms = itemsResult.desktops.desktop;

                if(vms.length) {
                    //
                } else {
                    vms = [vms];
                }

                for(let i in vms) {
                    let vm = vms[i];

                    vmlist.push({
                        // image: imgSrcString,
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
                        detail: vm,
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
        let vmList = store.get("vm-list") || [];

        // console.log(">>> VM_SCREENSHOT <<<");

        vmList.map((vm) => {

            let vmImageFile = path.join(__TMPDIR__, vm.name + ".png");
            let imgSrcString = null;
            if(fs.existsSync(vmImageFile)) {
                let data = fs.readFileSync(vmImageFile);
                let base64Image = Buffer.from(data, 'binary').toString('base64');
                imgSrcString = `data:image/png;base64,${base64Image}`;
            } else {
                // let data = fs.readFileSync("/src/assets/images/preview/windows_3.png");
                // let base64Image = Buffer.from(data, 'binary').toString('base64');
                // imgSrcString = `data:image/png;base64,${base64Image}`;

                imgSrcString = ""; // BlackScreen;
            }

            // console.log(imgSrcString);

            let retJson = {
                id: vm.id,
                image: imgSrcString,
            };

            event.reply('vm-screenshot', retJson);

            // axios.get(url + vm.id, {})
            // .then(function (response) {
            //     let retJson = {
            //         id: vm.id,
            //         image: response.data,
            //     };
            //
            //     event.reply('vm-screenshot', retJson);
            //
            // })
            // .catch(function (error) {
            //     let retJson = {
            //         id: vm.id,
            //         image: BlackScreen,
            //     };
            //     event.reply('vm-screenshot', retJson);
            // })
            // .then(function () {
            // });
        });
    });

    ipcMain.on("vm-info", (event, arg) => {
        let url = 'http://' + _ARGUS_GATE_ + '/api/vminfo';
        let vmId = arg.split(",")[0].substr(3);
        console.log(vmId);

        axios.post(url, {
            vmId: vmId
        })
        .then(function (response) {
            let retJson = response.data;

            // event.reply('vm-info', retJson);
            event.returnValue = retJson;
        })
        .catch(function (error) {
            console.error(error);
            event.returnValue = {};
        })
        .then(function () {
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

            let choice = dialog.showMessageBox(mainWindow,
                {
                    type: 'question',
                    buttons: ['Yes', 'No'],
                    title: 'Confirm',
                    message: 'Are you sure you want to quit?'
                });

            choice.then(function(res){

                if(res.response === 0){

                    let serverInfo = store.get("server-info", {});

                    let viewServer = serverInfo.ViewServers[__VIEWSERVER__];
                    let sendXml = `<?xml version='1.0' encoding='UTF-8'?><broker version='15.0'><do-logout/></broker>`;

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

                    })
                    .catch((err) =>{
                        // event.returnValue = JSON.stringify(err);
                    })
                    .finally(() => {

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

                    });

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
