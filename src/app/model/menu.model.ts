import { MenuItemTypeEnum } from '../enum/menu-item-type.enum';

/**
 * menu model for Portal view
 */
export class MenuModel {
    /**Id of menu*/
    public menuId: number = null;
    /**name of menu */
    public menuName: string = '';
    /**array of menuItem */
    public menuItems: MenuItemModel[] = [];
}


/** 
* menu item model for menuItems
*/
export class MenuItemModel {
    /**id of menuItem */
    public itemId: number = null;
    /**name of menuItem */
    public itemName: string = '';
    /**type of menuItem */
    public itemType: MenuItemTypeEnum = null;
    /**url of menuItem */
    public itemUrl: string = '';
    /**target of menuItem */
    public target: string = '';
    /**position of menu item */
    public position: number = null
}