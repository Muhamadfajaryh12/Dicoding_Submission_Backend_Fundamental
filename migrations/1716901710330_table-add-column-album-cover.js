/**
 * @type {import('node-pg-migrate').ColumnDefinitions | undefined}
 */

/**
 * @param pgm
 * @param run
 * @returns {Promise<void> | void}
 */
exports.up = (pgm) => {
  pgm.addColumn("albums", {
    cover: {
      type: "TEXT",
    },
  });
};

/**
 * @param pgm
 * @param run
 * @returns {Promise<void> | void}
 */
exports.down = (pgm) => {
  pgm.dropColumn("albums", "cover");
};
