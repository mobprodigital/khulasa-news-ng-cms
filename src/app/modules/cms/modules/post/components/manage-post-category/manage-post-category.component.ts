import { Component, OnInit, ViewChild } from '@angular/core';
import { PostCategoryModel } from 'src/app/model/post-category.model';
import { PostService } from 'src/app/service/post/post.service';
import { MatTableDataSource, MatPaginator, MatSort, MatDialog } from '@angular/material';
import { AddPostCatDialogComponent } from '../../dialogs/add-post-cat-dialog/add-post-cat-dialog.component';
import { IPostCatDialogResult } from 'src/app/interface/post-cat-dialog-result.interface';

@Component({
  selector: 'app-manage-post-category',
  templateUrl: './manage-post-category.component.html',
  styleUrls: ['./manage-post-category.component.css']
})
export class ManagePostCategoryComponent implements OnInit {



  displayedColumns: string[] = ['name', 'slug', 'action'];
  dataSource: MatTableDataSource<PostCategoryModel>;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  public categoryList: PostCategoryModel[] = [];


  constructor(
    private postSvc: PostService,
    public dialog: MatDialog
  ) {
    this.getAllPostCategories();
  }



  public getAllPostCategories() {
    this.postSvc.getPostCategories().then(cats => {
      this.categoryList = cats;
      this.dataSource = new MatTableDataSource<PostCategoryModel>(this.categoryList);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    }).catch(err => alert(err));
  }

  ngOnInit() {
  }


  public deleteCategory(rootCategoryId: number, subCategoryId?: number) {

    if (!confirm('Are you sure want to delete this category')) {
      return;
    }

    this.postSvc.deletePostCategory(rootCategoryId, subCategoryId).then(msg => {
      alert(msg);
      if (rootCategoryId && subCategoryId) {
        const rCat = this.categoryList.find(c => c.categoryId === rootCategoryId);
        if (rCat) {
          rCat.subCategory.splice(rCat.subCategory.findIndex(sc => sc.categoryId === subCategoryId), 1);
        }
      } else if (rootCategoryId) {
        this.categoryList.splice(this.categoryList.findIndex(c => c.categoryId === rootCategoryId), 1);
      }
    });
  }


  public addNewCategory(): void {
    const dialogRef = this.dialog.open(AddPostCatDialogComponent, {
      width: '500px',
      data: {
        isNew: true,
        targetCategory: null,
        parentCategory: null,
        categoryList: this.categoryList
      },
    });

    dialogRef.afterClosed().subscribe((result: IPostCatDialogResult) => {
      if (result.parentCategoryId) { // add child category
        const parentCategoryFound = this.categoryList.find(c => c.categoryId === result.parentCategoryId) as PostCategoryModel;
        if (parentCategoryFound) {
          parentCategoryFound.subCategory.push(result.targetCategory);
        }
      } else { // add root category
        this.categoryList.push(result.targetCategory);
      }
    });
  }


  public editCategory(targetCategory?: PostCategoryModel, parentCategory?: PostCategoryModel): void {

    const dialogRef = this.dialog.open(AddPostCatDialogComponent, {
      width: '500px',
      data: {
        isNew: false,
        targetCategory,
        parentCategory,
        categoryList: this.categoryList
      },
    });

    dialogRef.afterClosed().subscribe((result: IPostCatDialogResult) => {
      if (result.parentCategoryId) { // update child category
        const parentCategoryFound = this.categoryList.find(c => c.categoryId === result.parentCategoryId) as PostCategoryModel;
        if (parentCategoryFound) {
          const oldSubCatFound = parentCategoryFound.subCategory.find(sc => sc.categoryId === result.targetCategory.categoryId);
          if (oldSubCatFound) {
            oldSubCatFound.categoryName = result.targetCategory.categoryName;
            oldSubCatFound.categorySlug = result.targetCategory.categorySlug;
          }
        }
      } else { // update root category
        const parentCategoryFound = this.categoryList.find(c => c.categoryId === result.targetCategory.categoryId) as PostCategoryModel;
        if (parentCategoryFound) {
          parentCategoryFound.categoryName = result.targetCategory.categoryName;
          parentCategoryFound.categorySlug = result.targetCategory.categorySlug;
        }
      }
    });
  }


}
