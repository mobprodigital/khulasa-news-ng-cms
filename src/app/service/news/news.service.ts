import { Injectable } from '@angular/core';
import { NewsModel } from 'src/app/model/news.model';
import { NewsCategoryModel } from 'src/app/model/news-category.model';
import { HttpService } from '../http/http.service';
import { HttpParams } from '@angular/common/http';
import { PostTypeEnum } from 'src/app/enum/post-type.enum';


@Injectable({
  providedIn: 'root'
})
export class NewsService {


  private menuCategories: NewsCategoryModel[] = [];

  constructor(private httpService: HttpService) {

  }

  /**
   * get all news categories
   */
  public getNewsCategories(): Promise<NewsCategoryModel[]>;
  /**
   * get single catgeory by id
   * @param categoryId Category id
   */
  public getNewsCategories(categoryId: number): Promise<NewsCategoryModel>;
  public getNewsCategories(args?: undefined | number): Promise<NewsCategoryModel[] | NewsCategoryModel> {
    return new Promise((resolve, reject) => {
      let argsType = typeof args;
      if (argsType === 'number') {
        this.httpService.get('', new HttpParams().set('action', 'get_category').set('catId', args.toString()))
          .then((data: any) => {
            let cats = this.parseCategories([data]);
            resolve(cats[0]);
          })
      }
      else if (argsType === 'undefined') {
        this.httpService.get('', new HttpParams().set('action', 'get_categories')).then((cats: any[]) => {
          let categories = this.parseCategories(cats);
          resolve(categories);
        }).catch(err => {
          resolve(err);
        })
      }
      else {
        reject('Argument type mismatch');
      }
    });
  }

  /**
   * get menu catgories
   */
  public getMenuCategories(): Promise<NewsCategoryModel[]> {
    return new Promise((resolve, reject) => {
      if (this.menuCategories && this.menuCategories.length > 0) {
        let cats = this.getLocalData('menu_cat');
        if (cats) {
          let localCats = this.parseCategories(cats);
          resolve(localCats);
        }
      }
      else {
        this.httpService.get('', new HttpParams().set('action', 'get_menu'))
          .then((data: any[]) => {
            let menu = this.parseCategories(data);
            this.setLocalData('menu_cat', menu);
            this.menuCategories = menu;
            resolve(menu);
          }).catch(err => {
            reject(err);
          })
      }
    })
  }

  /**
   * get all news 
   */
  public getNews(): Promise<NewsModel[]>;
  /**
   * Get all news of a specified news category 
   * @param categoryId id of the news category
   */
  public getNews(categoryId: number): Promise<NewsModel[]>;
  /**
   * Get all news of a specified news category 
   * @param categoryId id of the news category
   * @param count (default = 10) number of news want to get
   */
  public getNews(categoryId: number, count: number): Promise<NewsModel[]>;
  /**
   * Get all news of a specified news category 
   * @param categoryId id of the news category
   * @param count (default = 10) number of news want to get
   * @param from (default = 1) offset number from where want to get the news
   */
  public getNews(categoryId: number, count: number, from: number): Promise<NewsModel[]>
  public getNews(categoryId?: number, count?: number, from?: number): Promise<NewsModel[]> {
    return new Promise((resolve, reject) => {

      count = typeof count === "undefined" ? 10 : count;
      from = typeof from === "undefined" ? 1 : from;

      let params = new HttpParams()
        .set("action", "get_post_archive")
        .set("count", count.toString())
        .set("from", from.toString());

      if (categoryId) {
        params = params.set("categoryId", categoryId.toString());
      }


      this.httpService.get('', params).then((news: any[]) => {
        let newslist = this.parseNews(news);
        resolve(newslist);
      }).catch(err => {
        reject(err);
      })
    })
  }


  /**
   * get news by id
   * @param newsId news Id
   */
  public getNewsByNewsId(newsId: number): Promise<NewsModel>;
  public getNewsByNewsId(newsSlug: string, postType?: PostTypeEnum): Promise<NewsModel>;
  public getNewsByNewsId(args: string | number, postType: PostTypeEnum = PostTypeEnum.Post): Promise<NewsModel> {
    return new Promise((resolve, reject) => {
      let argsType = typeof args;
      let slugOrId = ''
      let params = new HttpParams().set('action', 'get_single_post_by_id');
      if (argsType === 'number') {
        params = params.set('postId', args.toString());
      }
      else if (argsType === 'string') {
        params = params.set('postSlug', args.toString()).set('postType', postType);
      }
      else {
        throw console.error("argumnet not match");
      }
      this.httpService.get('', params)
        .then((news: any) => {
          let n = this.parseNews([news]);
          resolve(n[0]);
        }).catch(err => {
          reject(err);
        })
    });
  }


  public getRelatedPostByNewsId(postId: string, thumbnailSize: string = 'xsthumb'): Promise<NewsModel[]> {
    return new Promise((resolve, reject) => {
      let params = new HttpParams()
        .set('action', 'get_related_posts')
        .set("post_id", postId)
        .set("thumbnailSize", thumbnailSize);
      this.httpService.get('', params)
        .then((data: any[]) => {
          if (data) {
            let relatedPostList = this.parseNews(data);
            resolve(relatedPostList);
          }
          else {
            reject('no data found');
          }
        }).catch(err => {
          reject(err);
        })
    })
  }


  public getSearchResults(searchTerm: string, count?: number, from?: number): Promise<NewsModel[]> {
    return new Promise((resolve, reject) => {
      count = typeof count === "undefined" ? 10 : count;
      from = typeof from === "undefined" ? 1 : from;
      let params = new HttpParams()
        .set('action', 'search_posts')
        .set('search_term', searchTerm)
        .set('count', count.toString())
        .set('from', from.toString())
        .set('content_length', 'short');

      this.httpService.get('', params)
        .then((news: any[]) => {
          let newslist = this.parseNews(news);
          resolve(newslist);
        })
        .catch(err => {
          reject(err);
        })
    })
  }


  private async setLocalData(key: string, data: any) {
    localStorage.setItem('ks_' + key, JSON.stringify(data))
  }
  private getLocalData(key: string): any {
    return localStorage.getItem('ks_' + key);
  }



  private parseCategories(cats: any[]) {
    let catArr: NewsCategoryModel[] = [];
    if (cats && cats.length > 0) {
      catArr = cats.map(c => {
        let _cat: NewsCategoryModel = new NewsCategoryModel(parseInt(c.categoryId), c.name);
        _cat.slug = c.slug;
        return _cat;
      })
    }
    return catArr;
  }

  private parseNews(news: any[]) {
    let newslist: NewsModel[] = [];
    if (news && news.length > 0) {
      newslist = news.map(n => {
        let _newsls: NewsModel = new NewsModel();
        _newsls.id = n.id;
        _newsls.title = n.title;
        _newsls.author = n.author;
        _newsls.content = n.content;
        _newsls.publishedDate = n.date;
        _newsls.createDate = n.date;
        _newsls.category = n.category;
        _newsls.slug = n.slug;
        _newsls.categoryList = this.parseCategories(n.categoryList);
        // _newsls.categories=n.category;
        _newsls.featuredImage.small = n.thumbnail || '/assets/images/news/default.jpg';
        _newsls.featuredImage.original = n.thumbnail || '/assets/images/news/default.jpg';
        _newsls.featuredImage.medium = n.thumbnail || '/assets/images/news/default.jpg';
        _newsls.featuredImage.large = n.thumbnail || '/assets/images/news/default.jpg';
        return _newsls;
      })
    }
    return newslist;
  }

}
