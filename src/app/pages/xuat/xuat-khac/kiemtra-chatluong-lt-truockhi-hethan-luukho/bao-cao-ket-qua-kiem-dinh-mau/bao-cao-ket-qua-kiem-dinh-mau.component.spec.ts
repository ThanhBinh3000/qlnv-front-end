import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BaoCaoKetQuaKiemDinhMauComponent } from './bao-cao-ket-qua-kiem-dinh-mau.component';

describe('BaoCaoKetQuaKiemDinhMauComponent', () => {
  let component: BaoCaoKetQuaKiemDinhMauComponent;
  let fixture: ComponentFixture<BaoCaoKetQuaKiemDinhMauComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BaoCaoKetQuaKiemDinhMauComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BaoCaoKetQuaKiemDinhMauComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
