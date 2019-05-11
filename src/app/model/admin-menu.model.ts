/**
 * Admin menu to show in admin panel
 */
export class AdminMenu {
    constructor(
        /** Name of the menu */
        public name: string = "",
        /** Array of menu items */
        public menuItems: AdminMenuItem[] = [],
        /** Material icons to show  */
        public icon?: string
    ) { }

}

/**
 * Admin panel menu items
 */
export class AdminMenuItem {
    constructor(
        /** Name of the menu item */
        public name: string,
        /** Path of component */
        public path: string,
        /** Material icon to show */
        public icon?: string,
        /** Paremeters to pass */
        public parameters?: string) {
    }
}