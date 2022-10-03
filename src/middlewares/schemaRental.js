import joi from "joi";

const schemaRental = joi.object({
  customerId: joi.number().required().min(1).integer(),
  gameId: joi.number().required().min(1).integer(),
  daysRented: joi.number().required().min(1).integer(),
});
function schemaRentalValidate(req, res, next) {
  const { customerId, gameId, daysRented } = req.body;
  const validation = schemaRental.validate(
    {
      customerId,
      gameId,
      daysRented,
    },
    { abortEarly: false }
  );
  if (validation.error) {
    return res.status(400).send(validation.error.details.map((e) => e.message));
  }
  res.locals.info = { customerId, gameId, daysRented };
  next();
}

export default schemaRentalValidate;
