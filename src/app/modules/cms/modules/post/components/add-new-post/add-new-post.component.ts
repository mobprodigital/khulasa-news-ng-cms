import { Component, OnInit } from '@angular/core';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA, MatChipInputEvent, MatCheckboxChange } from '@angular/material';
import { PostModel } from 'src/app/model/post.model';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { PostCategoryModel } from 'src/app/model/post-category.model';
import { PostService } from 'src/app/service/post/post.service';
import { AddPostCatDialogComponent } from '../../dialogs/add-post-cat-dialog/add-post-cat-dialog.component';

@Component({
  selector: 'app-add-new-post',
  templateUrl: './add-new-post.component.html',
  styleUrls: ['./add-new-post.component.css']
})
export class AddNewPostComponent implements OnInit {


  public rtContent: any;
  public tagControlProp = {
    visible: true,
    selectable: true,
    removable: true,
    addOnBlur: true,
  };

  public categoriesList: PostCategoryModel[] = [];

  public coverImage: File = null;
  public thumbnailUrl: string | ArrayBuffer;
  readonly separatorKeysCodes: number[] = [ENTER, COMMA];


  public news: PostModel = new PostModel();
  public newsForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private newsService: PostService,
    private matDialog: MatDialog
  ) {

  }

  private getNewsData() {
    this.newsService.getPostCategories().then(cats => {
      this.categoriesList = cats;
    });
  }

  ngOnInit() {
    this.getNewsData();
    this.newsForm = this.createForm();
  }



  //#region tag

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

  //#endregion

  //#region fetured image
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

  //#endregion

  //#region news form
  private createForm() {
    return this.fb.group({
      id: [this.news.id, [Validators.required]],
      title: [this.news.title, [Validators.required]],
      content: [this.news.content, [Validators.required]],
      slug: [this.news.slug],
      published: [this.news.published],
      categories: this.fb.array(this.getCategoryControls()),
      tags: this.fb.array(this.news.tags),
      featuredImage: this.fb.group({
        original: [''],
        large: [''],
        medium: [''],
        small: [''],
      }),
      author: [this.news.author],
      createDate: [this.news.createDate],
      publishedDate: [this.news.publishedDate],
      canonicalUrl: [this.news.canonicalUrl]
    });
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

  setCategory($event: MatCheckboxChange, catg: PostCategoryModel) {

    //insert id into category list
    if ($event.checked) {
      let control = <FormArray>this.newsForm.controls.categories;
      if (!control.value.find((cat: number) => catg.categoryId === cat)) {
        control.value.push(catg.categoryId);
      }
    }
    //remove id from category list
    else {
      let control = <FormArray>this.newsForm.controls.categories;

      let catIndex = control.value.indexOf(catg.categoryId);
      if (catIndex > -1) {
        control.value.splice(catIndex, 1);
      }
    }
  }

  onSubmit() {
    console.log(this.newsForm.value);
    console.log(this.news);
  }

  //#endregion



}
