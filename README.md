# Koa MongoDB CRUD

## examples

```typescript
import {
  GetResource,
  ListResources,
  PostResource,
  PatchResource,
  DeleteResource,
  PutResource,
} from '@splytech-io/koa-mongodb-crud';
import * as Router from 'koa-router';
import * as J from 'joi';
import { ObjectID } from 'bson';

const collection = ...; //an instance of MongoDB collection

const router = new Router({
  prefix: '/users',
});

const cast = {
  _id: ObjectID,
  created: Date,
};

const validation = J.object({
  username: J.string(),
  password: J.string(),
});

router.get('/', ListResources.create(collection, {
  cast: cast,
}));
router.get('/:id', GetResource.create(collection, {
  cast: cast,
}));
router.post('/', PostResource.create(collection, {
  cast: cast,
  validation: validation,
}));
router.patch('/:id', PatchResource.create(collection, {
  cast: cast,
  validation: validation,
}));
router.delete('/:id', DeleteResource.create(collection));
```
