import { NextApiHandler, NextApiRequest, NextApiResponse } from 'next';
import { ObjectShape, OptionalObjectSchema } from 'yup/lib/object';
import * as Yup from 'yup';
import getValidationErrors from '@util/getValidationErrors';

export function validate(
  handler: NextApiHandler,
  schema: OptionalObjectSchema<ObjectShape>,
) {
  return async (req: NextApiRequest, res: NextApiResponse) => {
    if (['POST', 'PUT'].includes(req.method)) {
      try {
        req.body = await schema.validate(req.body, {
          stripUnknown: true,
          abortEarly: false,
        });
      } catch (err) {
        if (err instanceof Yup.ValidationError) {
          return res.status(422).json({ errors: getValidationErrors(err) });
        }

        return res.status(422).json(err);
      }
    }
    await handler(req, res);
  };
}
