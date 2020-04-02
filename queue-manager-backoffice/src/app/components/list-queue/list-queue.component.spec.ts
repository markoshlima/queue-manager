import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListQueueComponent } from './list-queue.component';

describe('ListQueueComponent', () => {
  let component: ListQueueComponent;
  let fixture: ComponentFixture<ListQueueComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListQueueComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListQueueComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
