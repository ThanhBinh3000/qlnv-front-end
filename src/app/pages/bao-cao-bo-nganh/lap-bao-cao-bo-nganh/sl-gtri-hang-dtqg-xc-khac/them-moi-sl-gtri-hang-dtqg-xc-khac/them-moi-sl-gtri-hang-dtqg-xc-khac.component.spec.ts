import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ThemMoiSlGtriHangDtqgXcKhacComponent } from './them-moi-sl-gtri-hang-dtqg-xc-khac.component';

describe('ThemMoiSlGtriHangDtqgXcKhacComponent', () => {
  let component: ThemMoiSlGtriHangDtqgXcKhacComponent;
  let fixture: ComponentFixture<ThemMoiSlGtriHangDtqgXcKhacComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ThemMoiSlGtriHangDtqgXcKhacComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ThemMoiSlGtriHangDtqgXcKhacComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
