import { Component, OnInit, ViewChild } from '@angular/core';
import { NewsCategoryModel } from 'src/app/model/news-category.model';
import { NewsService } from 'src/app/service/news/news.service';
import { MatTableDataSource, MatPaginator, MatSort, MatDialog } from '@angular/material';
import { AddNewsCatDialogComponent } from '../../dialogs/add-news-cat-dialog/add-news-cat-dialog.component';

@Component({
  selector: 'app-manage-news-category',
  templateUrl: './manage-news-category.component.html',
  styleUrls: ['./manage-news-category.component.css']
})
export class ManageNewsCategoryComponent implements OnInit {



  displayedColumns: string[] = ['name', 'slug', 'action'];
  dataSource: MatTableDataSource<NewsCategoryModel>;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(
    private newsService: NewsService,
    public dialog: MatDialog
  ) {
    this.getAllNewsCategories();
  }



  public getAllNewsCategories() {
    this.newsService.getNewsCategories().then(news => {
      this.dataSource = new MatTableDataSource<NewsCategoryModel>(news);
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
    let indexNumber = this.dataSource.data.findIndex(n => n.id === textId);
    this.dataSource.data.splice(indexNumber, 1);
    this.dataSource = new MatTableDataSource<NewsCategoryModel>(this.dataSource.data);
  }

  ngOnInit() {
  }

  /**
   * open news category dialog
   */
  openDialog(cat?: NewsCategoryModel): void {

    const dialogRef = this.dialog.open(AddNewsCatDialogComponent, {
      width: '250px',
      data: (cat ? cat : false),
    });

    dialogRef.afterClosed().subscribe((newCategory: NewsCategoryModel) => {
      if (newCategory) {
        console.log(newCategory);
      }
    });
  }

}
