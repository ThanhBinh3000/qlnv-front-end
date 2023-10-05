import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ThongTinQuyetDinhXuatCapComponent } from './thong-tin-quyet-dinh-xuat-cap.component';

describe('ThongTinQuyetDinhXuatCapComponent', () => {
  let component: ThongTinQuyetDinhXuatCapComponent;
  let fixture: ComponentFixture<ThongTinQuyetDinhXuatCapComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ThongTinQuyetDinhXuatCapComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ThongTinQuyetDinhXuatCapComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
