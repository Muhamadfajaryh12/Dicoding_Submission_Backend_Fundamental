/**
 * @type {import('node-pg-migrate').ColumnDefinitions | undefined}
 */

/**
 * @param pgm
 * @param run
 * @returns {Promise<void> | void}
 */
exports.up = (pgm) => {
  pgm.createTable("songs", {
    id: {
      type: "VARCHAR",
      primaryKey: true,
    },
    title: {
      type: "VARCHAR",
      notNull: true,
    },
    year: {
      type: "INT",
      notNull: true,
    },
    genre: {
      type: "VARCHAR",
      notNull: true,
    },
    performer: {
      type: "VARCHAR",
      notNull: true,
    },
    duration: {
      type: "INT",
      notNull: false,
    },
    albumId: {
      type: "VARCHAR",
      notNull: false,
      references: '"albums"',
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
  pgm.dropTable("songs");
};
