const Joi = require("joi");

exports.schema = (data) =>
  Joi.object()
    .options({ abortEarly: false })
    .keys({
      name: Joi.string().required().messages({ 'any.required': `missing required name field`}),
      phone: Joi.number().required(),
      email: Joi.string().email().required(),
    })
    .validate(data);

// module.exports = {
//   schema,
// };
