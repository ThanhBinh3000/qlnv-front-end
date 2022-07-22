import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChucNangXuatKhoComponent } from './chuc-nang-xuat-kho.component';

describe('ChucNangXuatKhoComponent', () => {
  let component: ChucNangXuatKhoComponent;
  let fixture: ComponentFixture<ChucNangXuatKhoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ChucNangXuatKhoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ChucNangXuatKhoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
