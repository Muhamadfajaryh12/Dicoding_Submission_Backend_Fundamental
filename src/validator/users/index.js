const InvariantError = require("../../exceptions/InvariantError");
const { usersPayloadSchema } = require("./schema");

const usersValidator = {
  validateUserPayload: (payload) => {
    const validationResult = usersPayloadSchema.validate(payload);
    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message);
    }
  },
};

module.exports = usersValidator;
