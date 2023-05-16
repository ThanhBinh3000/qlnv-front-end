import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SlGtriHangDtqgXcKThuTienComponent } from './sl-gtri-hang-dtqg-xc-k-thu-tien.component';

describe('SlGtriHangDtqgXcKThuTienComponent', () => {
  let component: SlGtriHangDtqgXcKThuTienComponent;
  let fixture: ComponentFixture<SlGtriHangDtqgXcKThuTienComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SlGtriHangDtqgXcKThuTienComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SlGtriHangDtqgXcKThuTienComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
