const routes = (handler) => [
  {
    method: "POST",
    path: "/playlists",
    handler: handler.postPlaylistHandler,
    options: {
      auth: "authentication_jwt",
    },
  },
  {
    method: "GET",
    path: "/playlists",
    handler: handler.getPlaylistsHandler,
    options: {
      auth: "authentication_jwt",
    },
  },
  {
    method: "DELETE",
    path: "/playlists/{id}",
    handler: handler.deletePlaylistByIdHandler,
    options: {
      auth: "authentication_jwt",
    },
  },
  {
    method: "POST",
    path: "/playlists/{id}/songs",
    handler: handler.postPlaylistSongHandler,
    options: {
      auth: "authentication_jwt",
    },
  },
  {
    method: "GET",
    path: "/playlists/{id}/songs",
    handler: handler.getPlaylistSongByIdHandler,
    options: {
      auth: "authentication_jwt",
    },
  },
  {
    method: "DELETE",
    path: "/playlists/{id}/songs",
    handler: handler.deletePlaylistSongHandler,
    options: {
      auth: "authentication_jwt",
    },
  },
];

module.exports = routes;
