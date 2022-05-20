import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ThemmoiQdinhNhapXuatHangComponent } from './themmoi-qdinh-nhap-xuat-hang.component';

describe('ThemmoiQdinhNhapXuatHangComponent', () => {
  let component: ThemmoiQdinhNhapXuatHangComponent;
  let fixture: ComponentFixture<ThemmoiQdinhNhapXuatHangComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ThemmoiQdinhNhapXuatHangComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ThemmoiQdinhNhapXuatHangComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
