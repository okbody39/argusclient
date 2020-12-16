"use strict";

const os = require('os');
const {
  app,
  Menu,
  BrowserWindow,
  ipcMain
} = require("electron");

const path = require("path");
const url = require("url");
const isDev = require("electron-is-dev");

const apis = require('./app/apis');

if(!isDev) {
    Menu.setApplicationMenu(null);
}

let mainWindow;

app.commandLine.appendSwitch('--lang', 'ko');
app.commandLine.appendSwitch('--no-sandbox');
app.commandLine.appendSwitch('ignore-certificate-errors', 'true');

if (process.platform === "win32") {
  app.commandLine.appendSwitch("high-dpi-support", "true");
  app.commandLine.appendSwitch("force-device-scale-factor", "1");
}
if(process.platform === "darwin") {
    app.dock.hide();
}

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1024,
    height: 768,
    minWidth: 900,
    minHeight: 600,
    show: false,
    icon: path.join(__dirname, 'src/assets/icons/128x128.png'),
    webPreferences: {
      nodeIntegration: true,
      preload: path.join(__dirname, 'preload.js'),
    }
  });

  

  if (isDev) {
    // mainWindow.webContents.openDevTools();
  } else {
    mainWindow.setMenu(null);
  }

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

  mainWindow.once("ready-to-show", () => {
    mainWindow.show();

    if (isDev) {

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

    apis.init(mainWindow, app.getVersion());

  });

  mainWindow.on("closed", function() {
    mainWindow = null;
  });

}

app.on("ready", () => {
  createWindow();
});

app.on("window-all-closed", () => {
  app.quit();
});

app.on("activate", () => {
  if (mainWindow === null) {
    createWindow();
  }
});
