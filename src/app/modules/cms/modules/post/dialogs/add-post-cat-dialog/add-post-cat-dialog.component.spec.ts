import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddPostCatDialogComponent } from './add-post-cat-dialog.component';

describe('AddPostCatDialogComponent', () => {
  let component: AddPostCatDialogComponent;
  let fixture: ComponentFixture<AddPostCatDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddPostCatDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddPostCatDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
