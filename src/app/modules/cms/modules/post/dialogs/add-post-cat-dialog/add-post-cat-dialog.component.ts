import { Component, OnInit, Inject } from '@angular/core';
import { NewsCategoryModel } from 'src/app/model/news-category.model';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

@Component({
  selector: 'app-add-post-cat-dialog',
  templateUrl: './add-post-cat-dialog.component.html',
  styleUrls: ['./add-post-cat-dialog.component.css']
})
export class AddPostCatDialogComponent implements OnInit {

  // public catForm: FormGroup;
  public categoryModel: NewsCategoryModel = new NewsCategoryModel(null, '');
  public dialogTitle: string = 'Add new category';
  constructor(
    public dialogRef: MatDialogRef<AddPostCatDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public categoryData: NewsCategoryModel) {
    console.log(categoryData)
    if (categoryData && categoryData instanceof NewsCategoryModel) {
      this.categoryModel = categoryData;
      this.dialogTitle = 'Edit category';
    }
  }

  ngOnInit() {
    /* this.catForm = new FormGroup({
      name: new FormControl(this.categoryModel.name, [Validators.required])
    }); */
  }

  closeDialog(newCat?: NewsCategoryModel) {
    this.dialogRef.close(newCat);
  }

  public catSubmit() {
    // if (this.catForm.valid) {
    this.categoryModel.slug = this.categoryModel.name.toLowerCase().split(' ').join('-');
    this.closeDialog(this.categoryModel);
    // }
  }

}
