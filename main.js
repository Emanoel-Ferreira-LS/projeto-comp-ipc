const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const url = require('url');

let mainWindow;

function createWindow() {
    mainWindow = new BrowserWindow({
        width: 800,
        height: 600,
        backgroundColor: 'black',
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false
        }
    });

    mainWindow.loadURL(url.format({
        pathname: path.join(__dirname, 'index.html'),
        protocol: 'file:',
        slashes: true
    }));
}

app.on('ready', () => {
    createWindow();
});

// Ouvinte para mensagem assíncrona do renderer.js
ipcMain.on('async-message', (event, message) => {
    // Enviar mensagem de volta para o renderer.js para exibição na interface
    mainWindow.webContents.send('display-async-message', `Mensagem recebida do renderer: ${message}`);
});

// Ouvinte para mensagem síncrona do renderer.js
ipcMain.on('sync-message', (event, message) => {
    // Enviar mensagem de volta para o renderer.js para exibição na interface
    event.returnValue = `Resposta síncrona recebida do renderer: ${message}`;
});

// Enviar mensagem assíncrona do main para o renderer
ipcMain.on('send-message-to-renderer', (event) => {
    mainWindow.webContents.send('display-message-from-main', 'Mensagem assíncrona do main para o renderer');
});

// Enviar mensagem síncrona do main para o renderer
ipcMain.on('send-sync-message-to-renderer', (event) => {
    // Enviar mensagem de volta para o main para exibição no console do main
    event.returnValue = 'Resposta síncrona do renderer para o main';
});
