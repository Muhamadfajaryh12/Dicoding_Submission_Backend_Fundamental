const routes = (handler) => [
  {
    method: "POST",
    path: "/collaborations",
    handler: handler.postCollaborationHandler,
    options: {
      auth: "authentication_jwt",
    },
  },
  {
    method: "DELETE",
    path: "/collaborations",
    handler: handler.deleteCollaborationHandler,
    options: {
      auth: "authentication_jwt",
    },
  },
];

module.exports = routes;
