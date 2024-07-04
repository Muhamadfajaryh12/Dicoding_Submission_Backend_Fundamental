const { nanoid } = require("nanoid");
const { Pool } = require("pg");
const InvariantError = require("../../exceptions/InvariantError");
const NotFoundError = require("../../exceptions/NotFoundError");
const { mapDBToModelAlbums } = require("../../utils");

class AlbumsService {
  constructor(cacheService) {
    this._pool = new Pool();
    this._cacheService = cacheService;
  }

  async addAlbum({ name, year }) {
    const id = `album-${nanoid(16)}`;

    const query = {
      text: "INSERT INTO albums VALUES($1, $2, $3) RETURNING id",
      values: [id, name, year],
    };

    const result = await this._pool.query(query);

    if (!result.rows[0].id) {
      throw new InvariantError("Invalid input data");
    }

    return result.rows[0].id;
  }

  async getAlbumById(id) {
    const query = {
      text: "SELECT * FROM albums WHERE id = $1",
      values: [id],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError("Data not found");
    }
    return result.rows.map(mapDBToModelAlbums)[0];
  }

  async editAlbumById(id, { name, year }) {
    const query = {
      text: "UPDATE albums SET name = $1, year = $2 WHERE id = $3 RETURNING id",
      values: [name, year, id],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError("Invalid update data");
    }
  }

  async deleteAlbumById(id) {
    const query = {
      text: "DELETE FROM albums WHERE id = $1 RETURNING id",
      values: [id],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError("Invalid delete data");
    }
  }

  async checkExistedAlbums(id) {
    const query = {
      text: "SELECT id FROM albums WHERE id = $1",
      values: [id],
    };

    const { rowCount } = await this._pool.query(query);

    if (!rowCount) {
      throw new NotFoundError("Invalid data not found");
    }
  }

  async addCoverByAlbumId(id, coverAlbum) {
    const query = {
      text: "UPDATE albums SET cover = $1 WHERE id = $2 RETURNING id",
      values: [coverAlbum, id],
    };
    const { rowCount } = await this._pool.query(query);

    if (!rowCount) {
      throw new NotFoundError("Gagal memperbarui album. Id tidak ditemukan.");
    }
  }

  async addAlbumLike(userId, albumId) {
    await this.verifyUserAlreadyLikedAlbum(userId, albumId);

    const id = `user_album_like-${nanoid(16)}`;
    const query = {
      text: "INSERT INTO user_album_likes VALUES($1, $2, $3) RETURNING id",
      values: [id, userId, albumId],
    };

    const result = await this._pool.query(query);

    await this._cacheService.delete(`album-likes:${albumId}`);

    if (!result.rows.length) {
      throw new InvariantError("Invalid insert data");
    }
  }

  async getAlbumLike(albumId) {
    try {
      const result = await this._cacheService.get(`album-likes:${albumId}`);
      return { count: JSON.parse(result), source: "cache" };
    } catch (error) {
      const query = {
        text: "SELECT COUNT(user_id) FROM user_album_likes WHERE album_id = $1",
        values: [albumId],
      };

      const result = await this._pool.query(query);

      await this._cacheService.set(
        `album-likes:${albumId}`,
        result.rows[0].count
      );

      return { count: result.rows[0].count, source: "database" };
    }
  }

  async deleteAlbumLike(userId, albumId) {
    const query = {
      text: "DELETE FROM user_album_likes WHERE user_id = $1 AND album_id = $2 RETURNING id",
      values: [userId, albumId],
    };

    const result = await this._pool.query(query);

    await this._cacheService.delete(`album-likes:${albumId}`);

    if (!result.rows.length) {
      throw new InvariantError("Invalid delete data");
    }
  }

  async verifyUserAlreadyLikedAlbum(userId, albumId) {
    const query = {
      text: "SELECT * FROM user_album_likes WHERE user_id = $1 AND album_id = $2",
      values: [userId, albumId],
    };

    const result = await this._pool.query(query);

    if (result.rows.length > 0 && result.rows[0].user_id === userId) {
      throw new InvariantError(
        "Gagal menambahkan like album. User sudah menambahkan like album"
      );
    }
  }
}

module.exports = AlbumsService;
