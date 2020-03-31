import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FormQueueComponent } from './form-queue.component';

describe('FormQueueComponent', () => {
  let component: FormQueueComponent;
  let fixture: ComponentFixture<FormQueueComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FormQueueComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FormQueueComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
