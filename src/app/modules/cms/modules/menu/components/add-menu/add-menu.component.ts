import { Component, OnInit } from '@angular/core';
import { MenuService } from 'src/app/service/menu/menu.service';
import { ActivatedRoute, Router } from '@angular/router';
import { MenuModel, MenuItemModel } from 'src/app/model/menu.model';
import { PostService } from 'src/app/service/post/post.service';
import { PostCategoryModel } from 'src/app/model/post-category.model';
import { PostModel } from 'src/app/model/post.model';
import { MatCheckboxChange, MatTableDataSource, MatSnackBar } from '@angular/material';
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
  public url: string = '';
  public linkText: string = '';

  constructor(
    private menuSerive: MenuService,
    private activatedRoute: ActivatedRoute,
    private postSerive: PostService,
    private router: Router,
    private fb: FormBuilder,
    private _snackBar: MatSnackBar
  ) {
    this.menuId = parseInt(this.activatedRoute.snapshot.paramMap.get("id"));
    if (this.menuId) {
      this.getMenuById();
    }
  }


  drop(event: CdkDragDrop<string[]>) {
    // const menuItemsControl = this.menuForm.get('menuItems').value as Array<MenuItemModel>;

    // let menuItems: MenuItemModel = menuItemsControl.find(i => i.position == event.previousIndex + 1)
    // console.log(menuItems)
    // menuItemsControl.pop(menuItems)
    console.log(event.currentIndex, event.previousIndex);
  }

  categorydisplayedColumns: string[] = ['select', 'category-name'];
  categoryList = new MatTableDataSource<PostCategoryModel>();
  categorySelection = new SelectionModel<PostCategoryModel>(true, []);

  postdisplayedColumns: string[] = ['select', 'post-title'];
  postList = new MatTableDataSource<PostModel>();
  postSelection = new SelectionModel<PostModel>(true, []);

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


  /** Whether the number of selected elements matches the total number of rows. */
  isAllSelectedPost() {
    const numSelected = this.postSelection.selected.length;
    const numRows = this.postList.data.length;
    return numSelected === numRows;
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  masterTogglePost() {
    this.isAllSelectedPost() ?
      this.postSelection.clear() :
      this.postList.data.forEach(row => this.postSelection.select(row));
  }

  /** The label for the checkbox on the passed row */
  checkboxLabelPost(row?: PostModel): string {
    if (!row) {
      return `${this.isAllSelectedPost() ? 'select' : 'deselect'} all`;
    }
    return `${this.postSelection.isSelected(row) ? 'deselect' : 'select'} row ${row.title + 1}`;
  }

  /**add category,post,coustom url to menu funtion start */

  public addCategoryToMenu() {
    const menuItemsControl = this.menuForm.get('menuItems').value as Array<MenuItemModel>;
    let position: number;

    let categoryName: string[] = this.categorySelection.selected.map(cat => cat.categoryName);
    let categoryId: number[] = this.categorySelection.selected.map(cat => cat.categoryId);
    this.categorySelection.clear();
    for (let i = 0; i < categoryName.length; i++) {
      let item: MenuItemModel = new MenuItemModel();
      item.itemName = categoryName[i];
      item.itemType = MenuItemTypeEnum.Category;
      if (menuItemsControl.length) {
        let posititonList: number[] = menuItemsControl.map(i => i.position);
        let lastPositon = Math.max(...posititonList);
        position = lastPositon + 1
      }
      else {
        position = i + 1
      }
      item.target = "_blank";
      item.position = position;
      menuItemsControl.push(item)
    }
  }

  public addPostToMenu() {
    const menuItemsControl = this.menuForm.get('menuItems').value as Array<MenuItemModel>;
    let position: number;

    let postTitle: string[] = this.postSelection.selected.map(post => post.title);
    let postId: number[] = this.postSelection.selected.map(post => post.postId);
    this.postSelection.clear();
    for (let i = 0; i < postTitle.length; i++) {
      let item: MenuItemModel = new MenuItemModel();
      item.itemName = postTitle[i];
      item.itemType = MenuItemTypeEnum.Post;
      item.itemUrl = postId[i];
      item.target = "_blank";
      if (menuItemsControl.length) {
        let posititonList: number[] = menuItemsControl.map(i => i.position);
        let lastPositon = Math.max(...posititonList);
        item.position = lastPositon + 1
      }
      else {
        position = i + 1
      }

      menuItemsControl.push(item)
    }
  }

  public addUrlToMenu() {
    const menuItemsControl = this.menuForm.get('menuItems').value as Array<MenuItemModel>;
    let position
    if (menuItemsControl.length) {
      let posititonList: number[] = menuItemsControl.map(i => i.position);
      let lastPositon = Math.max(...posititonList);
      position = lastPositon + 1
    }
    else {
      position = 1
    }

    let item: MenuItemModel = new MenuItemModel();
    item.itemName = this.linkText;
    item.itemType = MenuItemTypeEnum.Url;
    item.itemUrl = this.url;
    item.target = "_blank";
    item.position = position;
    menuItemsControl.push(item);
    this.linkText = '';
    this.url = '';
  }

  /**add category,post,coustom url to menu funtion end  */


  /**delete menu item by id funtion start  */

  public deleteItem(itemId, position) {
    const menuItemsControl = this.menuForm.get('menuItems').value as Array<MenuItemModel>;
    console.log(position)
    if (itemId) {
      menuItemsControl.splice(position - 1, 1)
      this.menuSerive.deleteMenuItemById(this.menuId, itemId)
        .then(msg => {
          this._snackBar.open(msg, 'Done', {
            duration: 2000,
          });
        })
        .catch(err => {
          this.errMsg = err
        })
    }
    else {
      menuItemsControl.splice(position - 1, 1)
    }

  }

  /**delete menu item by id funtion end  */

  /** create form and patch value function start */

  private createMenuForm() {
    return this.fb.group({
      menuId: "",
      menuName: ["", Validators.required],
      menuItems: this.fb.array([])
    })
  }

  private setMenu(menu: MenuModel) {
    // this.menuForm.controls['menuName'].setValue(menu.menuName);
    // this.menuForm.controls['menuId'].setValue(menu.menuId);
    this.menuForm.patchValue({
      menuId: menu.menuId,
      menuName: menu.menuName
    });
    this.setmenuItems(menu.menuItems);

  }

  private setmenuItems(item: MenuItemModel[]) {
    const menuItemsControl = this.menuForm.get('menuItems').value as Array<MenuItemModel>;
    for (let i = 0; i < item.length; i++) {
      menuItemsControl.push(item[i]);
    }
  }

  /** create form and patch value function end */


  public onSubmit() {
    if (this.menuForm.valid) {
      if (this.menuId) {
        let item = this.menuForm.get('menuItems').value;
        let sendItem = item.filter(i => i.itemId == null)
        console.log(sendItem)
        this.menuSerive.addMenuItemByMenuId(this.menuId, sendItem)
          .then(data => {
            console.log(data)
          })
          .catch(err => this.errMsg = err)
      }
      else {
        this.menuSerive.addNewMenu(this.menuForm.get('menuName').value)
          .then(data => {
            this.router.navigateByUrl('/menu/edit' + "/" + data.menuId);
            console.log(data);
          })
          .catch(err => { this.errMsg = err });
      }
    }

    console.log(this.menuForm.value);
  }


  /** initial calling function start  */

  public getMenuById() {
    this.menuSerive.getMenu(this.menuId)
      .then(data => {
        this.menu = data;
        this.setMenu(data);

      })
      .catch(err => {
        this.errMsg = err
      })
  }


  /**initial calling function end */


  ngOnInit() {
    this.menuForm = this.createMenuForm();
    this.getCategory();
    this.getPost();
    setTimeout(() => {
      this.showLoader = false;
    }, 1000);
  }

}
