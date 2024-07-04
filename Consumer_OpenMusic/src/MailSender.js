const nodemailer = require("nodemailer");
const config = require("./config");

class MailSender {
  constructor() {
    this._transporter = nodemailer.createTransport({
      host: config.nodemailerSMTPAuth.mailHost,
      port: config.nodemailerSMTPAuth.mailPort,
      auth: {
        user: config.nodemailerSMTPAuth.mailUser,
        pass: config.nodemailerSMTPAuth.mailPassword,
      },
    });
  }
  sendEmail(targetEmail, content) {
    const message = {
      from: "OpenMusic API",
      to: targetEmail,
      subject: "Export Playlist",
      text: "This is an attachment file export of playlist",
      attachments: [
        {
          filename: "playlists.json",
          content,
        },
      ],
    };

    return this._transporter.sendMail(message);
  }
}

module.exports = MailSender;
