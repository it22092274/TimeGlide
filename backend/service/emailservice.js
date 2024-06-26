
const nodemailer = require('nodemailer')

const transporter =  nodemailer.createTransport({
    host: 'smtp-relay.brevo.com',
    port: 587,
    secure: false,
    auth: {
        user:'vihanganethusara00@gmail.com',
        pass: 'AVxbHhRFvjTPG8Eg'
    }
})

module.exports = transporter