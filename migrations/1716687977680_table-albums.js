/**
 * @type {import('node-pg-migrate').ColumnDefinitions | undefined}
 */

/**
 * @param pgm
 * @param run
 * @returns {Promise<void> | void}
 */
exports.up = (pgm) => {
  pgm.createTable("albums", {
    id: {
      type: "VARCHAR",
      primaryKey: true,
    },
    name: {
      type: "TEXT",
      notNull: true,
    },
    year: {
      type: "INT",
      notNull: true,
    },
  });
};

/**
 * @param pgm
 * @param run
 * @returns {Promise<void> | void}
 */
exports.down = (pgm) => {
  pgm.dropTable("albums");
};
