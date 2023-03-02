import { ComponentFixture, TestBed } from '@angular/core/testing';

import { XuatCapComponent } from './xuat-cap.component';

describe('XuatCapComponent', () => {
  let component: XuatCapComponent;
  let fixture: ComponentFixture<XuatCapComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ XuatCapComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(XuatCapComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
