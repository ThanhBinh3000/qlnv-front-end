import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SlGiaTriHangDtqgComponent } from './sl-gia-tri-hang-dtqg.component';

describe('KhGiamHangDtqgComponent', () => {
  let component: SlGiaTriHangDtqgComponent;
  let fixture: ComponentFixture<SlGiaTriHangDtqgComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SlGiaTriHangDtqgComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SlGiaTriHangDtqgComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
