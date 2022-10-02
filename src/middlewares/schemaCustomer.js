import joi from "joi";

const schemaCustomer = joi.object({
  name: joi.string().required().trim(),
  phone: joi.string().min(10).max(11).required().trim(),
  cpf: joi.string().required().trim().length(11),
  birthday: joi.date().required(),
});

function schemaCustomerValidate(req, res, next) {
  const { name, phone, cpf, birthday } = req.body;
  const validation = schemaCustomer.validate(
    { name, phone, cpf, birthday },
    { abortEarly: false }
  );
  if (validation.error) {
    res.status(400).send(validation.error.details.map((e) => e.message));
  }
  res.locals.info = { name, phone, cpf, birthday };
  next();
}

export default schemaCustomerValidate;
