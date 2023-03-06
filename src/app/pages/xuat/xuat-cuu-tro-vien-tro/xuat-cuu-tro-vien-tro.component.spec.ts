import { ComponentFixture, TestBed } from '@angular/core/testing';

import { XuatCuuTroVienTroComponent } from './xuat-cuu-tro-vien-tro.component';

describe('XuatCuuTroVienTroComponent', () => {
  let component: XuatCuuTroVienTroComponent;
  let fixture: ComponentFixture<XuatCuuTroVienTroComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ XuatCuuTroVienTroComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(XuatCuuTroVienTroComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
