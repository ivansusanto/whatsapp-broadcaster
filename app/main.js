const { app, BrowserWindow, ipcMain, dialog } = require('electron');
const path = require('path');
const fs = require('fs');
const { execFile } = require('child_process');

function createWindow() {
    const win = new BrowserWindow({
        width: 580,
        height: 720,
        autoHideMenuBar: true,
        webPreferences: {
            preload: path.join(__dirname, 'renderer.js'),
            contextIsolation: false,
            nodeIntegration: true
        }
    });

    win.loadFile('index.html');

    win.webContents.on('did-finish-load', () => {
        const chrome = fs.existsSync('chrome.txt') ? fs.readFileSync('chrome.txt', 'utf-8') : '';
        const numbers = fs.existsSync('numbers.txt') ? fs.readFileSync('numbers.txt', 'utf-8') : '';
        const message = fs.existsSync('message.txt') ? fs.readFileSync('message.txt', 'utf-8') : '';

        win.webContents.send('load-data', { chrome, numbers, message });
    });
}

app.whenReady().then(createWindow);

ipcMain.on('save-and-run', (event, data) => {
    data.chrome = data.chrome.replaceAll('\\', '/').replaceAll('"', '');

    fs.writeFileSync('chrome.txt', data.chrome);
    fs.writeFileSync('numbers.txt', data.numbers);
    fs.writeFileSync('message.txt', data.message);

    event.sender.send('load-data', data);

    const exePath = path.join(__dirname, 'support.exe');
    execFile(exePath, (err) => {
        if (err) {
            dialog.showErrorBox('Execution Error', 'Failed to run WhatsApp Broadcaster.exe.\n\n' + err.message);
        } else {
            dialog.showMessageBox({
                type: 'info',
                title: 'Broadcast Sent',
                message: 'WhatsApp Broadcaster has been launched successfully.'
            });
        }
    });
});

ipcMain.on('save-data', (event, data) => {
    data.chrome = data.chrome.replaceAll('\\', '/').replaceAll('"', '');

    fs.writeFileSync('chrome.txt', data.chrome);
    fs.writeFileSync('numbers.txt', data.numbers);
    fs.writeFileSync('message.txt', data.message);

    dialog.showMessageBox({
        type: 'info',
        title: 'Data Saved',
        message: 'The data has been saved successfully.'
    });

    event.sender.send('load-data', data);
});