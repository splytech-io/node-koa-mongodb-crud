import * as Joi from 'joi';
import { AlternativesSchema, Root } from 'joi';

export interface MyJoiSchema extends Root {
  objectId: () => AlternativesSchema;
}

export const J: MyJoiSchema = Joi.extend([
  {
    name: 'objectId',
    base: Joi.alternatives().try(...[
      Joi.string().regex(/^[0-9a-fA-F]{24}$/),
      Joi.object().keys({
        '_bsontype': Joi.string().valid(['ObjectId', 'ObjectID']).required(),
        'id': Joi.object().required(),
      }),
    ]),
  },
]);
