import { Component, OnInit } from '@angular/core';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA, MatChipInputEvent, MatCheckboxChange } from '@angular/material';
import { NewsModel } from 'src/app/model/news.model';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { NewsCategoryModel } from 'src/app/model/news-category.model';
import { NewsService } from 'src/app/service/news/news.service';
import { AddNewsCatDialogComponent } from '../../dialogs/add-news-cat-dialog/add-news-cat-dialog.component';

@Component({
  selector: 'app-add-new-news',
  templateUrl: './add-new-news.component.html',
  styleUrls: ['./add-new-news.component.css']
})
export class AddNewNewsComponent implements OnInit {


  public tagControlProp = {
    visible: true,
    selectable: true,
    removable: true,
    addOnBlur: true,
  }

  public categoriesList: NewsCategoryModel[] = []

  public coverImage: File = null;
  public thumbnailUrl: string | ArrayBuffer;
  readonly separatorKeysCodes: number[] = [ENTER, COMMA];


  public news: NewsModel = new NewsModel();
  public newsForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private newsService: NewsService,
    private matDialog: MatDialog
  ) {

  }

  private getNewsData() {
    this.newsService.getNewsCategories().then(cats => {
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
      let tagControl = <Array<string>>this.newsForm.get('tags').value;
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
    const tags = <Array<string>>this.newsForm.get('tags').value;
    let index = tags.indexOf(tag);
    if (index >= 0) {
      tags.splice(index, 1);
    }
  }

  //#endregion

  //#region fetured image
  public coverImageChange(ev: MouseEvent) {
    let files: FileList = ev.target['files'];
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
      let catFound = this.categoriesList.find(c => c.id === cat.id);
      if (catFound) {
        catFound.selected = true;
      }
      return this.fb.control(cat);
    })
  }

  addNewCategory() {

    const catDialogRef = this.matDialog.open(AddNewsCatDialogComponent, {
      width: '250px',
    });

    catDialogRef.afterClosed().subscribe((result: NewsCategoryModel) => {
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

  setCategory($event: MatCheckboxChange, catg: NewsCategoryModel) {

    //insert id into category list
    if ($event.checked) {
      let control = <FormArray>this.newsForm.controls.categories;
      if (!control.value.find((cat: number) => catg.id === cat)) {
        control.value.push(catg.id);
      }
    }
    //remove id from category list
    else {
      let control = <FormArray>this.newsForm.controls.categories;

      let catIndex = control.value.indexOf(catg.id);
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
