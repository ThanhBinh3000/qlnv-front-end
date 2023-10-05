import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ThongTinQuyetDinhPhuongAnComponent } from './thong-tin-quyet-dinh-phuong-an.component';

describe('ThongTinQuyetDinhPhuongAnComponent', () => {
  let component: ThongTinQuyetDinhPhuongAnComponent;
  let fixture: ComponentFixture<ThongTinQuyetDinhPhuongAnComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ThongTinQuyetDinhPhuongAnComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ThongTinQuyetDinhPhuongAnComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
