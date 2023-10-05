import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ThongTinDuLieuTongHopTcdtComponent } from './thong-tin-du-lieu-tong-hop-tcdt.component';

describe('ThongTinDuLieuTongHopTcdtComponent', () => {
  let component: ThongTinDuLieuTongHopTcdtComponent;
  let fixture: ComponentFixture<ThongTinDuLieuTongHopTcdtComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ThongTinDuLieuTongHopTcdtComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ThongTinDuLieuTongHopTcdtComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
