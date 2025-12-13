const nodemailer = require('nodemailer');
let transporter = nodemailer.createTransport({
    host: 'smtp.mail.ru',
    port: '465',
    secure: true,
    auth: {
        user: 'aleks.zhmak@mail.ru',
        pass: 'mwtKIBZPcWUDdD2u6cD9',
    }
}, {
    from: 'База знаний <aleks.zhmak@mail.ru>'
})

const sendTestMail = async (email, user) => {
    try {
        await transporter.sendMail({
            to: email,
            subject: 'test letter',
            text: 'Hello world',
            html: `
                        <h1>Тестовое письмо</h1>
                        <i>Здравствуйте ${user},, ${email}</i>
                        <p>Учимся отправлять письма с node.js с выводом в консоль</p>`
        });
        console.log('Письмо отправлено:', email);
    }
    catch (error) {

        console.error('Ошибка отправки письма:', error);
    }
}

module.exports = {sendTestMail};
