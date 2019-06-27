import { IFeturedImage } from '../interface/featured-image.interface';
import { NewsCategoryModel } from './news-category.model';
import { PostStatusEnum } from '../enum/post-status.enum';
import { PostTypeEnum } from '../enum/post-type.enum';

export class PostModel {
    id: number = null;
    title: string = '';
    slug: string = '';
    content: string = '';
    postStatus: PostStatusEnum = PostStatusEnum.Draft;
    postType: PostTypeEnum = PostTypeEnum.Post;
    published: boolean = false;
    category: string = '';
    categoryList: NewsCategoryModel[] = [];
    tags: string[] = [];
    featuredImage: IFeturedImage = {
        original: '',
        large: '',
        medium: '',
        small: ''
    };
    author: string = '';
    createDate: Date | string = '';
    publishedDate: Date | string = '';
    canonicalUrl: string = '';
}
