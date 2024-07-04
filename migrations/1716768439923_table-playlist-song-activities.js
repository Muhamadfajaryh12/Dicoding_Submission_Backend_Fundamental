/**
 * @type {import('node-pg-migrate').ColumnDefinitions | undefined}
 */

/**
 * @param pgm
 * @param run
 * @returns {Promise<void> | void}
 */
exports.up = (pgm) => {
  pgm.createTable("playlist_song_activities", {
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
    user_id: {
      type: "VARCHAR",
      notNull: true,
      references: '"users"',
      onDelete: "cascade",
    },
    action: {
      type: "VARCHAR",
      notNull: true,
    },
    time: {
      type: "TEXT",
      notNull: true,
    },
  });
  pgm.createIndex("playlist_song_activities", [
    "playlist_id",
    "song_id",
    "user_id",
  ]);
};

/**
 * @param pgm
 * @param run
 * @returns {Promise<void> | void}
 */
exports.down = (pgm) => {
  pgm.dropTable("playlist_song_activities");
};
