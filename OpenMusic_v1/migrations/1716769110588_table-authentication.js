/**
 * @type {import('node-pg-migrate').ColumnDefinitions | undefined}
 */

/**
 * @param pgm
 * @param run
 * @returns {Promise<void> | void}
 */
exports.up = (pgm) => {
  pgm.createTable("authentication", {
    token: {
      type: "TEXT",
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
  pgm.dropTable("authentication");
};
