const routes = (handler) => [
  {
    method: "POST",
    path: "/albums",
    handler: handler.postAlbumHandler,
  },
  {
    method: "GET",
    path: "/albums/{id}",
    handler: handler.getAlbumByIdHandler,
  },
  {
    method: "PUT",
    path: "/albums/{id}",
    handler: handler.putAlbumByIdHandler,
  },
  {
    method: "DELETE",
    path: "/albums/{id}",
    handler: handler.deleteAlbumByIdHandler,
  },
  {
    method: "POST",
    path: "/albums/{id}/likes",
    handler: handler.likeAlbumByIdHandler,
    options: {
      auth: "authentication_jwt",
    },
  },
  {
    method: "GET",
    path: "/albums/{id}/likes",
    handler: handler.getLikeAlbumHandler,
  },
  {
    method: "DELETE",
    path: "/albums/{id}/likes",
    handler: handler.unlikeAlbumByIdHandler,
    options: {
      auth: "authentication_jwt",
    },
  },
];

module.exports = routes;
