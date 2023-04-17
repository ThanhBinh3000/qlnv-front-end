import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KeHoachSuaChuaThuongXuyenComponent } from './ke-hoach-sua-chua-thuong-xuyen.component';

describe('KeHoachSuaChuaThuongXuyenComponent', () => {
  let component: KeHoachSuaChuaThuongXuyenComponent;
  let fixture: ComponentFixture<KeHoachSuaChuaThuongXuyenComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ KeHoachSuaChuaThuongXuyenComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(KeHoachSuaChuaThuongXuyenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
