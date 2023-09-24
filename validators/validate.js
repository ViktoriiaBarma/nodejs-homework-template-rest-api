const Joi = require("joi");

exports.schema = (data) =>
  Joi.object()
    .options({ abortEarly: false })
    .keys({
      name: Joi.string().required().messages({ 'any.required': `missing required name field`}),
      phone: Joi.number().required().messages({ 'any.required': `missing required phone field`}),
      email: Joi.string().email().required().messages({ 'any.required': `missing required email field`}),
    })
    .validate(data);

