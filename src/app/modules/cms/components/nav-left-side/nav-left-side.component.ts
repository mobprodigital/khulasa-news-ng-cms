import { Component, OnInit } from '@angular/core';
import { AdminMenu, AdminMenuItem } from 'src/app/model/admin-menu.model';

@Component({
  selector: 'app-nav-left-side',
  templateUrl: './nav-left-side.component.html',
  styleUrls: ['./nav-left-side.component.css']
})
export class NavLeftSideComponent implements OnInit {

  public menuList: AdminMenu[] = [];


  constructor() {
    this.insertMenuItems();
  }

  ngOnInit() {
  }

  /**
   * Insert menu items in menu list
   */
  public insertMenuItems(): void {

    const baseFolder = '/';

    this.menuList.push(...[
      new AdminMenu('News', [
        new AdminMenuItem('Add new', baseFolder + 'news/add-new'),
        new AdminMenuItem('All news', baseFolder + 'news/all-news'),
        new AdminMenuItem('Manage categories', baseFolder + 'news/manage-categories'),
      ]),
      new AdminMenu('Media', [
        new AdminMenuItem('Add new', baseFolder + 'media/add-new'),
        new AdminMenuItem('All Media', baseFolder + 'media/all-media')
      ]),
      new AdminMenu('User Accounts', [
        new AdminMenuItem('Add new', baseFolder + 'user-account/add-new'),
        new AdminMenuItem('All Users', baseFolder + 'user-account/all-users')
      ]),
    ])
  }
}
