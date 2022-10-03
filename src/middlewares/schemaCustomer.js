import joi from "joi";

const schemaCustomer = joi.object({
  name: joi.string().required().trim(),
  phone: joi.string().min(10).max(11).required().trim().pattern(/[0-9]/),
  cpf: joi.string().required().trim().length(11).pattern(/[0-9]/),
  birthday: joi.string().isoDate().required(),
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
