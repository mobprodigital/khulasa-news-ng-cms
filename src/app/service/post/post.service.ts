import { Injectable } from '@angular/core';
import { PostModel } from 'src/app/model/post.model';
import { PostCategoryModel } from 'src/app/model/post-category.model';
import { HttpService } from '../http/http.service';
import { HttpParams } from '@angular/common/http';
import { PostTypeEnum } from 'src/app/enum/post-type.enum';
import { PostStatusEnum } from 'src/app/enum/post-status.enum';
import { AuthorModel } from 'src/app/model/author.model';
import { PostCountModel } from 'src/app/model/count.model';
import { MenuModel, MenuItemModel } from 'src/app/model/menu.model';


@Injectable({
  providedIn: 'root'
})
export class PostService {
  private menuCategories: PostCategoryModel[] = [];
  constructor(private httpService: HttpService) {
  
  }

  /**
   * Add new root category
   * @param rootCategoryName new root category name
   */
  public addNewPostCategory(rootCategoryName: string, slug: string): Promise<PostCategoryModel>;
  /**
   * Add new sub category
   * @param subCategoryName child category name
   * @param rootCatgoryId root category id
   */
  public addNewPostCategory(subCategoryName: string, slug: string, rootCatgoryId: number): Promise<PostCategoryModel>;
  public addNewPostCategory(categoryName: string, slug: string, rootCatgoryId?: number): Promise<PostCategoryModel> {
    return new Promise((resolve, reject) => {

      let path = 'category';
      if (typeof rootCatgoryId === 'number') {
        path += '/' + rootCatgoryId;
      }
      this.httpService.post(path, {
        categoryName, slug
      }).then(resp => {
        const newCategory = this.parseCategories([resp.data]);
        resolve(newCategory[0]);
        console.log(resp);
      }).catch(err => {
        reject(err);
      });
    });
  }


  /**
   * Edit root category
   * @param rootCategory root category modal
   */
  public editPostcategory(rootCategory: PostCategoryModel, slug: string): Promise<PostCategoryModel>;
  /**
   * Edit sub category
   * @param subCategory sub category modal
   * @param rootCatgoryId root category id
   */
  public editPostcategory(subCategory: PostCategoryModel, slug: string, rootCatgoryId: number): Promise<PostCategoryModel>;
  public editPostcategory(postCategory: PostCategoryModel, slug: string, rootCatgoryId?: number): Promise<PostCategoryModel> {
    return new Promise((resolve, reject) => {

      let path = 'category';
      if (typeof rootCatgoryId === 'number') {
        path += '/' + rootCatgoryId + '/' + postCategory.categoryId;
      } else {
        path += '/' + postCategory.categoryId;
      }
      this.httpService.put(path, {
        categoryName: postCategory.categoryName,
        slug
      }).then(resp => {
        const newCategory = this.parseCategories([resp.data]);
        resolve(newCategory[0]);
        console.log(resp);
      }).catch(err => {
        reject(err);
      });
    });
  }

  public deletePostCategory(rootCategoryId: number): Promise<string>;
  public deletePostCategory(rootCategoryId: number, subCategoryId: number): Promise<string>;
  public deletePostCategory(rootCategoryId: number, subCategoryId?: number): Promise<string> {
    return new Promise((resolve, reject) => {
      let url: string = 'category/' + rootCategoryId;
      if (typeof subCategoryId === 'number') {
        url += '/' + subCategoryId;
      }

      this.httpService.delete(url).then(resp => {
        resolve(resp.message);
      }).catch(err => reject(err));

    });
  }

  /**
   * get all root categories with child categories
   */
  public getPostCategories(): Promise<PostCategoryModel[]>;
  /**
   * get root category and its child catgeories
   * @param rootCategoryId Root Category id
   */
  public getPostCategories(rootCategoryId: number): Promise<PostCategoryModel>;
  /**
   * get child category of root category
   * @param rootCategoryId Root Category id
   * @param childCategoryId child Category id
   */
  public getPostCategories(rootCategoryId: number, childCategoryId: number): Promise<PostCategoryModel>;
  public getPostCategories(
    rootCategoryId?: number,
    childCategoryId?: number): Promise<PostCategoryModel[] | PostCategoryModel> {
    return new Promise((resolve, reject) => {
      let catUrl = 'category';

      if (typeof rootCategoryId === 'number') {
        catUrl += rootCategoryId;
      }
      if (typeof childCategoryId === 'number') {
        catUrl += childCategoryId;
      }

      this.httpService.get(catUrl).then(resp => {
        const categories: PostCategoryModel[] = this.parseCategories(resp.data);
        if (rootCategoryId || childCategoryId) {
          resolve(categories[0]);
        } else {
          resolve(categories);
        }
      }).catch(err => reject(err));

    });
  }

  /**
   * add new post
   */
  public addNewPost(postData: PostModel): Promise<PostModel> {
    return new Promise((resolve, reject) => {
      let path = 'post'
      let data = JSON.stringify(postData)
      this.httpService.post(path, data).then(res => {
        const post = this.parsePost([res.data]);
        resolve(post[0]);
        console.log(res);
      }).catch(err => reject(err))
    })
  }

  /**
   * edit Post by post id 
   * @param postId id of post 
   * @param postData 
   */
  public editPostByPostId(postId: number, postData: PostModel): Promise<PostModel> {
    return new Promise((resolve, reject) => {
      let path = 'post';
      let data = JSON.stringify(postData)
      this.httpService.put(path + "/" + postId, data)
        .then(res => {
          let data = this.parsePost([res.data]);
          resolve(data[0]);
        }).catch(err => {
          reject(err);
        })
    })
  }

  /**
   * delete Post by postId
   */
  public deletePostByPostId(postId: number[]): Promise<string> {
    return new Promise((resolve, reject) => {
      let path = 'delete/post';
      let dataToSend = {
        "postId": postId
      }
      this.httpService.post(path, dataToSend)
        .then(resp => {
          resolve(resp.message);
        })
        .catch(err => {
          reject(err)
        })
    })
  }


  /**
   * change post status
   * 
   */
  public changePostStatus(postId: number[], status: string): Promise<string> {
    return new Promise((resolve, reject) => {
      let path = 'change-status';

      let data = {
        "postId": postId,
        "targetStatus": status
      }
      let dataToSend = JSON.stringify(data)
      this.httpService.put(path, dataToSend)
        .then(resp => {
          resolve(resp.message)
        })
        .catch(err => {
          reject(err)
        })
    })
  }

  /**
   * get post by post id 
   * @param postId post id is number 
   */
  public getPostById(postId: number): Promise<PostModel> {
    return new Promise((resolve, reject) => {
      let path = 'post';
      this.httpService.get(path + "/" + postId)
        .then(resp => {
          let data = this.parsePost([resp.data]);
          resolve(data[0]);
        }).catch(err => {
          reject(err);
        })
    })
  }

  /**
   * get all posts with filter
   * @param count 
   * 
   * @param start 
   * @param dateFrom 
   * @param dateTo 
   * @param status 
   */
  public getAllPosts(count: number = 10, start: number = 0, dateFrom?: Date, dateTo?: Date, status?: PostStatusEnum): Promise<PostModel[]> {
    return new Promise((resolve, reject) => {
      let params = new HttpParams().set('count', count.toString()).set('start', start.toString());
      if (dateFrom) {
        params = params.set('dateFrom', this.formatDate(dateFrom));
        if (dateTo) {
          params = params.set('dateTo', this.formatDate(dateTo));
        }
      }
      if (status) {
        params = params.set('status', status);
      }

      this.httpService.get('post', params).then(resp => {
        let post = this.parsePost(resp.data);
        resolve(post)
      })
        .catch(err => {
          reject(err)
        })
    })
  }




  /**
   * 
   * get all post count 
   */
  public getPostCount(): Promise<number>;
  /**
   * get post count with status
   * @param status 
   */
  public getPostCount(status: string): Promise<number>;
  public getPostCount(status?: string): Promise<number> {
    return new Promise((resolve, reject) => {
      let path = 'count/post';
      console.log(status)
      if (status) {
        let param = new HttpParams()
          .set('status', status);
        this.httpService.get(path, param)
          .then(resp => {

            let count = this.parseCount(resp.data)
            resolve(count)
            console.log(count)
          })
          .catch(err => {
            reject(err)
          })
      }
      else {
        this.httpService.get(path)
          .then(resp => {
            let count = this.parseCount(resp.data)
            resolve(count)
            console.log(count)
          })
          .catch(err => {
            reject(err)
          })

      }
    })
  }





  /**
   * return date with (yyyy-mm-dd)
   * @param date
   */
  private formatDate(date: Date) {
    const day = date.getDate();
    const m = date.getMonth() + 1;
    const month = "0" + m
    const year = date.getFullYear();
    return `${year}-${month}-${day}`
  }

  public deleteTrashPost(): Promise<string>;
  /**
   * delete trash post
   * @param postId array of postId
   */
  public deleteTrashPost(postId: number[]): Promise<string>;
  public deleteTrashPost(postId?: number[]): Promise<string> {
    return new Promise((resolve, reject) => {
      let path = 'trash/post';
      if (postId && postId.length > 0) {
        let dataToSend = {
          "postId": postId
        }
        this.httpService.post(path, dataToSend)
          .then(resp => {
            resolve(resp.message);
          })
          .catch(err => {
            reject(err)
          })
      }
      else {
        this.httpService.post(path)
          .then(resp => {
            resolve(resp.message);
          })
          .catch(err => {
            reject(err)
          })


      }

    })
  }


  /**
   * get All Author
   */

  public getAllAuthor(): Promise<AuthorModel[]> {
    return new Promise((resolve, reject) => {
      let path: string = "user/author";
      this.httpService.get(path)
        .then(resp => {
          let authorList = this.parseAuthor(resp.data);
          resolve(authorList);
        })
        .catch(err => {
          reject(err);
        })
    })
  }




  /**
   * get all post by post status
   */
  public getAllPostByStatus(postStatus: string, start: number = 0, count: number = 10): Promise<PostModel[]> {
    return new Promise((resolve, reject) => {
      let path = '/post/status/';
      let param = new HttpParams()
        .set('start', start.toString())
        .set('count', count.toString())
      this.httpService.get(path + postStatus, param)
        .then(post => {
          let data = this.parsePost(post.data);
          resolve(data);
        })
        .catch(err => {
          reject(err)
        })
    })
  }


  /**
   * get menu catgories
   */
  public getMenuCategories(): Promise<PostCategoryModel[]> {
    return new Promise((resolve, reject) => {
      if (this.menuCategories && this.menuCategories.length > 0) {
        const cats = this.getLocalData('menu_cat');
        if (cats) {
          const localCats = this.parseCategories(cats);
          resolve(localCats);
        }
      } else {
        this.httpService.get('', new HttpParams().set('action', 'get_menu'))
          .then((data) => {
            const menu = this.parseCategories(data.data);
            this.setLocalData('menu_cat', menu);
            this.menuCategories = menu;
            resolve(menu);
          }).catch(err => {
            reject(err);
          });
      }
    });
  }



  /**
   * 
   * add new menu
   * @param menuName name of menu type string
   * 
   */
  public addNewMenu(menuName: string): Promise<MenuModel> {
    return new Promise((resolve, reject) => {
      let dataToSend = {
        "menuName": menuName
      };
      this.httpService.post('menu', dataToSend)
        .then(resp => {
          let newMenu = this.parseMenu([resp.data]);
          resolve(newMenu)
        })
        .catch(err => {
          reject(err)
        })
    })
  }

  /**
   * 
   * get All menu 
   */
  public getMenu(): Promise<MenuModel[]>;
  /**
   * get menu by menu id 
   * @param menuId  id of menu
   * @param start  start from in list
   * @param count number of menu you wants
   */
  public getMenu(menuId: number, start?: number, count?: number): Promise<MenuModel>;
  public getMenu(menuId?: number, start: number = 0, count: number = 10): Promise<MenuModel | MenuModel[]> {
    return new Promise((resolve, reject) => {
      let params = new HttpParams()
        .set('start', start.toString())
        .set('count', count.toString())
      let path = 'menu'
      if (menuId) {
        this.httpService.get(path + "/" + menuId)
          .then(resp => {
            let menu = this.parseMenu([resp.data]);
            resolve(menu);
            console.log(menu);
          })
          .catch(err => {
            reject(err);
          })
      }
      else {
        this.httpService.get('menu', params)
          .then(resp => {
            let menu = this.parseMenu([resp.data]);
            resolve(menu);
            console.log(menu);
          })
          .catch(err => {
            reject(err);
          })
      }
    })
  }

  /***
   * get menu Item by Id
   */
  public getMenuItemById(menuId: number, menuItemId: number): Promise<MenuItemModel> {
    return new Promise((resolve, reject) => {
      this.httpService.get('menu' + "/" + menuId + "/" + menuItemId)
        .then(resp => {
          let menuItem = this.parseMenuItems([resp.data])
          resolve(menuItem[0])
          console.log(menuItem)
        })
        .catch(err => {
          reject(err)
        })
    })
  }

  public addMenuItemByMenuId(menuId, menuItem: MenuItemModel): Promise<MenuItemModel> {
    return new Promise((resolve, reject) => {
      let data = JSON.stringify(menuItem)
      this.httpService.post('menu' + "/" + menuId, data)
        .then(resp => {
          let menuItem = this.parseMenuItems([resp.data]);
          resolve(menuItem[0]);
        })
        .catch(err => {
          reject(err);
        })

    })
  }


  // /**
  //  * get all news
  //  */
  // public getNews(): Promise<PostModel[]>;
  // /**
  //  * Get all news of a specified news category
  //  * @param categoryId id of the news category
  //  */
  // public getNews(categoryId: number): Promise<PostModel[]>;
  // /**
  //  * Get all news of a specified news category
  //  * @param categoryId id of the news category
  //  * @param count (default = 10) number of news want to get
  //  */
  // public getNews(categoryId: number, count: number): Promise<PostModel[]>;
  // /**
  //  * Get all news of a specified news category
  //  * @param categoryId id of the news category
  //  * @param count (default = 10) number of news want to get
  //  * @param from (default = 1) offset number from where want to get the news
  //  */
  // public getNews(categoryId: number, count: number, from: number): Promise<PostModel[]>;
  // public getNews(categoryId?: number, count?: number, from?: number): Promise<PostModel[]> {
  //   return new Promise((resolve, reject) => {

  //     count = typeof count === 'undefined' ? 10 : count;
  //     from = typeof from === 'undefined' ? 1 : from;

  //     let params = new HttpParams()
  //       .set('action', 'get_post_archive')
  //       .set('count', count.toString())
  //       .set('from', from.toString());

  //     if (categoryId) {
  //       params = params.set('categoryId', categoryId.toString());
  //     }


  //     this.httpService.get('', params).then((resp) => {
  //       const newslist = this.parsePost(resp.data);
  //       resolve(newslist);
  //     }).catch(err => {
  //       reject(err);
  //     });
  //   });
  // }


  /**
   * get news by id
   * @param newsId news Id
   */
  public getNewsByNewsId(newsId: number): Promise<PostModel>;
  public getNewsByNewsId(newsSlug: string, postType?: PostTypeEnum): Promise<PostModel>;
  public getNewsByNewsId(args: string | number, postType: PostTypeEnum = PostTypeEnum.Post): Promise<PostModel> {
    return new Promise((resolve, reject) => {
      const argsType = typeof args;

      let params = new HttpParams().set('action', 'get_single_post_by_id');
      if (argsType === 'number') {
        params = params.set('postId', args.toString());
      } else if (argsType === 'string') {
        params = params.set('postSlug', args.toString()).set('postType', postType);
      } else {
        throw console.error('argumnet not match');
      }
      this.httpService.get('', params)
        .then((news: any) => {
          const n = this.parsePost([news]);
          resolve(n[0]);
        }).catch(err => {
          reject(err);
        });
    });
  }


  public getRelatedPostByNewsId(postId: string, thumbnailSize: string = 'xsthumb'): Promise<PostModel[]> {
    return new Promise((resolve, reject) => {
      const params = new HttpParams()
        .set('action', 'get_related_posts')
        .set('post_id', postId)
        .set('thumbnailSize', thumbnailSize);
      this.httpService.get('', params)
        .then((data) => {
          if (data) {
            const relatedPostList = this.parsePost(data.data);
            resolve(relatedPostList);
          } else {
            reject('no data found');
          }
        }).catch(err => {
          reject(err);
        });
    });
  }


  public getSearchResults(searchTerm: string, count?: number, from?: number): Promise<PostModel[]> {
    return new Promise((resolve, reject) => {
      count = typeof count === 'undefined' ? 10 : count;
      from = typeof from === 'undefined' ? 1 : from;
      const params = new HttpParams()
        .set('action', 'search_posts')
        .set('search_term', searchTerm)
        .set('count', count.toString())
        .set('from', from.toString())
        .set('content_length', 'short');

      this.httpService.get('', params)
        .then((resp) => {
          const newslist = this.parsePost(resp.data);
          resolve(newslist);
        })
        .catch(err => {
          reject(err);
        });
    });
  }


  private async setLocalData(key: string, data: any) {
    localStorage.setItem('ks_' + key, JSON.stringify(data));
  }

  private getLocalData(key: string): any {
    return localStorage.getItem('ks_' + key);
  }

  private parseCategories(cats: any[]): PostCategoryModel[] {
    let catArr: PostCategoryModel[] = [];
    if (cats && cats.length > 0) {
      catArr = cats.map(c => {
        const cat: PostCategoryModel = new PostCategoryModel(parseInt(c.categoryId, 10), c.categoryName, c.categorySlug);
        if (c.subCategory && c.subCategory.length > 0) {
          cat.subCategory = this.parseCategories(c.subCategory);
        } else {
          cat.subCategory = [];
        }
        return cat;
      });
    }
    return catArr;
  }

  private parsePost(news: any[]) {
    let newslist: PostModel[] = [];

    if (news) {
      newslist = news.map(n => {
        let post: PostModel = new PostModel();
        post.postId = n.postId;
        post.title = n.title;
        post.slug = n.slug;
        post.content = n.content;
        if (n.status == PostStatusEnum.Draft) {
          post.status = PostStatusEnum.Draft;
        }
        else if (n.status == PostStatusEnum.Published) {
          post.status = PostStatusEnum.Published;
        }
        else if (n.status == PostStatusEnum.Scheduled) {
          post.status = PostStatusEnum.Scheduled;
        }
        else if (n.status == PostStatusEnum.Trash) {
          post.status = PostStatusEnum.Trash;
        }
        post.scheduledDate = n.scheduledDate;
        post.categoryList = this.parseCategories(n.categoryList);
        post.tags = n.tags;
        post.featuredImage = n.featuredImage || '/assets/images/news/default.jpg';
        post.authorId = n.authorId;
        post.createDate = new Date(n.createDate);
        post.createdBy = n.createdBy;
        post.publishedDate = new Date(n.publishedDate);
        post.canonicalUrl = n.canonicalUrl;
        if (n.postType == PostTypeEnum.Page) {
          post.postType = PostTypeEnum.Page;
        }
        else if (n.postType == PostTypeEnum.Post) {
          post.postType = PostTypeEnum.Post
        }
        return post;
      });
    }
    return newslist;
  }

  private parseAuthor(author) {
    let authorList: AuthorModel[] = [];
    if (author && author.length > 0) {
      authorList = author.map(a => {
        let _authorList: AuthorModel = new AuthorModel();
        _authorList.authorId = a.userId;
        _authorList.authorName = a.firstName + " " + a.lastName
        return _authorList;
      })
      return authorList
    }
  }

  private parseCount(post) {
    let pCount: number;
    if (post) {
      let _pcount: PostCountModel = new PostCountModel(post.published || 0, post.trash || 0, post.schedule || 0, post.draft || 0);
      return _pcount.published + _pcount.draft + _pcount.schedule + _pcount.trash;
    }
    return pCount
  }
  private parseMenu(menu) {
    let Menu: MenuModel;
    if (menu) {
      Menu = menu.map(m => {
        let _menu: MenuModel = new MenuModel();
        _menu.menuId = m.menuId;
        _menu.menuName = m.menuName;
        _menu.menuItems = this.parseMenuItems(m.menuItems);
        return _menu
      })
      return Menu
    }
  }

  private parseMenuItems(menuItems) {
    let menuItemList: MenuItemModel[] = [];
    if (menuItems) {
      menuItemList = menuItems.map(mI => {
        let _menuItem: MenuItemModel = new MenuItemModel();
        _menuItem.menuItemId = mI.menuItemId;
        _menuItem.menuItemName = mI.menuItemName;
        _menuItem.menuItemType = mI.menuItemType;
        _menuItem.menuItemUrl = mI.menuItemUrl;
        _menuItem.target = mI.target;
        return _menuItem;
      })
      return menuItemList
    }
  }

}
