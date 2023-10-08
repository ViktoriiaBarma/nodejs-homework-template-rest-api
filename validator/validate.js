const Joi = require("joi");

exports.isValidContatc = (data) =>
  Joi.object()
    .options({ abortEarly: false })
    .keys({
      name: Joi.string()
        .required()
        .messages({ "any.required": `missing required name field` }),
      phone: Joi.number()
        .required()
        .messages({ "any.required": `missing required phone field` }),
      email: Joi.string()
        .email()
        .required()
        .messages({ "any.required": `missing required email field` }),
      favorite: Joi.boolean(),
    })
    .validate(data);

exports.isValidFavorite = (data) =>
  Joi.object()
    .options({ abortEarly: false })
    .keys({
      favorite: Joi.boolean()
        .required()
        .messages({ "any.required": `missing required favorite field` }),
    })
    .validate(data);

exports.signupSchema = (data) =>
  Joi.object()
    .options({ abortEarly: false })
    .keys({
      name: Joi.string().required().messages({
        "string.base": `name should be a type of 'text'`,
        "any.required": `missing required name field`,
      }),
      email: Joi.string()
        .email()
        .required()
        .messages({ "any.required": `missing required email field` }),
      password: Joi.string().min(8).required().messages({
        "string.min": `password must be longer than 8 characters`,
        "any.required": `missing required password field`,
      }),
    })
    .validate(data);

exports.loginSchema = (data) =>
   Joi.object()
    .options({ abortEarly: false })
    .keys({
      email: Joi.string()
        .email()
        .required()
        .messages({ "any.required": `missing required email field` }),
      password: Joi.string().min(8).required().messages({
        "string.min": `password must be longer than 8 characters`,
        "any.required": `missing required password field`,
      }),
    }).validate(data);

const subscriptions = ["starter", "pro", "business"];

exports.subscriptionSchema = (data) =>
  Joi.object({
    subscription: Joi.string()
      .valid(...subscriptions)
      .required()
      .messages({
        "any.only": `the subscription field has an invalid value`,
        "any.required": `missing required subscription field`,
      }),
  }).validate(data);
