import { Component, OnInit, ViewChild } from '@angular/core';
import { PostModel } from 'src/app/model/post.model';
import { MatTableDataSource, MatPaginator, MatSort, MatSelectChange } from '@angular/material';
import { PostService } from 'src/app/service/post/post.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SelectionModel } from '@angular/cdk/collections';


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
  public postStatus;
  public dateFrom;
  public dateTo;
  public showLoader: boolean = true;
  public todayDate: Date;

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
    this.postService.getPost().then(news => {
      this.dataSource = new MatTableDataSource<PostModel>(news);
      setTimeout(() => {
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      }, 1)

    }).catch(err => alert(err)).finally(() => { this.showLoader = false });
  }

  public applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  public deleteNews(textId) {
    this.showLoader = true
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
      }).finally(() => { this.showLoader = false })
  }

  public deleteSelectedPost() {
    this.showLoader = true
    let postId = this.getCheckBoxId();
    if (postId.length && postId.length > 0) {
      for (let i = 0; i < postId.length; i++) {
        const indexNumber = this.dataSource.data.findIndex(n => n.postId === postId[i]);
        this.dataSource.data.splice(indexNumber, 1);
        this.dataSource = new MatTableDataSource<PostModel>(this.dataSource.data);
      }
      this.postService.deletePostByPostId(postId)
        .then(msg => {
          this._snackBar.open(msg, 'Done', {
            duration: 2000,
          });
        })
        .catch(err => {
          console.log(err);
        }).finally(() => { this.showLoader = false })
    }
    else {
      alert('Please select Post ')
    }
  }

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
    this.showLoader = true
    if (this.dateTo && this.dateFrom && this.postStatus) {
      let from = this.formatDate(this.dateFrom);
      let to = this.formatDate(this.dateTo)
      this.getFilteredPost(from, to, this.postStatus);
    }
    else if (this.dateTo && this.dateFrom) {
      let from = this.formatDate(this.dateFrom);
      let to = this.formatDate(this.dateTo)
      this.getFilteredPost(from, to, null);
    }

    else if (this.postStatus) {
      this.getFilteredPost(null, null, this.postStatus);
    }
  }


  public getFilteredPost(fromDate, toDate, status) {
    this.dataSource = null;
    this.postService.getPost(null, 10, 0, fromDate, toDate, status)
      .then(res => {

        this.dataSource = new MatTableDataSource<PostModel>(res);
        setTimeout(() => {
          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;
        }, 1)

      })
      .catch(err => console.log(err))
      .finally(() => { this.showLoader = false })
  }
  ngOnInit() {
    this.getAllNews();
    this.todayDate = new Date()
  }
}
