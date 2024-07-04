const PlaylistSongActivitiesHandler = require("./handler");
const routes = require("./routes");

module.exports = {
  name: "playlistSongActivities",
  version: "1.0.0",
  register: async (server, { playlistsService, activitiesService }) => {
    const playlistSongActivitiesHandler = new PlaylistSongActivitiesHandler(
      playlistsService,
      activitiesService
    );
    server.route(routes(playlistSongActivitiesHandler));
  },
};
