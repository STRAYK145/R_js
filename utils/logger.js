const winston = require('winston');
// Определите свои уровни серьезности.
// С их помощью вы можете создавать файлы журналов, просматривать или скрывать уровни в зависимости от рабочей ЫСРЕДЫ.
const levels = {
    error: 0,
    warn: 1,
    info: 2,
    http: 3,
    debug: 4,
}
// Этот метод устанавливает текущую серьезность на основе текущего NODE_ENV: показывает все уровни журнала, если сервер был запущен в режиме разработки;
// в противном случае, если он был запущен в рабочей среде, отображаются только предупреждения и сообщения об ошибках.
const level = () => {
    const env = process.env.NODE_ENV || 'development'
    const isDevelopment = env === 'development'
    return isDevelopment ? 'debug' : 'warn'
}
// Определите разные цвета для каждого уровня.
// Цвета делают сообщение журнала более заметным, добавляя возможность фокусировать или игнорировать сообщения.
const colors = {
    error: 'red',
    warn: 'yellow',
    info: 'green',
    http: 'magenta',
    debug: 'white',
}
// Скажите winston, что вы хотите связать цвета, определенные выше, с уровнями серьезности.
winston.addColors(colors)
// Выберите аспект вашего журнала, настроив формат журнала.
const format = winston.format.combine(
    // Добавьте временную метку сообщения в предпочтительном формате
    winston.format.timestamp({
        format: 'YYYY-MM-DD HH: mm: ss: ms'
    }),
    // Скажите winston, что бревна должны быть окрашены
    winston.format.colorize({ all: true }),
    // Определите формат сообщения, показывающий временную метку, уровень и само сообщение
    winston.format.printf(
        (info) => `${info.timestamp} ${info.level}: ${info.message}`,
    ),
)
// Определите, какие транспорты должен использовать регистратор для распечатки сообщений.
// В этом примере мы используем три разных транспорта
const transports = [
    // Разрешить использовать консоль для печати сообщений
    new winston.transports.Console(),
    // Разрешить печатать все сообщения об ошибках внутри файла error.log
    new winston.transports.File({
        filename: 'logs/error.log',
        level: 'error',
    }),
    // Разрешить печатать все сообщения об ошибках внутри файла all.log(также журнал ошибок, которые также печатаются внутри файла error.log)
    new winston.transports.File({
        filename:
            'logs/all.log'
    }),
]
// Создайте экземпляр регистратора, который необходимо экспортировать и использовать для регистрации сообщений.
const logger = winston.createLogger({
    level: level(),
    levels,
    format,
    transports,
})
module.exports = logger