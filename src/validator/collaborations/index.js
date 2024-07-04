const InvariantError = require("../../exceptions/InvariantError");
const { collaborationsPayloadSchema } = require("./schema");

const collaborationsValidator = {
  validateCollaborationPayload: (payload) => {
    const validationResult = collaborationsPayloadSchema.validate(payload);
    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message);
    }
  },
};

module.exports = collaborationsValidator;
