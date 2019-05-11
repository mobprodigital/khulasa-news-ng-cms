import { IFeturedImage } from '../interface/featured-image.interface';
import { NewsCategoryModel } from './news-category.model';

export class NewsModel {
    id: number = null;
    title: string = "";
    slug: string = "";
    content: string = "";
    published: boolean = false;
    category : string = '';
    categoryList: NewsCategoryModel[] = [];
    tags: string[] = [];
    featuredImage: IFeturedImage = {
        original: '',
        large: '',
        medium: '',
        small: ''
    };
    author: string = "";
    createDate: Date | string = '';
    publishedDate: Date | string = '';
    canonicalUrl: string = ''
}