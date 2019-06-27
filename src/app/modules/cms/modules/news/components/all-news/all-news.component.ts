import { Component, OnInit, ViewChild } from '@angular/core';
import { PostModel } from 'src/app/model/post.model';
import { MatTableDataSource, MatPaginator, MatSort } from '@angular/material';
import { PostService } from 'src/app/service/post/post.service';

@Component({
  selector: 'app-all-news',
  templateUrl: './all-news.component.html',
  styleUrls: ['./all-news.component.css']
})
export class AllNewsComponent implements OnInit {

  displayedColumns: string[] = ['title', 'date', 'author', 'action'];
  dataSource: MatTableDataSource<PostModel>;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(
    private newsService: PostService
  ) {
    this.getAllNews();
  }

  public getAllNews() {
    this.newsService.getNews().then(news => {
      this.dataSource = new MatTableDataSource<PostModel>(news);
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
    this.dataSource = new MatTableDataSource<PostModel>(this.dataSource.data);
  }

  ngOnInit() {
  }

}
