import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TongHopNhuCauChiDauTuPhatTrien3NamComponent } from './tong-hop-nhu-cau-chi-dau-tu-phat-trien-3-nam.component';

describe('TongHopNhuCauChiDauTuPhatTrien3NamComponent', () => {
  let component: TongHopNhuCauChiDauTuPhatTrien3NamComponent;
  let fixture: ComponentFixture<TongHopNhuCauChiDauTuPhatTrien3NamComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TongHopNhuCauChiDauTuPhatTrien3NamComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TongHopNhuCauChiDauTuPhatTrien3NamComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
