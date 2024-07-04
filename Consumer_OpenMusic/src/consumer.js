require("dotenv").config();
const amqp = require("amqplib");
const PlaylistsService = require("./PlaylistsService");
const MailSender = require("./MailSender");
const Listener = require("./listener");
const config = require("./config");

const init = async () => {
  const playlistsService = new PlaylistsService();
  const mailSender = new MailSender();
  const listener = new Listener(playlistsService, mailSender);

  const connection = await amqp.connect(config.rabbitMq.server);
  const channel = await connection.createChannel();

  await channel.assertQueue("export:playlists", {
    durable: true,
  });

  channel.consume("export:playlists", listener.listen, { noAck: true });
};

init();
