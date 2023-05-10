import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TangHangDtqgComponent } from './tang-hang-dtqg.component';

describe('ThopNhapXuatHangDTQGComponent', () => {
  let component: TangHangDtqgComponent;
  let fixture: ComponentFixture<TangHangDtqgComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TangHangDtqgComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TangHangDtqgComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
