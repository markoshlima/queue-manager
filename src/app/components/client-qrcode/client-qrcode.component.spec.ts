import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ClientQrcodeComponent } from './client-qrcode.component';

describe('ClientQrcodeComponent', () => {
  let component: ClientQrcodeComponent;
  let fixture: ComponentFixture<ClientQrcodeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ClientQrcodeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ClientQrcodeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
