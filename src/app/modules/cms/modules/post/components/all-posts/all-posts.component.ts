import { Component, OnInit, ViewChild } from '@angular/core';
import { PostModel } from 'src/app/model/post.model';
import { MatTableDataSource, MatPaginator, MatSort, MatSelectChange } from '@angular/material';
import { PostService } from 'src/app/service/post/post.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SelectionModel } from '@angular/cdk/collections';
import { PageEvent } from '@angular/material';
import { FilterModel } from 'src/app/model/filter.model';
import { FormBuilder, FormGroup } from '@angular/forms';
import { PostTypeEnum } from 'src/app/enum/post-type.enum';
import { PostStatusEnum } from 'src/app/enum/post-status.enum';

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
  public postStatusForAction: string;
  public showLoader: boolean = true;
  public todayDate: Date;
  public tableLength: number;
  public pageSize: number = 10;
  public pageEvent: PageEvent;
  public isFilter: boolean = false;
  public index: number = 0;
  public filterForm: FormGroup;
  public errMsg: string;
  public isFilterValid: boolean = false;

  /** Whether the number of selected elements matches the total number of rows. */
  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }
  constructor(
    private postService: PostService,
    private _snackBar: MatSnackBar,
    private formBuilder: FormBuilder,
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
    })
      .catch(err => this.errMsg = err)
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

  public paging(pageEvent: PageEvent) {
    // if (this.index = pageEvent.pageIndex) {
    //   this.length = this.length
    // }

    // if (this.index < pageEvent.pageIndex) {
    //   this.index = pageEvent.pageIndex;
    //   this.tableLength = this.tableLength + 10;
    // }
    // else if (this.index > pageEvent.pageIndex) {
    //   this.index = pageEvent.pageIndex;
    //   this.tableLength = this.tableLength - 10;
    // }
    let start: number = (pageEvent.pageIndex * 10)
    let count: number = 10;
    if (this.isFilter) {
      let dateFrom: Date = this.filterForm.get('dateFrom').value;
      let dateTo: Date = this.filterForm.get('dateTo').value;
      let postStatus: PostStatusEnum = this.filterForm.get('postStatus').value;


      this.getFilteredPost(dateFrom, dateTo, postStatus, start, count);
    }
    else {
      this.postService.getAllPosts(10, start)
        .then(res => {
          this.dataSource = null;
          this.dataSource = new MatTableDataSource<PostModel>(res);

        })
        .catch(err => {
          this.errMsg = err;
        })
    }
  }

  public clearFilter() {
    this.showLoader = true;
    this.dataSource = null;
    this.isFilter = false;
    this.filterForm.reset()
    this.getAllNews();
  }


  private createFilterForm() {
    return this.formBuilder.group({
      dateFrom:  { disabled: true, value: '' },
      dateTo:  { disabled: true, value: '' },
      postStatus: '',
    })
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
    if (postId.length > 0 && this.postStatusForAction) {
      this.postService.changePostStatus(postId, this.postStatusForAction)
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

  public onSubmit() {

    let dateFrom: Date = this.filterForm.get('dateFrom').value;
    let dateTo: Date = this.filterForm.get('dateTo').value;
    let postStatus: PostStatusEnum = this.filterForm.get('postStatus').value;
    if (dateFrom || dateTo || postStatus) {
      this.isFilterValid = false
      this.dataSource = null;
      this.isFilter = true;
      let start: number = 0;
      let count: number = 10;
      this.postService.getPostCount(postStatus.toString())
        .then(num => {
          this.tableLength = num
        })
        .catch(err => {
          console.log(err)
        })
      this.getFilteredPost(dateFrom, dateTo, postStatus, start, count);
    }
    else {
      this.isFilterValid = true;
    }
  }

  public getFilteredPost(fromDate: Date, toDate: Date, status: PostStatusEnum, start: number, count: number) {
    this.postService.getAllPosts(count, start, fromDate, toDate, status)
      .then(res => {
        this.dataSource = new MatTableDataSource<PostModel>(res);
      })
      .catch(err => this.errMsg = err)
      .finally(() => { this.showLoader = false })
  }


  private getPostCount() {
    this.postService.getPostCount()
      .then(num => {
        this.tableLength = num
      })
      .catch(err => {
        console.log(err)
      })
  }

  ngOnInit() {
    this.getAllNews();
    this.todayDate = new Date();
    this.getPostCount();
    this.filterForm = this.createFilterForm();
  }
}
