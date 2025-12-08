const multer = require("multer");
const path = require("path");
const databaseConfig = require('../config/knexfile');
const knex = require('knex')(databaseConfig);
const express = require("express");
const router = express.Router();


router.get('/otziv', (req, res) => {
    res.render('pages/otziv2');
});
// Задаем параметры для хранения файла(где, как будут называться)
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "uploads");
    },
    filename: function (req, file, cb) {
        cb(
            null, file.fieldname + "-" + Date.now() +
        path.extname(file.originalname)
        );
    },
});
const upload = multer({ storage: storage });
// Добавление файла
router.post("/uploadPhoto",
    upload.single("myImage"),
    (req, res) => {

        const name = req.body.name;
        const text = req.body.text;

        // Если файл загружен — готовим объект
        const fileObj = req.file
            ? {
                data: req.file.filename,
                contentType: req.file.mimetype
            }
            : null;

        // 1. Сначала сохраняем файл
        if (fileObj) {
            knex("file")
                .insert(fileObj)
                .returning("id")
                .then(fileResult => {

                    const fileId = fileResult[0].id ?? fileResult[0];

                    // 2. Теперь сохраняем отзыв
                    return knex("otziv").insert({
                        Name: name,
                        TextOT: text,
                        fileId: fileId
                    });
                })
                .then(() => {
                    res.json("Отзыв и фото успешно загружены");
                })
                .catch(err => {
                    console.error(err);
                    res.status(500).json({
                        error: "Internal Server Error"
                    });
                });

        } else {
            // Если фото нет — записываем отзыв без картинки
            knex("otziv")
                .insert({
                    Name: name,
                    TextOT: text,
                    fileId: null
                })
                .then(() => {
                    res.json("Отзыв сохранён (без фото)");
                })
                .catch(err => {
                    console.error(err);
                    res.status(500).json({
                        error: "Internal Server Error"
                    });
                });
        }
    });


// Вывод файла
router.get("/:fileId", (req, res) => {
    const fileId = req.params.fileId;
    knex('file')
        .select("*")
        .where({ data: fileId })
        .then(file => {
            if (file[0]) {
                const filePath = path.join(
                    __dirname,
                    "..",
                    "/uploads",
                    file[0].data
                );
                res.setHeader("Content-Type",
                    file[0].contentType)
                res.sendFile(filePath);
            } else {
                res.send("Нет фото")
            }
        })
        .catch(err => {
            console.error(err);
            res.status(500).json({
                error: 'Internal Server Error'
            });
            // Отправка ошибки в формате JSON
        });
});

router.post("/vPh", (req, res) => {
    const fileId = req.body.name;

    knex("file")
        .select("*")
        .where({ id: fileId })
        .then(files => {
            if (files[0]) {
                // редирект на GET URL с именем файла
                res.redirect(`/ost/vPh/${fileId}/${encodeURIComponent(files[0].data)}`);
            } else {
                res.send("Фото с таким ID не найдено");
            }
        })
        .catch(err => {
            console.error(err);
            res.status(500).json({ error: "Internal Server Error" });
        });
});

// GET обработчик для отображения файла
router.get("/vPh/:id/:filename", (req, res) => {
    const fileId = req.params.id;

    knex("file")
        .select("*")
        .where({ id: fileId })
        .then(files => {
            if (files[0]) {
                const filePath = path.join(__dirname, "..", "uploads", files[0].data);
                res.setHeader("Content-Type", files[0].contentType);
                // файл открывается в браузере
                res.sendFile(filePath);
            } else {
                res.status(404).send("Фото с таким ID не найдено");
            }
        })
        .catch(err => {
            console.error(err);
            res.status(500).json({ error: "Internal Server Error" });
        });
});



module.exports = router;