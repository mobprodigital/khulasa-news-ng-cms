import { Component, OnInit } from '@angular/core';
import { MenuService } from 'src/app/service/menu/menu.service';
import { ActivatedRoute, Router } from '@angular/router';
import { MenuModel, MenuItemModel } from 'src/app/model/menu.model';
import { PostService } from 'src/app/service/post/post.service';
import { PostCategoryModel } from 'src/app/model/post-category.model';
import { PostModel } from 'src/app/model/post.model';
import { MatCheckboxChange, MatTableDataSource } from '@angular/material';
import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { SelectionModel } from '@angular/cdk/collections';
import { MenuItemTypeEnum } from 'src/app/enum/menu-item-type.enum';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
@Component({
  selector: 'app-add-menu',
  templateUrl: './add-menu.component.html',
  styleUrls: ['./add-menu.component.scss']
})
export class AddMenuComponent implements OnInit {
  public menuId: number = null;
  public errMsg: string = '';
  public menu: MenuModel = null;
  public menuForm: FormGroup;
  public showLoader: boolean = true;
  // public categoryList: PostCategoryModel[] = [];
  // public postList: PostModel[] = [];

  constructor(
    private menuSerive: MenuService,
    private activatedRoute: ActivatedRoute,
    private postSerive: PostService,
    private router: Router,
    private fb: FormBuilder,
  ) {
    this.menuId = parseInt(this.activatedRoute.snapshot.paramMap.get("id"));
    if (this.menuId) {
      this.getMenuById();
    }

  }


  drop(event: CdkDragDrop<string[]>) {
    console.log(event.currentIndex, event.previousIndex);
  }

  categorydisplayedColumns: string[] = ['select', 'category-name'];
  categoryList = new MatTableDataSource<PostCategoryModel>();
  categorySelection = new SelectionModel<PostCategoryModel>(true, []);


  /** Whether the number of selected elements matches the total number of rows. */
  isAllSelectedCategoty() {
    const numSelected = this.categorySelection.selected.length;
    const numRows = this.categoryList.data.length;
    return numSelected === numRows;
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  masterToggleCategory() {
    this.isAllSelectedCategoty() ?
      this.categorySelection.clear() :
      this.categoryList.data.forEach(row => this.categorySelection.select(row));
  }

  /** The label for the checkbox on the passed row */
  checkboxLabelCategory(row?: PostCategoryModel): string {
    if (!row) {
      return `${this.isAllSelectedCategoty() ? 'select' : 'deselect'} all`;
    }
    return `${this.categorySelection.isSelected(row) ? 'deselect' : 'select'} row ${row.categoryName + 1}`;
  }

  


 

  public getMenuById() {
    this.menuSerive.getMenu(this.menuId)
      .then(data => {
        this.setMenu(data);
        this.menu = data
      })
      .catch(err => {
        this.errMsg = err
      })
  }

  public getCategory() {
    this.postSerive.getPostCategories()
      .then(cat => {
        this.categoryList = new MatTableDataSource<PostCategoryModel>(cat);
      })
      .catch(err => {
        this.errMsg = err;
      })
  }


  public getPost() {
    this.postSerive.getAllPosts()
      .then(data => {
        this.postList = new MatTableDataSource<PostModel>(data);
      })
      .catch(err => {
        this.errMsg = err;
      })
  }

  



 


  // public setCategory($event: MatCheckboxChange, catg: PostCategoryModel) {

  //   if ($event.checked) {

  //   }
  // }
  // public setPost($event: MatCheckboxChange, post: PostModel) {

  //   if ($event.checked) {
  //   }
  // }



  ngOnInit() {
    this.menuForm = this.createMenuForm();
    this.getCategory();
    this.getPost();
    setTimeout(() => {
      this.showLoader = false;
    }, 1000);
  }



}
