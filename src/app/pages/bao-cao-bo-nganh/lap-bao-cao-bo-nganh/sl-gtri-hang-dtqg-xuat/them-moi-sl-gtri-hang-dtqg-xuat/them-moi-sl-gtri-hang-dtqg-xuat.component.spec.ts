import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ThemMoiSlGtriHangDtqgXuatComponent } from './them-moi-sl-gtri-hang-dtqg-xuat.component';

describe('ThemMoiSlGtriHangDtqgXuatComponent', () => {
  let component: ThemMoiSlGtriHangDtqgXuatComponent;
  let fixture: ComponentFixture<ThemMoiSlGtriHangDtqgXuatComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ThemMoiSlGtriHangDtqgXuatComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ThemMoiSlGtriHangDtqgXuatComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
