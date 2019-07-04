import { Component, OnInit, ViewChild } from '@angular/core';
import { PostCategoryModel } from 'src/app/model/post-category.model';
import { PostService } from 'src/app/service/post/post.service';
import { MatTableDataSource, MatPaginator, MatSort, MatDialog } from '@angular/material';
import { AddPostCatDialogComponent } from '../../dialogs/add-post-cat-dialog/add-post-cat-dialog.component';

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

  constructor(
    private newsService: PostService,
    public dialog: MatDialog
  ) {
    this.getAllNewsCategories();
  }



  public getAllNewsCategories() {
    this.newsService.getNewsCategories().then(news => {
      this.dataSource = new MatTableDataSource<PostCategoryModel>(news);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    }).catch(err => alert(err));
  }

  public applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  public deleteNews(textId) {
    const indexNumber = this.dataSource.data.findIndex(n => n.id === textId);
    this.dataSource.data.splice(indexNumber, 1);
    this.dataSource = new MatTableDataSource<PostCategoryModel>(this.dataSource.data);
  }

  ngOnInit() {
  }

  /**
   * open news category dialog
   */
  openDialog(cat?: PostCategoryModel): void {

    const dialogRef = this.dialog.open(AddPostCatDialogComponent, {
      width: '250px',
      data: (cat ? cat : false),
    });

    dialogRef.afterClosed().subscribe((newCategory: PostCategoryModel) => {
      if (newCategory) {
        console.log(newCategory);
      }
    });
  }

}
