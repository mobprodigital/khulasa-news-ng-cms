import { Component, OnInit } from '@angular/core';
import { MenuService } from 'src/app/service/menu/menu.service';
import { ActivatedRoute } from '@angular/router';
import { MenuModel } from 'src/app/model/menu.model';
import { PostService } from 'src/app/service/post/post.service';
import { PostCategoryModel } from 'src/app/model/post-category.model';
import { PostModel } from 'src/app/model/post.model';
import { MatCheckboxChange } from '@angular/material';

@Component({
  selector: 'app-add-menu',
  templateUrl: './add-menu.component.html',
  styleUrls: ['./add-menu.component.scss']
})
export class AddMenuComponent implements OnInit {
  public menuId: number = null;
  public errMsg: string = '';
  public menu: MenuModel = null;
  public showLoader: boolean = true;
  public categoryList: PostCategoryModel[] = [];
  public postList: PostModel[] = [];


  constructor(
    private menuSerive: MenuService,
    private activatedRoute: ActivatedRoute,
    private postSerive: PostService
  ) {
    this.menuId = parseInt(this.activatedRoute.snapshot.paramMap.get("id"));
    if (this.menuId) {
      this.getMenuById();
    }
  }

  public getMenuById() {
    this.menuSerive.getMenu(this.menuId)
      .then(data => {
        this.menu = data;
        console.log(this.menu);
      })
      .catch(err => {
        this.errMsg = err
      })
  }




  ngOnInit() {
    
    setTimeout(() => {
      this.showLoader = false;
    }, 1000);
  }



}
