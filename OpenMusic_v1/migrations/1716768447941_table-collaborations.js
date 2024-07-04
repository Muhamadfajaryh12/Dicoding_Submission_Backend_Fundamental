/**
 * @type {import('node-pg-migrate').ColumnDefinitions | undefined}
 */

/**
 * @param pgm
 * @param run
 * @returns {Promise<void> | void}
 */
exports.up = (pgm) => {
  pgm.createTable("collaborations", {
    id: {
      type: "VARCHAR(50)",
      primaryKey: true,
    },
    playlist_id: {
      type: "VARCHAR(50)",
      notNull: true,
      references: '"playlists"',
      onDelete: "cascade",
    },
    user_id: {
      type: "VARCHAR(50)",
      notNull: true,
      references: '"users"',
      onDelete: "cascade",
    },
  });
  pgm.createIndex("collaborations", ["playlist_id", "user_id"]);
};

/**
 * @param pgm
 * @param run
 * @returns {Promise<void> | void}
 */
exports.down = (pgm) => {
  pgm.dropTable("collaborations");
};
