import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ThemMoiSlGtriHangDtqgXuatVtComponent } from './them-moi-sl-gtri-hang-dtqg-xuat-vt.component';

describe('ThemMoiSlGtriHangDtqgXuatVtComponent', () => {
  let component: ThemMoiSlGtriHangDtqgXuatVtComponent;
  let fixture: ComponentFixture<ThemMoiSlGtriHangDtqgXuatVtComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ThemMoiSlGtriHangDtqgXuatVtComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ThemMoiSlGtriHangDtqgXuatVtComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
