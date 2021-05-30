const fs = require("fs");
const { GoogleSpreadsheet } = require('google-spreadsheet');
const config = JSON.parse(fs.readFileSync("config.json").toString());

const TelegramBot = require('node-telegram-bot-api');
bot = new TelegramBot(`1370972820:AAH4NTF8v2IIWPL04RUqF1vgfnx3Zyn6rAA`, { polling: true });

if (!fs.existsSync("database.json")) fs.writeFileSync("database.json", JSON.stringify([]));

let bd = JSON.parse(fs.readFileSync("database.json").toString());
let lastMsg = { text: "тест" };

bot.on('message', (msg) => {
    console.log(msg);
    lastMsg = msg;
    let msg_text = msg.text.toLowerCase();

    let find = false;
    // поиск по ключевым словам
    config.keyWords.forEach(key => {
        if (find) return;
        if (msg_text.indexOf(key.toLowerCase()) > -1) {
            find = true;
            let type = "Куплю";

            config.saleWords.forEach(sale => {
                if (msg_text.indexOf(sale.toLowerCase()) > -1) type = "Продам";
            })

            let now = new Date(); // Дата

            // ФИО
            let name = msg.from.first_name && msg.from.last_name ? `${msg.from.last_name} ${msg.from.first_name}` : msg.from.UserName;

            // add data to database
            bd.push({
                date: `${formatDate(now)}`,
                chat: msg.chat.title,
                name: name,
                msg_link: `https://t.me/c/${msg.chat.id.toString().split("-100")[1]}/${msg.message_id}`,
                msg: msg.text,
                type: type,
                inTable: false
            })

            // save database
            fs.writeFileSync("database.json", JSON.stringify(bd));
            updateTable();
        }
    })
})

// функция обновления данных в таблице гугл
async function updateTable() {
    const doc = new GoogleSpreadsheet('1zn2WsFdr7GY9ChQX2YFzZIN6qtpqGSg3In07DCyiDF8'); // id таблицы
    await doc.useServiceAccountAuth(require('./google.json')); // данные для бота

    await doc.loadInfo(); // загрузка информация из таблицы
    console.log(doc.title);

    const sheet = doc.sheetsByIndex[0]; // выбор листа

    // добавления столбцов
    bd.forEach(async (d, ind) => {
        if (!d.inTable) {
            setTimeout(async () => {
                const larryRow = await sheet.addRow({ Date: d.date, Chat: d.chat, UserName: d.name, MsgLink: d.msg_link, Msg: d.msg, Type: d.type });
            }, 1000 * ind)
            d.inTable = true;
            fs.writeFileSync("database.json", JSON.stringify(bd));
        }
    })
}

function formatDate(date) {
    var dd = date.getDate();
    if (dd < 10) dd = '0' + dd;

    var mm = date.getMonth() + 1;
    if (mm < 10) mm = '0' + mm;

    var yy = date.getFullYear() % 100;
    if (yy < 10) yy = '0' + yy;

    return dd + '.' + mm + '.' + yy;
}

// website 
const express = require('express');
const app = express();
let port = process.env.PORT || 80;

let minute = 0;

setInterval(() => {
    minute++
}, 1000 * 60)


app.get('/', (req, res) => {
    res.send(`Бот работает ${minute} минут.\n Последние сообщение: ${JSON.stringify(lastMsg).toString()}`)
})

app.get('/json', (req, res) => {
    res.json(JSON.stringify(bd));
})

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})
