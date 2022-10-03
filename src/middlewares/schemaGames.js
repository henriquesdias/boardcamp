import joi from "joi";

const schemaGame = joi.object({
  name: joi.string().required().trim(),
  image: joi.string().required().trim(),
  stockTotal: joi.number().min(1).integer().required(),
  categoryId: joi.number().integer().required(),
  pricePerDay: joi.number().min(1).required(),
});

function schemaGameValidate(req, res, next) {
  const { name, image, stockTotal, categoryId, pricePerDay } = req.body;
  const validation = schemaGame.validate(
    {
      name,
      image,
      stockTotal,
      categoryId,
      pricePerDay,
    },
    { abortEarly: false }
  );
  if (validation.error) {
    return res.status(400).send(validation.error.details.map((e) => e.message));
  }
  res.locals.info = { name, image, stockTotal, categoryId, pricePerDay };
  next();
}

export default schemaGameValidate;
