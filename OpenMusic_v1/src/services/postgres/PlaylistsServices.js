const { Pool } = require("pg");
const { nanoid } = require("nanoid");
const InvariantError = require("../../exceptions/InvariantError");
const NotFoundError = require("../../exceptions/NotFoundError");
const AuthorizationError = require("../../exceptions/AuthorizationError");

class PlaylistService {
  constructor(collaborationsService) {
    this._pool = new Pool();
    this._collaborationsService = collaborationsService;
  }

  async addPlaylist({ name, owner }) {
    const id = `playlist-${nanoid(16)}`;
    const query = {
      text: "INSERT INTO playlists VALUES ($1, $2, $3) RETURNING id",
      values: [id, name, owner],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new InvariantError("Playlist gagal ditambahkan");
    }

    return result.rows[0].id;
  }

  async getPlaylists(owner) {
    const query = {
      text: `SELECT playlists.id, playlists.name, users.username 
      FROM playlists
      LEFT JOIN users ON playlists.owner = users.id 
      LEFT JOIN collaborations ON playlists.id = collaborations.playlist_id 
      WHERE playlists.owner = $1 OR collaborations.user_id = $1
  `,
      values: [owner],
    };
    const result = await this._pool.query(query);
    return result.rows;
  }

  async deletePlaylistById(id) {
    const query = {
      text: "DELETE FROM playlists WHERE id = $1 RETURNING id",
      values: [id],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new NotFoundError("Playlist gagal dihapus, Id tidak ditemukan");
    }
  }

  async addPlaylistSong(playlistId, songId) {
    const id = `playlist-song-${nanoid(16)}`;
    const query = {
      text: "INSERT INTO playlists_songs VALUES ($1, $2, $3) RETURNING id",
      values: [id, playlistId, songId],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new InvariantError("Lagu gagal ditambahkan ke playlist");
    }
    return result.rows[0].id;
  }

  async getPlaylistSongById(playlistId) {
    const playlistQuery = {
      text: `SELECT playlists.id, playlists.name, users.username 
        FROM playlists
        LEFT JOIN users ON users.id = playlists.owner
        WHERE playlists.id = $1`,
      values: [playlistId],
    };

    const playlistResult = await this._pool.query(playlistQuery);

    if (!playlistResult.rowCount) {
      throw new NotFoundError("Playlist tidak ditemukan");
    }

    const playlist = playlistResult.rows[0];

    const songsQuery = {
      text: `SELECT songs.id, songs.title, songs.performer FROM playlists
        JOIN playlists_songs ON  playlists_songs.playlist_id = playlists.id
        JOIN songs ON songs.id = playlists_songs.song_id
        WHERE playlists.id = $1`,
      values: [playlistId],
    };

    const result = await this._pool.query(songsQuery);

    playlist.songs = result.rows;

    return playlist;
  }

  async deletePlaylistSong(playlistId, songId) {
    const query = {
      text: "DELETE FROM playlists_songs WHERE playlist_id = $1 AND song_id = $2 RETURNING id",
      values: [playlistId, songId],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new InvariantError("Lagu gagal dihapus dari playlist");
    }
  }

  async verifyPlaylistOwner(playlistId, userId) {
    const query = {
      text: "SELECT * FROM playlists WHERE id = $1",
      values: [playlistId],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new NotFoundError("Playlist tidak ditemukan");
    }

    if (result.rows[0].owner !== userId) {
      throw new AuthorizationError("Anda tidak memiliki akses ke playlist ini");
    }
  }

  async verifyPlaylistAccess(playlistId, userId) {
    try {
      await this.verifyPlaylistOwner(playlistId, userId);
    } catch (error) {
      if (error instanceof NotFoundError) {
        throw error;
      }
      try {
        await this._collaborationsService.verifyCollaborator(
          playlistId,
          userId
        );
      } catch {
        throw error;
      }
    }
  }
}

module.exports = PlaylistService;
