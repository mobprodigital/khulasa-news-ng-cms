import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddNewsCatDialogComponent } from './add-news-cat-dialog.component';

describe('AddNewsCatDialogComponent', () => {
  let component: AddNewsCatDialogComponent;
  let fixture: ComponentFixture<AddNewsCatDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddNewsCatDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddNewsCatDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
