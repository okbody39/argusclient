"use strict";

// Import parts of electron to use
const os = require('os');
const { app, BrowserWindow, Menu, remote, ipcMain } = require("electron");
const path = require("path");
const url = require("url");
const isDev = require("electron-is-dev");

const autoUpdater = require('./app/updater');

Menu.setApplicationMenu(null);

let mainWindow;

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

    autoUpdater.init(mainWindow);

  });

  mainWindow.on("closed", function() {
    mainWindow = null;
  });
}

app.on("ready", () => {
  createWindow();
});

app.on("window-all-closed", () => {
  // if (process.platform !== "darwin") {
    app.quit();
  // }
});

app.on("activate", () => {
  if (mainWindow === null) {
    createWindow();
  }
});
