import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AllTrashPostComponent } from './all-trash-post.component';

describe('AllTrashPostComponent', () => {
  let component: AllTrashPostComponent;
  let fixture: ComponentFixture<AllTrashPostComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AllTrashPostComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AllTrashPostComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
