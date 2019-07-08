import { Component, OnInit, Inject } from '@angular/core';
import { PostCategoryModel } from 'src/app/model/post-category.model';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { PostService } from 'src/app/service/post/post.service';
import { IPostCatDialogResult } from 'src/app/interface/post-cat-dialog-result.interface';

@Component({
  selector: 'app-add-post-cat-dialog',
  templateUrl: './add-post-cat-dialog.component.html',
  styleUrls: ['./add-post-cat-dialog.component.css']
})
export class AddPostCatDialogComponent implements OnInit {

  public categoryFormGroup: FormGroup;
  public parentCategoryId: number;
  public isNew: boolean = true;
  public modalTitle: string;
  public loading: boolean;
  constructor(
    private postSvc: PostService,
    public fb: FormBuilder,
    public dialogRef: MatDialogRef<AddPostCatDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: {
      isNew: boolean,
      targetCategory: PostCategoryModel,
      parentCategory?: PostCategoryModel,
      categoryList: PostCategoryModel[]
    }) {
    this.isNew = data.isNew;
    this.modalTitle = data.isNew ? 'Add new category' : 'Edit category';
    console.log(data);
  }

  ngOnInit() {
    this.categoryFormGroup = this.fb.group(
      {
        categoryName: [(this.data.targetCategory ? this.data.targetCategory.categoryName : ''), Validators.required],
        parentCategory: [(this.data.parentCategory ? this.data.parentCategory.categoryId : '')]
      }
    );
  }

  public onSubmit() {
    if (this.categoryFormGroup.valid) {
      this.loading = true;
      const parentCategoryId = this.categoryFormGroup.get('parentCategory').value;
      const categoryName = this.categoryFormGroup.get('categoryName').value;
      if (this.isNew) {
        if (parentCategoryId) {
          this.postSvc.addNewPostCategory(categoryName, parentCategoryId)
            .then((newCategory: PostCategoryModel) => {

              const result: IPostCatDialogResult = {
                parentCategoryId,
                targetCategory: newCategory
              };

              this.dialogRef.close(result);
            }).catch(err => alert(err))
            .finally(() => this.loading = false);
        } else {
          this.postSvc.addNewPostCategory(categoryName).then(newCategory => {
            const result: IPostCatDialogResult = {
              targetCategory: newCategory
            };
            this.dialogRef.close(result);
          }).catch(err => alert(err))
            .finally(() => this.loading = false);
        }

      } else {
        const editCategory: PostCategoryModel = new PostCategoryModel(
          this.data.targetCategory.categoryId,
          categoryName, this.data.targetCategory.categorySlug
        );

        this.postSvc.editPostcategory(editCategory, parentCategoryId).then(updatedcategory => {

          const result: IPostCatDialogResult = {
            parentCategoryId,
            targetCategory: updatedcategory
          };

          this.dialogRef.close(result);
        }).catch(err => alert(err))
          .finally(() => this.loading = false);


      }
    }

  }


  public close() {
    this.dialogRef.close();
  }

}
