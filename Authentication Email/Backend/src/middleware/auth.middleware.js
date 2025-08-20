const Joi = require("joi");

const Schema = Joi.string().email().required();

async function validateMail(req, res, next) {
  const { error } = Schema.validate(req.body.email);

  if (error) {
    return res.status(400).json({
      message: "Invalid Email",
    });
  }

  next();
}

module.exports = { validateMail };
