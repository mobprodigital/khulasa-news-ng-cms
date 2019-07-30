import { Injectable } from '@angular/core';
import { HttpService } from '../http/http.service';
import { MenuItemModel, MenuModel } from 'src/app/model/menu.model';
import { HttpParams } from '@angular/common/http';
import { MenuItemTypeEnum } from 'src/app/enum/menu-item-type.enum';

@Injectable({
  providedIn: 'root'
})
export class MenuService {

  constructor(private httpService: HttpService) {

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
            resolve(menu[0]);
          })
          .catch(err => {
            reject(err);
          })
      }
      else {
        this.httpService.get('menu', params)
          .then(resp => {
            let menu = this.parseMenu(resp.data);
            resolve(menu);
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
        })
        .catch(err => {
          reject(err)
        })
    })
  }


  /**
   * add menu item by menu id 
   * @param menuId id of menu
   * @param menuItem data object of menu item 
   * 
   */
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


  /**
   * 
   * delete menu item by id 
   * @param menuId id of menu
   * @param menuItemId id of menu item
   */
  public deleteMenuItemById(menuId: number, menuItemId: number): Promise<string> {
    return new Promise((resolve, reject) => {
      this.httpService.delete('menu' + "/" + menuId + "/" + menuItemId)
        .then(resp => {
          resolve(resp.message);
        })
        .catch(err => {
          reject(err);
        })
    })
  }



  /**
   * edit menu by id 
   * @param menuId id of menu
   * @param menuName new name of menu  
   */
  public editMenu(menuId: number, menuName: string): Promise<MenuModel> {
    return new Promise((resolve, reject) => {
      this.httpService.put('menu' + "/" + menuId, menuName)
        .then(resp => {
          let res = this.parseMenu([resp.data])
          resolve(res[0])
        })
        .catch(err => {
          reject(err)
        })
    })
  }


 






  /**parsing methods start */
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
        _menuItem.itemId = mI.itemId;
        _menuItem.itemName = mI.itemName;
        _menuItem.itemType = mI.itemType;
        _menuItem.itemUrl = mI.itemUrl;
        _menuItem.target = mI.target;
        return _menuItem;
      })
      return menuItemList
    }
  }

  /**parsing methods end */




}
