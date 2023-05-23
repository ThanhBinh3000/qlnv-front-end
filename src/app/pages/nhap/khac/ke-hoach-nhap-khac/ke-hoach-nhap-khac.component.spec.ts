import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KeHoachNhapKhacComponent } from './ke-hoach-nhap-khac.component';

describe('KeHoachNhapKhacComponent', () => {
  let component: KeHoachNhapKhacComponent;
  let fixture: ComponentFixture<KeHoachNhapKhacComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ KeHoachNhapKhacComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(KeHoachNhapKhacComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
