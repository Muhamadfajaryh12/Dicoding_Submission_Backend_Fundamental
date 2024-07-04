const InvariantError = require("../../exceptions/InvariantError");
const { postAlbumCoversSchema } = require("./schema");

const UploadsValidator = {
  validatePostAlbumCover: (headers) => {
    const validationResult = postAlbumCoversSchema.validate(headers);

    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message);
    }
  },
};

module.exports = UploadsValidator;
