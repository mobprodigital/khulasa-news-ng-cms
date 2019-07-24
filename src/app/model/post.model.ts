import { IFeturedImage } from '../interface/featured-image.interface';
import { PostCategoryModel } from './post-category.model';
import { PostStatusEnum } from '../enum/post-status.enum';
import { PostTypeEnum } from '../enum/post-type.enum';

export class PostModel {
    postId: number = null;
    title: string = '';
    slug: string = '';
    content: string = '';
    authorId: number = null;
    status: PostStatusEnum = PostStatusEnum.Draft;
    postType: PostTypeEnum = PostTypeEnum.Post;
    category: string = '';
    categoryList: PostCategoryModel[] = [];
    tags: string[] = [];
    featuredImage: string = null
    // featuredImage: IFeturedImage = {
    //     original: '',
    //     large: '',
    //     medium: '',
    //     small: ''
    // };
    createDate: Date | string = '';
    publishedDate: Date | string = null;
    scheduledDate: Date | string = null;
    canonicalUrl: string = '';
    createdBy: number;
}


