"use strict";

const { app, BrowserWindow, Menu, remote, ipcMain, dialog, Notification } = require("electron");
const axios = require('axios');
const path = require("path");
const fs = require('fs');
const { performance } = require('perf_hooks');

const __INTERVAL_TERM__ = 2000;
const __INTERVAL_MAX__ = 30;
const __TMPDIR__ = process.env.TMPDIR
    || process.env.TMP
    || process.env.TEMP
    || ( process.platform === "win32"
        ? "c:\\windows\\temp"
        : "/tmp" );

let __VM_START_TIME__ = 0;
let _INTERVAL_ = null;
let _INTERVALCNT_ = 0;
let __INTERVAL_STR__ = "............................................................".substr(0, __INTERVAL_MAX__);

// json = {
//      username
//      password
//      domain
//      vmName
//      vmId
//      vcsurl // VCS
//      serverurl // ARGUS Server
// }
function execute(mainWindow, event, json) {
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
    child.loadURL(`https://${json.vcsurl}/portal/webclient/index.html`)

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
                let vmImageFile = path.join(__TMPDIR__, json.vmId + '.png');

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
                url: 'http://' + json.serverurl + '/api/access/',
                data: {
                    username: json.username,
                    gb: "VM_END",
                    target: json.vmName,
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
        // let currentUrl = child.webContents.getURL();
        let username = json.username +"@" + json.domainname;
        let password = json.password;


        setTimeout(() => {
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
                event.reply("vm-connecting", "접속시도 중입니다.");
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
                            url: 'http://' + json.serverurl + '/api/access/',
                            data: {
                                username: json.username,
                                gb: "VM_START",
                                target: json.vmName,
                                content: "",
                                // ip: "",
                                result: "",
                            }
                        });
                    } else if(curUrl.indexOf("#/launchitems") !== -1) {


                        child.webContents.executeJavaScript(`
                                setTimeout(() => {
                                    document.getElementById('${json.vmId}').click();
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

                    event.reply("vm-connecting", "접속시도 중입니다.." + __INTERVAL_STR__.substr(0, _INTERVALCNT_ % 5));

                }, __INTERVAL_TERM__);



            }, 2000);

        }, 1000);

    });

}

module.exports = {
    execute
};
