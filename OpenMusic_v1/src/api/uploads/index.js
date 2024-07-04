const UploadsHandler = require("./handler");
const routes = require("./routes");

module.exports = {
  name: "uploads",
  version: "1.0.0",
  register: async (
    server,
    { uploadsService, albumsService, uploadsValidator }
  ) => {
    const uploadsHandler = new UploadsHandler(
      uploadsService,
      albumsService,
      uploadsValidator
    );
    server.route(routes(uploadsHandler));
  },
};
