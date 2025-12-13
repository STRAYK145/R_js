const morgan = require("morgan");
const logger = require("../utils/logger");
const stream = {
    // Используйте строгость http
    write: (message) => logger.http(message),
};
const skip = () => {
    const env = process.env.NODE_ENV || "development";
    return env !== "development";
};
const morganMiddleware = morgan(
    // Определите строку формата сообщения (она используется по умолчанию).
    // Формат сообщения создается из токенов, и каждый токен
    // определен внутри библиотеки Morgan.
    // Вы можете создать свой пользовательский токен, чтобы показать, чего вы хотите от запроса. 
    ":remote-addr :method :url :status :res[contentlength] - :response-time ms",
    // Параметры: в этом случае я переписал поток и логику пропуска.
    // Смотрите методы выше.
    { stream, skip }
);
module.exports = morganMiddleware;