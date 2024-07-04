const InvariantError = require('../../exceptions/InvariantError');
const { songsPayloadSchema } = require('./schema');

const songsValidator = {
  validateSongPayload: (payload) => {
    const validationResult = songsPayloadSchema.validate(payload);
    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message);
    }
  },
};

module.exports = songsValidator;
