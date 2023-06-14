import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PhieuNhapKhoComponent } from './phieu-nhap-kho.component';

describe('PhieuNhapKhoComponent', () => {
  let component: PhieuNhapKhoComponent;
  let fixture: ComponentFixture<PhieuNhapKhoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PhieuNhapKhoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PhieuNhapKhoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
