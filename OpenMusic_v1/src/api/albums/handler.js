class AlbumsHandler {
  constructor(service, validator, songService) {
    this._service = service;
    this._validator = validator;
    this._songsService = songService;

    this.postAlbumHandler = this.postAlbumHandler.bind(this);
    this.getAlbumsHandler = this.getAlbumsHandler.bind(this);
    this.getAlbumByIdHandler = this.getAlbumByIdHandler.bind(this);
    this.putAlbumByIdHandler = this.putAlbumByIdHandler.bind(this);
    this.deleteAlbumByIdHandler = this.deleteAlbumByIdHandler.bind(this);
    this.likeAlbumByIdHandler = this.likeAlbumByIdHandler.bind(this);
    this.getLikeAlbumHandler = this.getLikeAlbumHandler.bind(this);
    this.unlikeAlbumByIdHandler = this.unlikeAlbumByIdHandler.bind(this);
  }

  async postAlbumHandler(request, h) {
    this._validator.validateAlbumPayload(request.payload);
    const { name = "untitled", year } = request.payload;

    const albumId = await this._service.addAlbum({
      name,
      year,
    });

    const response = h.response({
      status: "success",
      message: "Success insert data",
      data: {
        albumId,
      },
    });
    response.code(201);
    return response;
  }

  async getAlbumsHandler() {
    const albums = await this._service.getAlbums();
    return {
      status: "success",
      data: {
        albums,
      },
    };
  }

  async getAlbumByIdHandler(request) {
    const { id } = request.params;

    const album = await this._service.getAlbumById(id);
    album.songs = await this._songsService.getSongByAlbumId(id);

    return {
      status: "success",
      data: {
        album,
      },
    };
  }

  async putAlbumByIdHandler(request, h) {
    this._validator.validateAlbumPayload(request.payload);
    const { id } = request.params;

    await this._service.editAlbumById(id, request.payload);

    return {
      status: "success",
      message: "Success update data",
    };
  }

  async deleteAlbumByIdHandler(request, h) {
    const { id } = request.params;
    await this._service.deleteAlbumById(id);

    return {
      status: "success",
      message: "Success delete data",
    };
  }

  async likeAlbumByIdHandler(request, h) {
    const { id: albumId } = request.params;
    const { id: userId } = request.auth.credentials;

    await this._service.checkExistedAlbums(albumId);

    await this._service.addAlbumLike(userId, albumId);

    return h
      .response({
        status: "success",
        message: "Success insert data",
      })
      .code(201);
  }

  async getLikeAlbumHandler(request, h) {
    const { id: albumId } = request.params;
    await this._service.checkExistedAlbums(albumId);
    const likes = await this._service.getAlbumLike(albumId);
    const response = h.response({
      status: "success",
      data: {
        likes: parseInt(likes.count, 10),
      },
    });
    if (likes.source === "cache") {
      response.header("X-Data-Source", "cache");
    }
    return response;
  }

  async unlikeAlbumByIdHandler(request, h) {
    const { id: albumId } = request.params;
    const { id: credentialId } = request.auth.credentials;

    await this._service.checkExistedAlbums(albumId);

    await this._service.deleteAlbumLike(credentialId, albumId);

    return {
      status: "success",
      message: "Success delete data",
    };
  }
}

module.exports = AlbumsHandler;
