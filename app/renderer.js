const { ipcRenderer } = require('electron');

function saveAndRun() {
    const chrome = document.getElementById('chrome').value;
    const numbers = document.getElementById('numbers').value;
    const message = document.getElementById('message').value;

    ipcRenderer.send('save-and-run', { chrome, numbers, message });
}

function saveData() {
    const chrome = document.getElementById('chrome').value;
    const numbers = document.getElementById('numbers').value;
    const message = document.getElementById('message').value;

    ipcRenderer.send('save-data', { chrome, numbers, message });
}

ipcRenderer.on('load-data', (event, data) => {
    document.getElementById('chrome').value = data.chrome || '';
    document.getElementById('numbers').value = data.numbers || '';
    document.getElementById('message').value = data.message || '';
});
