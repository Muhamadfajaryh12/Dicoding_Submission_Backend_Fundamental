const InvariantError = require('../../exceptions/InvariantError');
const { albumsPayloadSchema } = require('./schema');

const albumsValidator = {
  validateAlbumPayload: (payload) => {
    const validationResult = albumsPayloadSchema.validate(payload);
    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message);
    }
  },
};

module.exports = albumsValidator;
