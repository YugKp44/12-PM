const Joi = require('joi');

const dateRangeSchema = Joi.object({
  startDate: Joi.string().required(),
  endDate: Joi.string().required(),
  metrics: Joi.string(),
  dimensions: Joi.string()
});

const validateDateRange = (req, res, next) => {
  const { error } = dateRangeSchema.validate(req.query);
  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }
  next();
};

module.exports = {
  validateDateRange
};