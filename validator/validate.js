const Joi = require("joi");

exports.isValidContatc = (data) =>
  Joi.object()
    .options({ abortEarly: false })
    .keys({
      name: Joi.string().required().messages({ 'any.required': `missing required name field`}),
      phone: Joi.number()
        .required()
        .messages({ "any.required": `missing required phone field` }),
      email: Joi.string()
        .email()
        .required()
        .messages({ "any.required": `missing required email field` }),
      favorite: Joi.boolean(),
    }).validate(data);


    exports.isValidFavorite = (data) =>
  Joi.object()
    .options({ abortEarly: false })
    .keys({
      favorite: Joi.boolean().required()
        .messages({ "any.required": `missing required favorite field` })
    }).validate(data);