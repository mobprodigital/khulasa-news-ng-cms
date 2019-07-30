import { Component, OnInit } from '@angular/core';
import { MenuService } from 'src/app/service/menu/menu.service';
import { MatTableDataSource } from '@angular/material';
import { MenuModel } from 'src/app/model/menu.model';

@Component({
  selector: 'app-all-menu',
  templateUrl: './all-menu.component.html',
  styleUrls: ['./all-menu.component.scss']
})
export class AllMenuComponent implements OnInit {
  displayedColumns: string[] = ['position', 'name', 'action'];
  dataSource: MatTableDataSource<MenuModel>;
  public errMsg: string;

  public showLoader: boolean = true;
  constructor(private menuService: MenuService) { }

  public getAllMenu() {
    this.menuService.getMenu()
      .then(data => {
        this.dataSource = new MatTableDataSource(data);
      })
      .catch(err => {
        this.errMsg = err;
      })
      .finally(() => {
        this.showLoader = false;
      })

  }

  public deleteMenu(menuId) {
    console.log(menuId);
  }


  ngOnInit() {
    this.getAllMenu()
  }

}
