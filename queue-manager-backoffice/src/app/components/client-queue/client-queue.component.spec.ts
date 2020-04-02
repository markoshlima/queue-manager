import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ClientQueueComponent } from './client-queue.component';

describe('ClientQueueComponent', () => {
  let component: ClientQueueComponent;
  let fixture: ComponentFixture<ClientQueueComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ClientQueueComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ClientQueueComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
