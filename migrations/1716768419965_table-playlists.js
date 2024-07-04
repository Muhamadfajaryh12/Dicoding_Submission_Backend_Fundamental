/**
 * @type {import('node-pg-migrate').ColumnDefinitions | undefined}
 */

/**
 * @param pgm
 * @param run
 * @returns {Promise<void> | void}
 */
exports.up = (pgm) => {
  pgm.createTable("playlists", {
    id: {
      type: "VARCHAR",
      primaryKey: true,
    },
    name: {
      type: "VARCHAR",
      notNull: true,
    },
    owner: {
      type: "TEXT",
      notNull: false,
      references: '"users"',
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
  pgm.dropTable("playlists");
};
