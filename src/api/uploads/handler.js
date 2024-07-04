class UploadsHandler {
  constructor(uploadsService, albumService, uploadsValidator) {
    this._service = uploadsService;
    this._validator = uploadsValidator;
    this._albumsService = albumService;
    this.postCoverAlbumHandler = this.postCoverAlbumHandler.bind(this);
  }

  async postCoverAlbumHandler(request, h) {
    const { cover } = request.payload;
    const { albumId } = request.params;
    this._validator.validatePostAlbumCover(cover.hapi.headers);

    const filename = await this._service.writeFile(cover, cover.hapi, albumId);
    const coverUrl = `http://${process.env.HOST}:${process.env.PORT}/uploads/${filename}`;
    await this._albumsService.addCoverByAlbumId(albumId, coverUrl);
    const response = h.response({
      status: "success",
      message: "Sampul berhasil diunggah",
    });
    response.code(201);
    return response;
  }
}

module.exports = UploadsHandler;
