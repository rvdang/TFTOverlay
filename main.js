const { app, BrowserWindow } = require("electron");
const path = require("path");

let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 375,
    height: 92,
    transparent: true,
    frame: false,
    resizable: false,
    alwaysOnTop: true,
    webPreferences: {
      nodeIntegration: true
    }
  });

  mainWindow.loadFile("index.html");
  // mainWindow.webContents.openDevTools()

  mainWindow.setMaximizable(false);

  mainWindow.on("closed", function() {
    mainWindow = null;
  });
}

app.on("ready", createWindow);

app.on("window-all-closed", function() {
  if (process.platform !== "darwin") app.quit();
});

app.on("activate", function() {
  if (mainWindow === null) createWindow();
});
