import joi from "joi";

const schemaCategorie = joi.object({
  name: joi.string().trim().required(),
});

function schemaCategorieValidate(req, res, next) {
  const { name } = req.body;
  const validation = schemaCategorie.validate({ name });
  if (validation.error) {
    return res.status(400).send(validation.error.details.map((e) => e.message));
  }
  res.locals.info = { name };
  next();
}

export default schemaCategorieValidate;
