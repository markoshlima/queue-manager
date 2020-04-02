import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FormClientQueueComponent } from './form-client-queue.component';

describe('FormClientQueueComponent', () => {
  let component: FormClientQueueComponent;
  let fixture: ComponentFixture<FormClientQueueComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FormClientQueueComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FormClientQueueComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
