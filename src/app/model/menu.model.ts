
/**menu model for Portal view */
export class MenuModel {
    /**Id of menu*/
    public menuId: number;
    /**name of menu */
    public menuName: string;
    /**array of menuItem */
    public menuItems: MenuItemModel[];
}


/** menu item model for menuItems  */
export class MenuItemModel {
    /**id of menuItem */
    public menuItemId: number;
    /**name of menuItem */
    public menuItemName: string;
    /**type of menuItem */
    public menuItemType: string;
    /**url of menuItem */
    public menuItemUrl: string;
    /**target of menuItem */
    public target: string;
}