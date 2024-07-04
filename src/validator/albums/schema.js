const Joi = require('joi');

const albumsPayloadSchema = Joi.object({
  name: Joi.string().required(),
  year: Joi.number().required(),
});

module.exports = { albumsPayloadSchema };
