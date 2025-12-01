const databaseConfig = require('../config/knexfile');
//относительный путь к файлу настроек
var knex = require('knex')(databaseConfig);
const config = require("../config/auth.config");
var jwt = require("jsonwebtoken");
const bcrypt = require('bcrypt');
exports.signin = (req, res) => {
    knex('users')
        .join({ userroles: 'user_roles' }, 'users.id', '=', 'userroles.user_id')
        .join('roles', 'roles.id', '=', 'userroles.roles_id')
        .where('users.username', req.body.username)
        .select('users.id', 'users.username', 'users.email', 'users.password', 'roles.name')
        .then(async users => {

            if (users.length === 0) {
                return res.status(401).json({ error: 'Пользователь с таким именем не зарегистрировался!' });
            }

            // Проверка пароля
            const valid = await bcrypt.compare(req.body.password, users[0].password);

            if (!valid) {
                return res.status(401).json({ error: 'Неверный пароль!' });
            }

            // Генерация токена
            var token = jwt.sign(
                { id: users[0].id },
                config.secret,
                { expiresIn: 86400 } // 24 часа
            );

            // Список ролей
            const roles = users.map(u => 'ROLE_' + u.name.toUpperCase());

            res.status(200).send({
                id: users[0].id,
                username: users[0].username,
                email: users[0].email,
                roles: roles,
                accessToken: token
            });
        })
        .catch(error => {
            console.error(error);
            res.status(500).json({ error: 'Внутренняя ошибка сервера' });
        });
};
