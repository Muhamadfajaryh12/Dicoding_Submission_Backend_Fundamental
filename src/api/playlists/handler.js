class PlaylistsHandler {
  constructor(playlistsService, songsService, activitiesService, validator) {
    this._playlistsService = playlistsService;
    this._songsService = songsService;
    this._activitiesService = activitiesService;
    this._validator = validator;

    this.postPlaylistHandler = this.postPlaylistHandler.bind(this);
    this.getPlaylistsHandler = this.getPlaylistsHandler.bind(this);
    this.deletePlaylistByIdHandler = this.deletePlaylistByIdHandler.bind(this);
    this.postPlaylistSongHandler = this.postPlaylistSongHandler.bind(this);
    this.getPlaylistSongByIdHandler =
      this.getPlaylistSongByIdHandler.bind(this);
    this.deletePlaylistSongHandler = this.deletePlaylistSongHandler.bind(this);
  }

  async postPlaylistHandler(request, h) {
    this._validator.validatePlaylistsPayload(request.payload);
    const { name } = request.payload;
    const { id: credentialId } = request.auth.credentials;
    const playlistId = await this._playlistsService.addPlaylist({
      name,
      owner: credentialId,
    });

    const response = h.response({
      status: "success",
      message: "Success insert data",
      data: {
        playlistId,
      },
    });
    response.code(201);
    return response;
  }

  async getPlaylistsHandler(request, h) {
    const { id: credentialId } = request.auth.credentials;
    const playlists = await this._playlistsService.getPlaylists(credentialId);
    return {
      status: "success",
      data: {
        playlists,
      },
    };
  }

  async deletePlaylistByIdHandler(request, h) {
    const { id: credentialId } = request.auth.credentials;
    const { id } = request.params;
    await this._playlistsService.verifyPlaylistOwner(id, credentialId);
    await this._playlistsService.deletePlaylistById(id);

    return {
      status: "success",
      message: "Success delete data",
    };
  }

  async postPlaylistSongHandler(request, h) {
    this._validator.validatePlaylistSongsPayload(request.payload);
    const { id: credentialId } = request.auth.credentials;
    const { id } = request.params;
    const { songId } = request.payload;

    await this._songsService.getSongById(songId);
    await this._playlistsService.verifyPlaylistAccess(id, credentialId);
    await this._playlistsService.addPlaylistSong(id, songId);

    const action = "add";
    const time = new Date().toISOString();
    await this._activitiesService.addPlaylistSongActivities(id, {
      songId,
      userId: credentialId,
      action,
      time,
    });

    const response = h.response({
      status: "success",
      message: "Success insert data",
    });
    response.code(201);
    return response;
  }

  async getPlaylistSongByIdHandler(request, h) {
    const { id } = request.params;
    const { id: credentialId } = request.auth.credentials;

    await this._playlistsService.verifyPlaylistAccess(id, credentialId);
    const playlist = await this._playlistsService.getPlaylistSongById(
      id,
      credentialId
    );

    return {
      status: "success",
      data: {
        playlist,
      },
    };
  }

  async deletePlaylistSongHandler(request, h) {
    this._validator.validatePlaylistSongsPayload(request.payload);
    const { id: credentialId } = request.auth.credentials;
    const { id } = request.params;
    const { songId } = request.payload;

    await this._playlistsService.verifyPlaylistAccess(id, credentialId);
    await this._playlistsService.deletePlaylistSong(id, songId);

    const action = "delete";
    const time = new Date().toISOString();
    await this._activitiesService.addPlaylistSongActivities(id, {
      songId,
      userId: credentialId,
      action,
      time,
    });

    return {
      status: "success",
      message: "Success delete data",
    };
  }
}

module.exports = PlaylistsHandler;
