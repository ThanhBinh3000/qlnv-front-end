import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SlGtriHangDtqgXuatComponent } from './sl-gtri-hang-dtqg-xuat.component';

describe('SlGtriHangDtqgXuatComponent', () => {
  let component: SlGtriHangDtqgXuatComponent;
  let fixture: ComponentFixture<SlGtriHangDtqgXuatComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SlGtriHangDtqgXuatComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SlGtriHangDtqgXuatComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
