import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BaoCaoKqXuatHangDtqgNgoaiDmComponent } from './bao-cao-kq-xuat-hang-dtqg-ngoai-dm.component';

describe('BaoCaoKqXuatHangDtqgNgoaiDmComponent', () => {
  let component: BaoCaoKqXuatHangDtqgNgoaiDmComponent;
  let fixture: ComponentFixture<BaoCaoKqXuatHangDtqgNgoaiDmComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BaoCaoKqXuatHangDtqgNgoaiDmComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BaoCaoKqXuatHangDtqgNgoaiDmComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
