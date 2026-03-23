const { app, BrowserWindow, ipcMain } = require('electron');
const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');

function createWindow() {
  const win = new BrowserWindow({
    width: 1000,
    height: 800,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false, // For simplicity in this example
    }
  });
  win.loadFile('index.html');
}

// Handler for executing C++ code
ipcMain.handle('run-cpp', async (event, code) => {
  const filePath = path.join(__dirname, 'temp.cpp');
  const exePath = path.join(__dirname, 'temp.exe');
  
  fs.writeFileSync(filePath, code);

  return new Promise((resolve) => {
    // Compile then Run
    exec(`g++ ${filePath} -o ${exePath} && ${exePath}`, (error, stdout, stderr) => {
      resolve(stdout || stderr || error.message);
    });
  });
});

app.whenReady().then(createWindow);
