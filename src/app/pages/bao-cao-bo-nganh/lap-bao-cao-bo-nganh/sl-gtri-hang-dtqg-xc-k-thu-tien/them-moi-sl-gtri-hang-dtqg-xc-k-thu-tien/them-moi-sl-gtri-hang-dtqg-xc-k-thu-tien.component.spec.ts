import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ThemMoiSlGtriHangDtqgXcKThuTienComponent } from './them-moi-sl-gtri-hang-dtqg-xc-k-thu-tien.component';

describe('ThemMoiSlGtriHangDtqgXcKThuTienComponent', () => {
  let component: ThemMoiSlGtriHangDtqgXcKThuTienComponent;
  let fixture: ComponentFixture<ThemMoiSlGtriHangDtqgXcKThuTienComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ThemMoiSlGtriHangDtqgXcKThuTienComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ThemMoiSlGtriHangDtqgXcKThuTienComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
