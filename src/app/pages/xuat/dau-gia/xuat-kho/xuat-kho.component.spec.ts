import { ComponentFixture, TestBed } from '@angular/core/testing';

import { XuatKhoComponent } from './xuat-kho.component';

describe('XuatKhoComponent', () => {
  let component: XuatKhoComponent;
  let fixture: ComponentFixture<XuatKhoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ XuatKhoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(XuatKhoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
