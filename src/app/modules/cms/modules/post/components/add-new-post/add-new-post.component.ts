import { Component, OnInit } from '@angular/core';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA, MatChipInputEvent, MatCheckboxChange, MatSelect, MatSelectChange, MatCheckbox, MatSnackBar } from '@angular/material';
import { PostModel } from 'src/app/model/post.model';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { PostCategoryModel } from 'src/app/model/post-category.model';
import { PostService } from 'src/app/service/post/post.service';
import { AddPostCatDialogComponent } from '../../dialogs/add-post-cat-dialog/add-post-cat-dialog.component';
import * as ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { ActivatedRoute, Router } from '@angular/router';
import { PostStatusEnum } from 'src/app/enum/post-status.enum';
import { PostTypeEnum } from 'src/app/enum/post-type.enum';
import { alphaNumericWithSpace } from 'src/app/custom-valiators/alphaNumeric-with-Space.validator';

@Component({
  selector: 'app-add-new-post',
  templateUrl: './add-new-post.component.html',
  styleUrls: ['./add-new-post.component.css']
})
export class AddNewPostComponent implements OnInit {

  public Editor = ClassicEditor;
  public rtContent: any;
  public tagControlProp = {
    visible: true,
    selectable: true,
    removable: true,
    addOnBlur: true,
  };

  public time: string[] = [
    '00:00:00', '00:30:00', '01:00:00', '01:30:00', '02:00:00', '02:30:00', '03:00:00',
    '03:30:00', '04:00:00', '04:30:00', '05:00:00', '05:30:00', '06:00:00', '06:30:00',
    '07:00:00', '07:30:00', '08:00:00', '08:30:00', '09:00:00', '09:30:00', '10:00:00',
    '10:30:00', '11:00:00', '11:30:00', '12:00:00', '12:30:00', '13:00:00', '13:30:00',
    '14:00:00', '14:30:00', '15:00:00', '15:30:00', '16:00:00', '16:30:00', '17:00:00',
    '17:30:00', '18:00:00', '18:30:00', '19:00:00', '19:30:00', '20:00:00', '20:30:00',
    '21:00:00', '21:30:00', '22:00:00', '22:30:00', '23:00:00', '23:30:00', '00:00:00',
  ]

  public categoriesList: PostCategoryModel[] = [];
  public coverImage: File = null;
  public thumbnailUrl: string | ArrayBuffer;
  readonly separatorKeysCodes: number[] = [ENTER, COMMA];
  public news: PostModel = new PostModel();
  public newsForm: FormGroup;
  public postId: string = '';
  public postData: PostModel;
  public date;
  public todayDate: Date;

  // public CatId: number[] = [];

  constructor(
    private fb: FormBuilder,
    private newsService: PostService,
    private matDialog: MatDialog,
    private activeedRouter: ActivatedRoute,
    private postService: PostService,
    private router: Router,
    private _snackBar: MatSnackBar

  ) {
    this.postId = this.activeedRouter.snapshot.paramMap.get('id');
    if (this.postId) {
      this.getPostByPostId();
    }
  }

  private getPostCategory() {
    this.newsService.getPostCategories().then(cats => {
      this.categoriesList = cats;
    });
  }

  public getPostByPostId() {
    this.postService.getPost(parseInt(this.postId))
      .then(data => {
        this.setPostData(data[0]);
      })
  }
  public setPostData(post) {
    let date = this.getSDateStime(post.status, post.scheduledDate);
    let postSlug = this.getPostSlug(post.slug)
    this.newsForm.patchValue({
      title: post.title,
      content: post.content,
      status: post.status,
      tags: post.tags,
      authorId: post.authorId.toString(),
      postType: post.postType,
      postId: post.postId,
      createDate: post.createDate,
      canonicalUrl: post.canonicalUrl,
      slug: postSlug,
      scheduledDate: post.scheduledDate,
      sDate: date[0] || null,
      sTime: date[1] || null
    })
    this.tags(post.tags);
    this.setCheckBoxValue(post.categoryList)
  }

  public getSDateStime(status, sdate) {
    let date = [null, null]
    if (status == "scheduled") {
      let sd = sdate.toString();
      date = sd.split(' ');
    }
    return date
  }


  public getPostSlug(slug) {
    let s = slug.split('-');
    let postSlug = '';
    for (let i = 0; i < s.length; i++) {
      postSlug += s[i] + " "
    }
    return postSlug
  }


  public setCheckBoxValue(postId) {
    const categoryListControl = this.newsForm.get('categoryList').value as Array<string>;
    for (let i = 0; i < postId.length; i++) {
      categoryListControl.push(postId[i].categoryId)
    }
    let CatId = postId.map(c => c.categoryId);
    setTimeout(() => {
      if (this.categoriesList.length > 0 && this.categoriesList) {
        for (let i = 0; i < CatId.length; i++) {
          this.categoriesList.find(c => c.categoryId == CatId[i]).isSelected = true
        }
      }
    }, 1000);
  }


  public addPost() {
    if (this.newsForm.valid) {
      this.postService.addNewPost(this.newsForm.value).then(res => {
        if (res.postId) {
          this.router.navigateByUrl('/post/all-news');
          this._snackBar.open("Post Successfully Added", 'Done', {
            duration: 2000,
          });
        }
      })
    }
  }

  public updatePost() {
    this.postService.editPostByPostId(parseInt(this.postId), this.newsForm.value)
      .then(data => {
        if (data.postId) {
          this._snackBar.open("Post Successfully Updated", 'Done', {
            duration: 2000,
          });
        }
      })
      .catch(err => console.log(err))
  }
  public tags(tagList) {
    const tagControl = this.newsForm.get('tags').value as Array<string>;
    for (let i = 0; i < tagList.length; i++) {
      tagControl.push(tagList[i])
    }
  }




  private createForm() {
    return this.fb.group({
      postId: null,
      title: ['', [Validators.required]],
      content: ['', [Validators.required]],
      slug: ['', [alphaNumericWithSpace]],
      status: PostStatusEnum.Draft,
      categoryList: this.fb.array(this.getCategoryControls()),
      tags: this.fb.array(this.news.tags),
      featuredImage: null,
      authorId: null,
      canonicalUrl: null,
      scheduledDate: null,
      postType: PostTypeEnum.Post,
      sDate: null,
      sTime: null

    });
  }
  public coverImageChange(ev: MouseEvent) {
    const files: FileList = ev.target['files'];
    if (files && files.length > 0) {
      let img = files[0];
      this.coverImage = img;
      var reader = new FileReader();

      reader.onload = (event: ProgressEvent) => {
        this.thumbnailUrl = (<FileReader>event.target).result;
      }

      reader.readAsDataURL(img);
    }
    else {
      if (!this.thumbnailUrl) {
        this.thumbnailUrl = '';
      }
    }
  }
  public addTag(event: MatChipInputEvent): void {
    const input = event.input;
    const value = event.value;

    if ((value || '').trim()) {
      const tagControl = this.newsForm.get('tags').value as Array<string>;
      if (tagControl.indexOf(value) === -1) {
        tagControl.push(value);
      }
    }

    // Reset the input value
    if (input) {

      input.value = '';
    }
  }
  public removeTag(tag: string): void {
    const tags = this.newsForm.get('tags').value as Array<string>;
    const index = tags.indexOf(tag);
    if (index >= 0) {
      tags.splice(index, 1);
    }
  }
  private getCategoryControls() {
    return this.news.categoryList.map(cat => {
      let catFound = this.categoriesList.find(c => c.categoryId === cat.categoryId);
      if (catFound) {
        // catFound.selected = true;
      }
      return this.fb.control(cat);
    })
  }

  addNewCategory() {

    const catDialogRef = this.matDialog.open(AddPostCatDialogComponent, {
      width: '250px',
    });

    catDialogRef.afterClosed().subscribe((result: PostCategoryModel) => {
      if (result) {
        this.categoriesList.push(result);
      }
    })
    /* 
        let control = <FormArray>this.newsForm.controls.categories;
    
        control.push(
          this.fb.control(new NewsCategoryModel(10, 'World'))
        ) */
  }

  public setCategory($event: MatCheckboxChange, catg: PostCategoryModel) {

    //insert id into category list
    if ($event.checked) {
      let control = <FormArray>this.newsForm.controls.categoryList;
      if (!control.value.find((cat: number) => catg.categoryId === cat)) {
        control.value.push(catg.categoryId);
      }
    }
    //remove id from category list
    else {
      let control = <FormArray>this.newsForm.controls.categoryList;

      let catIndex = control.value.indexOf(catg.categoryId);
      if (catIndex > -1) {
        control.value.splice(catIndex, 1);
      }
    }

  }
  public formatDate(date: Date) {
    const day = date.getDate();
    const m = date.getMonth() + 1;
    const month = "0" + m
    const year = date.getFullYear();
    return `${year}-${month}-${day}`
  }
  onSubmit() {
    console.log(this.newsForm.get('categoryList').value)
    if (this.newsForm.get('status').value == 'scheduled') {
      let date = this.newsForm.get('sDate').value;
      let sdate = this.formatDate(date);
      let stime = this.newsForm.get('sTime').value;
      this.newsForm.controls['scheduledDate'].setValue(sdate + " " + stime);
    }

    if (this.newsForm.valid) {
      if (this.postId) {
        this.updatePost();
      }
      else {
        this.addPost()
      }
    }
  }

  //#endregion
  ngOnInit() {
    this.getPostCategory();
    this.newsForm = this.createForm();
    this.todayDate = new Date();
  }


}
