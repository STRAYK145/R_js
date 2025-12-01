const express = require('express');
const app = express();
const auth = require('./routes/auth.routes');
app.use(express.urlencoded({ extended: false }))
app.set('view engine', 'ejs');
app.use(express.json())
app.use("/auth", auth)
app.use(express.static('public'));

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