const AlbumsHandler = require('./handler');
const routes = require('./routes');

module.exports = {
  name: 'albums',
  version: '1.0.0',
  register: async (server, { service, validator, songService }) => {
    const albumsHandler = new AlbumsHandler(service, validator, songService);
    server.route(routes(albumsHandler));
  },
};
