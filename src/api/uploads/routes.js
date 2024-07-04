const path = require("path");

const routes = (handler) => [
  {
    method: "POST",
    path: "/albums/{albumId}/covers",
    handler: handler.postCoverAlbumHandler,
    options: {
      payload: {
        allow: "multipart/form-data",
        multipart: true,
        output: "stream",
        maxBytes: 512000,
      },
    },
  },
  {
    method: "GET",
    path: "/uploads/{param*}",
    handler: {
      directory: {
        path: path.join(__dirname, "../uploads/file/images"),
      },
    },
  },
];

module.exports = routes;
