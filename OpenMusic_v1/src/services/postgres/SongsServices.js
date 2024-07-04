const { Pool } = require('pg');
const { nanoid } = require('nanoid');
const InvariantError = require('../../exceptions/InvariantError');
const { mapDBToModelSongs } = require('../../utils');
const NotFoundError = require('../../exceptions/NotFoundError');

class SongsService {
  constructor() {
    this._pool = new Pool();
  }

  async addSong({
    title, year, genre, performer, duration, albumId
  }) {
    const id = `song-${nanoid(16)}`;

    const query = {
      text: 'INSERT INTO songs VALUES($1, $2, $3, $4, $5, $6, $7) RETURNING id',
      values: [id, title, year, genre, performer, duration, albumId],
    };
    const result = await this._pool.query(query);

    if (!result.rows[0].id) {
      throw new InvariantError('Invalid insert data');
    }

    return result.rows[0].id;
  }

  async getSongs(params) {
    const query = {
      text: 'SELECT id, title, performer FROM songs',
    };
    const result = await this._pool.query(query);
    let filteredSongs = result.rows;

    if ('title' in params) {
      const titleFilter = params.title.toLowerCase();
      filteredSongs = filteredSongs.filter((song) => song.title.toLowerCase().includes(titleFilter));
    }
    if ('performer' in params) {
      const performerFilter = params.performer.toLowerCase();
      filteredSongs = filteredSongs.filter((song) => song.performer.toLowerCase().includes(performerFilter));
    }
    return filteredSongs;
  }

  async getSongById(id) {
    const query = {
      text: 'SELECT * FROM songs WHERE id = $1',
      values: [id],
    };
    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError('Resource not found');
    }

    return result.rows.map(mapDBToModelSongs)[0];
  }

  async getSongByAlbumId(albumId) {
    const query = {
      text: 'SELECT id, title, performer FROM songs WHERE "albumId" = $1',
      values: [albumId],
    };

    const result = await this._pool.query(query);

    return result.rows.map(mapDBToModelSongs);
  }

  async editSongById(id, {
    title, year, genre, performer, duration
  }) {
    const query = {
      text: 'UPDATE songs SET title = $1, year = $2, genre = $3, performer = $4, duration = $5 WHERE id = $6 RETURNING id',
      values: [title, year, genre, performer, duration, id],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError('Invalid update data');
    }
  }

  async deleteSongById(id) {
    const query = {
      text: 'DELETE FROM songs WHERE id = $1 RETURNING id',
      values: [id],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError('Invalid delete data');
    }
  }
}

module.exports = SongsService;
