const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');

let win;

function createWindow() {
  win = new BrowserWindow({
    width: 420,
    height: 460,
    resizable: false,
    frame: false, // we draw our own pink/blue titlebar like the reference video
    backgroundColor: '#00000000',
    transparent: false,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false
    }
  });

  win.loadFile(path.join(__dirname, 'index.html'));
  // win.webContents.openDevTools({ mode: 'detach' }); // uncomment for debugging
}

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) createWindow();
});

// custom titlebar controls (minimize / close), since window is frameless
ipcMain.on('window-minimize', () => win.minimize());
ipcMain.on('window-close', () => win.close());
