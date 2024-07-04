const ExportsHandler = require("./handler");
const routes = require("./routes");

module.exports = {
  name: "exports",
  version: "1.0.0",
  register: async (
    server,
    { exportsService, playlistService, exportsValidator }
  ) => {
    const exportsHandler = new ExportsHandler(
      exportsService,
      playlistService,
      exportsValidator
    );
    server.route(routes(exportsHandler));
  },
};
