import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ThemMoiSlGtriHangDtqgComponent } from './them-moi-sl-gtri-hang-dtqg.component';

describe('ThemMoiSlGtriHangDtqgComponent', () => {
  let component: ThemMoiSlGtriHangDtqgComponent;
  let fixture: ComponentFixture<ThemMoiSlGtriHangDtqgComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ThemMoiSlGtriHangDtqgComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ThemMoiSlGtriHangDtqgComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
