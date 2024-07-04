/**
 * @type {import('node-pg-migrate').ColumnDefinitions | undefined}
 */

/**
 * @param pgm
 * @param run
 * @returns {Promise<void> | void}
 */
exports.up = (pgm) => {
  pgm.createTable("playlists_songs", {
    id: {
      type: "VARCHAR",
      primaryKey: true,
    },
    playlist_id: {
      type: "VARCHAR",
      notNull: true,
      references: '"playlists"',
      onDelete: "cascade",
    },
    song_id: {
      type: "VARCHAR",
      notNull: true,
      references: '"songs"',
      onDelete: "cascade",
    },
  });
};

/**
 * @param pgm
 * @param run
 * @returns {Promise<void> | void}
 */
exports.down = (pgm) => {
  pgm.dropTable("playlists_songs");
};
