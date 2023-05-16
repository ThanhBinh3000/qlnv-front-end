import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SlGtriHangDtqgXuatVtComponent } from './sl-gtri-hang-dtqg-xuat-vt.component';

describe('SlGtriHangDtqgXuatVtComponent', () => {
  let component: SlGtriHangDtqgXuatVtComponent;
  let fixture: ComponentFixture<SlGtriHangDtqgXuatVtComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SlGtriHangDtqgXuatVtComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SlGtriHangDtqgXuatVtComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
