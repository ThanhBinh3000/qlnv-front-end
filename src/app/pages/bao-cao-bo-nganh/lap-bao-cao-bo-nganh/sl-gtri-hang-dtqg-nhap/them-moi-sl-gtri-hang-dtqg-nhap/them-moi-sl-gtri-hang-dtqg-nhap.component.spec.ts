import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ThemMoiSlGtriHangDtqgNhapComponent } from './them-moi-sl-gtri-hang-dtqg-nhap.component';

describe('ThemMoiSlGtriHangDtqgNhapComponent', () => {
  let component: ThemMoiSlGtriHangDtqgNhapComponent;
  let fixture: ComponentFixture<ThemMoiSlGtriHangDtqgNhapComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ThemMoiSlGtriHangDtqgNhapComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ThemMoiSlGtriHangDtqgNhapComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
