const { Pool } = require("pg");
const InvariantError = require("../../exceptions/InvariantError");

class AuthenticationServices {
  constructor() {
    this._pool = new Pool();
  }

  async addRefreshToken(token) {
    const query = {
      text: "INSERT INTO authentication VALUES ($1)",
      values: [token],
    };

    await this._pool.query(query);
  }

  async verifyRefreshToken(token) {
    const query = {
      text: "SELECT token FROM authentication WHERE token = $1",
      values: [token],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new InvariantError("Refresh token tidak valid");
    }
  }

  async deleteRefreshToken(token) {
    const query = {
      text: "DELETE FROM authentication WHERE token = $1",
      values: [token],
    };

    await this._pool.query(query);
  }
}

module.exports = AuthenticationServices;
