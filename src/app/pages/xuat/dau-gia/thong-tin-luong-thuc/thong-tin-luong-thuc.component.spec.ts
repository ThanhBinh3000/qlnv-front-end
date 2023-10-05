import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ThongTinLuongThucComponent } from './thong-tin-luong-thuc.component';

describe('ThongTinLuongThucComponent', () => {
  let component: ThongTinLuongThucComponent;
  let fixture: ComponentFixture<ThongTinLuongThucComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ThongTinLuongThucComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ThongTinLuongThucComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
