import { Component, OnInit, ViewChild } from '@angular/core';
import { PostModel } from 'src/app/model/post.model';
import { MatTableDataSource, MatPaginator, MatSort, MatSelectChange } from '@angular/material';
import { PostService } from 'src/app/service/post/post.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SelectionModel } from '@angular/cdk/collections';
import { PageEvent } from '@angular/material';

@Component({
  selector: 'app-all-posts',
  templateUrl: './all-posts.component.html',
  styleUrls: ['./all-posts.component.css']
})
export class AllPostsComponent implements OnInit {

  displayedColumns: string[] = ['select', 'title', 'status', 'date', 'author', 'action'];
  dataSource: MatTableDataSource<PostModel>;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  selection = new SelectionModel<PostModel>(true, []);
  public postStatusToChange;
  public postStatus: Date;
  public dateFrom;
  public dateTo;
  public showLoader: boolean = true;
  public todayDate: Date;
  public length = 20;
  public pageSize = 10;
  public pageEvent: PageEvent;
  public isFilter: boolean = false;
  public index: number = 0;

  /** Whether the number of selected elements matches the total number of rows. */
  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }
  constructor(
    private postService: PostService,
    private _snackBar: MatSnackBar
  ) {

  }


  /** Selects all rows if they are not all selected; otherwise clear selection. */
  masterToggle() {
    this.isAllSelected() ?
      this.selection.clear() :
      this.dataSource.data.forEach(row => this.selection.select(row));
  }

  /** The label for the checkbox on the passed row */
  checkboxLabel(row?: PostModel): string {
    if (!row) {
      return `${this.isAllSelected() ? 'select' : 'deselect'} all`;
    }
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row.postId}`;
  }

  public getAllNews() {
    // this.postService.getPost().then(news => {
    this.postService.getAllPosts().then(news => {
      this.dataSource = new MatTableDataSource<PostModel>(news);
      if (news.length < 10) {
        this.length = news.length
      }
      else {
        this.length = 20
      }
    })
      .catch(err => alert(err))
      .finally(() => { this.showLoader = false });
  }

  public applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  public deleteNews(textId) {

    let isDelete: boolean = confirm('Are you sure to delete this post ?')
    if (isDelete) {
      this.showLoader = true;
      const indexNumber = this.dataSource.data.findIndex(n => n.postId === textId);
      this.dataSource.data.splice(indexNumber, 1);
      this.dataSource = new MatTableDataSource<PostModel>(this.dataSource.data);
      this.postService.deletePostByPostId([textId])
        .then(msg => {
          this._snackBar.open(msg, 'Done', {
            duration: 2000,
          });
        })
        .catch(err => {
          console.log(err);
        })
        .finally(() => {
          this.showLoader = false
        })
    }
  }

  public paging(pageEvent) {
    // if (this.index = pageEvent.pageIndex) {
    //   this.length = this.length
    // }

    if (this.index < pageEvent.pageIndex) {
      this.index = pageEvent.pageIndex;
      this.length = this.length + 10;
    }
    else if (this.index > pageEvent.pageIndex) {
      this.index = pageEvent.pageIndex;
      this.length = this.length - 10;
    }
    let start: number = (pageEvent.pageIndex * 10)
    let count: number = 10;
    if (this.isFilter) {
      this.getFilteredPost(this.dateFrom, this.dateTo, this.postStatus, start, count);
    }
    else {
      this.postService.getAllPosts(10, start)
        .then(res => {
          this.dataSource = null;
          this.dataSource = new MatTableDataSource<PostModel>(res);

        })
        .catch(err => {
          alert(err);
          this.length - 20;
        })
    }
  }

  public clearFilter() {
    this.showLoader = true;
    this.dataSource = null;
    this.isFilter = false;
    this.dateFrom = null;
    this.dateTo = null;
    this.postStatus = null;
    this.length = 20;
    this.getAllNews();
  }


  // public deleteSelectedPost() {
  //   this.showLoader = true
  //   let postId = this.getCheckBoxId();
  //   if (postId.length && postId.length > 0) {
  //     for (let i = 0; i < postId.length; i++) {
  //       const indexNumber = this.dataSource.data.findIndex(n => n.postId === postId[i]);
  //       this.dataSource.data.splice(indexNumber, 1);
  //       this.dataSource = new MatTableDataSource<PostModel>(this.dataSource.data);
  //     }
  //     this.postService.deletePostByPostId(postId)
  //       .then(msg => {
  //         this._snackBar.open(msg, 'Done', {
  //           duration: 2000,
  //         });
  //       })
  //       .catch(err => {
  //         console.log(err);
  //       }).finally(() => { this.showLoader = false })
  //   }
  //   else {
  //     alert('Please select Post ')
  //   }
  // }

  public changePostStatus() {
    this.showLoader = true
    let postId = this.getCheckBoxId();
    if (postId.length > 0 && this.postStatusToChange) {
      this.postService.changePostStatus(postId, this.postStatusToChange)
        .then(msg => {
          this.showLoader = false
          this._snackBar.open(msg, 'Done', {
            duration: 2000,
          });
          this.getAllNews();
          this.selection.clear()
        })
        .catch(err => {
          console.log(err)
        })
        .finally(() => { this.showLoader = false })
    }
    else {
      alert('Please Select Post or Post Status')
    }
  }

  public getCheckBoxId() {
    let postId = this.selection.selected.map(post => post.postId)
    return postId
  }

  public formatDate(date: Date) {
    const day = date.getDate();
    const m = date.getMonth() + 1;
    const month = "0" + m
    const year = date.getFullYear();
    return `${year}-${month}-${day}`
  }

  public filterPost() {
    this.length = 20;
    this.isFilter = true;
    this.dataSource = null;
    let start: number = 0;
    let count: number = 10;
    this.getFilteredPost(this.dateFrom, this.dateTo, this.postStatus, start, count);
  }


  public getFilteredPost(fromDate, toDate, status, start, count) {

    this.postService.getAllPosts(count, start, fromDate, toDate, status)
      .then(res => {
        this.dataSource = new MatTableDataSource<PostModel>(res);
        if (res.length < 10) {
          // this.length = res.length
        }
      })
      .catch(err => console.log(err))
      .finally(() => { this.showLoader = false })
  }

  ngOnInit() {
    this.getAllNews();
    this.todayDate = new Date()
  }
}
