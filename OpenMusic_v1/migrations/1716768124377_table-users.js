/**
 * @type {import('node-pg-migrate').ColumnDefinitions | undefined}
 */

/**
 * @param pgm
 * @param run
 * @returns {Promise<void> | void}
 */
exports.up = (pgm) => {
  pgm.createTable("users", {
    id: {
      type: "VARCHAR",
      primaryKey: true,
    },
    username: {
      type: "VARCHAR",
      unique: true,
      notNull: true,
    },
    password: {
      type: "TEXT",
      notNull: true,
    },
    fullname: {
      type: "TEXT",
      notNull: true,
    },
  });
};

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run
 * @returns {Promise<void> | void}
 */
exports.down = (pgm) => {
  pgm.dropTable("users");
};
