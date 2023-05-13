import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SlGtriHangDtqgNhapComponent } from './sl-gtri-hang-dtqg-nhap.component';

describe('SlGtriHangDtqgNhapComponent', () => {
  let component: SlGtriHangDtqgNhapComponent;
  let fixture: ComponentFixture<SlGtriHangDtqgNhapComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SlGtriHangDtqgNhapComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SlGtriHangDtqgNhapComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
