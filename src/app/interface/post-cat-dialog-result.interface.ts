import { PostCategoryModel } from '../model/post-category.model';

export interface IPostCatDialogResult {
    targetCategory: PostCategoryModel;
    parentCategoryId?: number;
}
