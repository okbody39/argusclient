"use strict";

// Import parts of electron to use
const os = require('os');
const { app, BrowserWindow, Menu, remote, ipcMain } = require("electron");
const path = require("path");
const url = require("url");
const isDev = require("electron-is-dev");

const { autoUpdater } = require("electron-updater");

const server = 'http://211.232.94.233:1337';
const platform = `${os.platform()}_${os.arch()}`;
const feed = `${server}/update/${platform}`;

autoUpdater.setFeedURL(feed);
autoUpdater.logger = require("electron-log");
autoUpdater.logger.transports.file.level = 'info';
autoUpdater.autoInstallOnAppQuit = true;

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow;
let modalWindow;

// Temporary fix broken high-dpi scale factor on Windows (125% scaling)
// info: https://github.com/electron/electron/issues/9691
if (process.platform === "win32") {
  app.commandLine.appendSwitch("high-dpi-support", "true");
  app.commandLine.appendSwitch("force-device-scale-factor", "1");
}

function createWindow() {
  // Create the browser window.
  mainWindow = new BrowserWindow({
    width: 1024,
    height: 768,
    show: false,
    icon: path.join(__dirname, 'src/assets/icons/128x128.png'),
  });

  // and load the index.html of the app.
  let indexPath;

  if (isDev && process.argv.indexOf("--noDevServer") === -1) {
    indexPath = url.format({
      protocol: "http:",
      host: "localhost:3100",
      pathname: "index.html",
      slashes: true
    });
  } else {
    indexPath = url.format({
      protocol: "file:",
      pathname: path.join(__dirname, "dist", "index.html"),
      slashes: true
    });
  }

  mainWindow.loadURL(indexPath);

  // Don't show until we are ready and loaded
  mainWindow.once("ready-to-show", () => {
    mainWindow.show();

    // Open the DevTools automatically if developing
    if (isDev) {
      // mainWindow.webContents.openDevTools();

      mainWindow.webContents.on("context-menu", (e, props) => {
        const { x, y } = props;

        Menu.buildFromTemplate([
          {
            label: "Inspect element",
            click: () => {
              mainWindow.inspectElement(x, y);
            }
          }
        ]).popup(mainWindow);
      });
    }

    // autoUpdater.checkForUpdates();
    autoUpdater.checkForUpdates();

  });

  // Emitted when the window is closed.
  mainWindow.on("closed", function() {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    mainWindow = null;
  });
}

function updateModal(parent) {
  modalWindow = new BrowserWindow({
    width: 500, height: 220,
    'parent': parent,
    'show': false,
    // 'modal': true,
    'alwaysOnTop' : true,
    // 'title' : 'New update!',
    'autoHideMenuBar': true,
    'webPreferences' : {
      "nodeIntegration":true,
      "sandbox" : false
    }
  });
  modalWindow.on('closed', () => {
    modalWindow = null;
  });

  let indexPath;

  if (isDev && process.argv.indexOf("--noDevServer") === -1) {
    indexPath = url.format({
      protocol: "http:",
      host: "localhost:3100",
      pathname: "update.html",
      slashes: true
    });
  } else {
    indexPath = url.format({
      protocol: "file:",
      pathname: path.join(__dirname, "dist", "update.html"),
      slashes: true
    });
  }

  // Load the HTML dialog box
  modalWindow.loadURL(indexPath);
  modalWindow.once('ready-to-show', () => { modalWindow.show() })
}

// ipcMain.on("openDialog", (event, data) => {
//   // event.returnValue = JSON.stringify(promptOptions, null, '')
// });
//
// // Called by the dialog box when closed
//
// ipcMain.on("closeDialog", (event, data) => {
//   // console.log(data);
// });

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on("ready", () => {
  // if (!isDev) {
  //   autoUpdater.checkForUpdates();
  // }
  createWindow();
});

// Quit when all windows are closed.
app.on("window-all-closed", () => {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  // if (process.platform !== "darwin") {
    app.quit();
  // }
});

app.on("activate", () => {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) {
    createWindow();
  }
});

///

autoUpdater.on('checking-for-update', () => {
  // autoUpdater.logger.info('Checking for update...');
});
autoUpdater.on('update-available', (info) => {
  updateModal(mainWindow);
  // autoUpdater.logger.info('Update available.' + JSON.stringify(info));
  setTimeout(() => {
    modalWindow.webContents.send('status-data', "Update available.");
    modalWindow.webContents.send('version-data', info);
  }, 1000);

});

autoUpdater.on('update-not-available', () => {
  // autoUpdater.logger.info('Update not available.');
  // modalWindow.webContents.send('status-data', "Update not available.");
});
autoUpdater.on('error', () => {
  // autoUpdater.logger.info('Error in auto-updater.');
  modalWindow.webContents.send('status-data', "Error in auto-updater.");
});
autoUpdater.on('download-progress', (progressObj) => {
  // autoUpdater.logger.info('Download progress... ' + progressObj.percent + '%');
  modalWindow.webContents.send('progress-data', progressObj.percent);
});
// autoUpdater.on('update-downloaded', (info) => {
//   // autoUpdater.logger.info('Update downloaded; will install in 5 seconds');
//   modalWindow.webContents.send('status-data', "Update downloaded; will restart in 5 seconds");
//   setTimeout(() => {
//     // app.quit();
//     // app.relaunch();
//
//     app.removeAllListeners("window-all-closed");
//     autoUpdater.quitAndInstall(false);
//
//   }, 5000);
// });

autoUpdater.on('update-downloaded', (ev, info) => {
  modalWindow.webContents.send('status-data', "Update downloaded; will restart in 5 seconds");
  setTimeout(() => {
    autoUpdater.quitAndInstall();
  }, 5000);
  // setImmediate(() => {
  //   autoUpdater.quitAndInstall(true, true);
  // });
});


// autoUpdater.downloadUpdate().then(() => {
//   if(modalWindow.webContents) {
//     modalWindow.webContents.send('status-data', "Wait for post download operation");
//   }
// }).catch(downloadError => {
//   console.error(downloadError);
// });
