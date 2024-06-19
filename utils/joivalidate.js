const Joi = require("joi");

const schema = Joi.object({
  company: Joi.string().trim().min(3).max(30).required(),

  item: Joi.string()
    .valid(
      "Sieve",
      "laptop",
      "keyboard",
      "logic-gates",
      "multiplexers",
      "transistor",
      "lathe_machine",
      "heat_exchanger",
      "pressure_gauge",
      "pump",
      "oscilloscope",
      "resistor",
      "Theodolite",
      "Inclinometer",
      "transformer",
      "Piezometer"
    )
    .required(),

  quantity: Joi.number().min(1).required(),

  price: Joi.number().min(100).required(),

  details: Joi.string().trim().min(3).max(300).required(),
});

module.exports = schema;
