import { Component, OnInit, ViewChild } from '@angular/core';
import { NewsModel } from 'src/app/model/news.model';
import { MatTableDataSource, MatPaginator, MatSort } from '@angular/material';
import { NewsService } from 'src/app/service/news/news.service';

@Component({
  selector: 'app-all-news',
  templateUrl: './all-news.component.html',
  styleUrls: ['./all-news.component.css']
})
export class AllNewsComponent implements OnInit {

  displayedColumns: string[] = ['title', 'date', 'author', 'action'];
  dataSource: MatTableDataSource<NewsModel>;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(
    private newsService: NewsService
  ) {
    this.getAllNews();
  }

  public getAllNews() {
    this.newsService.getNews().then(news => {
      this.dataSource = new MatTableDataSource<NewsModel>(news);
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
    this.dataSource = new MatTableDataSource<NewsModel>(this.dataSource.data);
  }

  ngOnInit() {
  }

}
