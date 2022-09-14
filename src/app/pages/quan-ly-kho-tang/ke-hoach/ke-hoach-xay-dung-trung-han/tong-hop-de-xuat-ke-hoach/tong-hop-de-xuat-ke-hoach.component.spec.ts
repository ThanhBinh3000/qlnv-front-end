import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TongHopDeXuatKeHoachComponent } from './tong-hop-de-xuat-ke-hoach.component';

describe('TongHopDeXuatKeHoachComponent', () => {
  let component: TongHopDeXuatKeHoachComponent;
  let fixture: ComponentFixture<TongHopDeXuatKeHoachComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TongHopDeXuatKeHoachComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TongHopDeXuatKeHoachComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
