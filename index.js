const { Client, LocalAuth } = require('whatsapp-web.js');
const fs = require('fs');
const path = require('path');

const sent = new Set();

const chromePath = fs.readFileSync(path.join(process.cwd(), 'chrome.txt'), 'utf-8');

const numbersContent = fs.readFileSync(path.join(process.cwd(), 'numbers.txt'), 'utf-8');
const numbersLines = numbersContent.split('\n');
const numbers = numbersLines.map(line => line.trim()).filter(line => line !== '');

const message = fs.readFileSync(path.join(process.cwd(), 'message.txt'), 'utf-8');

const client = new Client({
    authStrategy: new LocalAuth(),
    puppeteer: {
        headless: false,
        executablePath: chromePath
    }
});

client.on('error', (err) => {
    console.error('WhatsApp Client Error:', err);
});


client.on('ready', () => {
    for (const number of numbers) {
        const chat_id = number + '@c.us';
        client.sendMessage(chat_id, message);
    }
});

client.on('message_ack', async (msg, ack) => {
    const number = msg.to.replace('@c.us', '');
    if (numbers.includes(number) && ack >= 1) {
        sent.add(msg.to.replace('@c.us', ''));
    }

    if (sent.size === numbers.length) {
        await client.destroy();
    }
});

client.initialize().catch(err => {
    console.error('Initialization error:', err);
});