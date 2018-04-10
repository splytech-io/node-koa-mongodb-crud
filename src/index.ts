import { DeleteResource } from './resource/delete-resource';
import { GetResource } from './resource/get-resource';
import { ListResources } from './resource/list-resources';
import { PatchResource } from './resource/patch-resource';
import { PostResource } from './resource/post-resource';
import { PutResource } from './resource/put-resource';

export namespace Resource {
  export const list = ListResources.create;
  export const get = GetResource.create;
  export const post = PostResource.create;
  export const put = PutResource.create;
  export const remove = DeleteResource.create;
  export const patch = PatchResource.create;
}
