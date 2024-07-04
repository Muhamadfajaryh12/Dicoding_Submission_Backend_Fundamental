const config = {
  nodemailerSMTPAuth: {
    mailHost: process.env.SMTP_HOST,
    mailPort: process.env.SMTP_PORT,
    mailUser: process.env.SMTP_USER,
    mailPassword: process.env.SMTP_PASSWORD,
  },
  rabbitMq: {
    server: process.env.RABBITMQ_SERVER,
  },
};

module.exports = config;
