// main.js

// Modules to control application life and create native browser window
const { app, BrowserWindow, ipcMain } = require('electron')
const path = require('node:path')
const {
  setStorage,
  stopServer,
} = require('./anvil/network-configs/mainnet')
const LocalNetwork = require('./anvil/anvil-setup');

app.commandLine.appendSwitch('ignore-gpu-blacklist');
app.commandLine.appendSwitch('disable-gpu');
app.commandLine.appendSwitch('disable-gpu-compositing');

let anvil; // Declare anvil instance outside to access in both routes

const options = {
    blockTime: 2,
    chainId: 1,
    port: 8545,
    forkUrl: `https://mainnet.infura.io/v3/b6bf7d3508c941499b10025c0776eaf8`,
    forkBlockNumber: 19460144,
  };


const createWindow = () => {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: false, 
    }
  })

  // and load the index.html of the app.
  mainWindow.loadFile('index.html')

  // Open the DevTools.
  // mainWindow.webContents.openDevTools()
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  createWindow()

  app.on('activate', () => {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit()
})

ipcMain.on('start-server', async () => {
  try {
      anvil = new LocalNetwork();
            await anvil.start(options);
            console.log('Anvil server started successfully.');
  } catch (error) {
      console.error('Error starting server:', error);
  }
});

ipcMain.on('stop-server', async () => {
  try {
    stopServer(anvil);
  } catch (error) {
      console.error('Error stopping server:', error);
  }
});

ipcMain.on('seed', async () => {
  try {
    setStorage(anvil, '0x07Be9763a718C0539017E2Ab6fC42853b4aEeb6B')
  } catch (error) {
      console.error('Error starting server:', error);
  }
});