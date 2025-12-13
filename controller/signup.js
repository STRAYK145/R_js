const databaseConfig = require('../config/knexfile');
const MailService = require("../service/service");
//относительный путь к файлу настроек
var knex = require('knex')(databaseConfig);
const bcrypt = require('bcrypt');
const { validate } = require('validate.js')
exports.signup = (req, res) => {
    const { username, email, password, roles } =
        req.body;
    const constraints = {
        username: {
            presence: true,
            length: {
                minimum: 4,
                maximum: 20
            },
            format: {
                pattern: /^[^0-9]*$/,
                message: "цифры запрещены"
            }
        },
        password: {
            presence: true,
            length: {
                minimum: 4,
                maximum: 20
            }
        }
    };
    const validation = validate({ username, password },
        constraints);
    if (validation) {
        res.status(400).json({ error: validation });
        return;
    }
    // Хеширование пароля
    bcrypt.hash(password, 10, (err, hashedPassword) => {
        if (err) {
            console.error(err);
            res.status(500).json({
                error: 'Internal server error'
            });
            return;
        }
        knex.transaction(async trx => {
            try {
                const userId = await trx('users')
                    .insert({
                        username, password:
                            hashedPassword, email
                    })
                    .returning('id');
                const roleIds = await trx('roles')
                    .whereIn('name', roles)
                    .pluck('id');
                console.log(roleIds)
                await trx('user_roles').insert(
                    roleIds.map(roleId => ({
                        user_id: userId[0].id,
                        roles_id: roleId
                    }))
                );
                MailService.sendTestMail(email,username);
                res.status(200).send({ message: "Пользователь добавлен" });
            } catch (error) {
                console.error(error);
                res.status(500).json({
                    error: 'Internal server error'
                });
            }
        })
    })
};
