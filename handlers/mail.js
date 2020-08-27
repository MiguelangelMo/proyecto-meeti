"use strict";
const nodemailer = require("nodemailer");
import { data } from '../config/dataMailer';
import fs from 'fs';
import util from 'util';
import ejs from 'ejs';

export const main = async (options) => {

    // create reusable transporter object using the default SMTP transport
    let transporter = nodemailer.createTransport({
        host: data.host,
        port: data.port,
        auth: {
            user: data.user, // generated ethereal user
            pass: data.pass, // generated ethereal password
        },
    });

    // send mail with defined transport object
    const templateMail = __dirname + `/../views/${options.archivo}.ejs`;
    const transpilarHTML = ejs.compile(fs.readFileSync(templateMail, 'utf8'));
    const html = transpilarHTML({ url: options.url });

    console.log(options)

    await transporter.sendMail({
        from: '"Meeti 👻" <norepley@meeti.com>', // sender address
        to: options.email, // list of receivers
        subject: options.subject, // Subject line
        html,
    });
}
