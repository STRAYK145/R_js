const express = require('express');
const app = express();
const auth = require('./routes/auth.routes');
const fileUp = require('./routes/otziv.routes');
const morganMiddleware = require("./middleware/morgan.middleware");
const logger = require("./utils/logger");
app.use(morganMiddleware);
app.use(express.urlencoded({ extended: true }))
app.set('view engine', 'ejs');
app.use(express.json())
app.use("/auth", auth)
app.use("/ost", fileUp);
app.use(express.static('public'));

app.use(morganMiddleware);
app.get("/api/status", (req, res) => {
    logger.info("Проверка статуса API: Все в порядке");
    res.status(200).send({
        status: "Запущен",
        message: "API запущен и работает!"
    });
});

app.get('/', function (req, res) {
    const goroda = [
        {
            name: 'Москва', 
            info: "Узнай интересные факты о городе Москва.",
            put: "./moskv.jpg",
        },
        {
            name: 'Санкт-Петербург', 
            info: "Узнай интересные факты о городе Санкт-Петербург.",
            put: "./spb.jpg",
        },
        {
            name: 'Казань', 
            info: "Узнай интересные факты о городе Казань.",
            put: "./kazan.jpg",
        }
    ];
    res.render('pages/main', {
        goroda: goroda
    });
});

app.post('/otziv', function (req, res) {
    console.log(req.body.name)
    res.end(`User ${req.body.name} ostavil otziv!!!`);
})

app.listen(8080);
console.log('http://localhost:8080/');
logger.info(`Сервер запущен на порту 8080}`);