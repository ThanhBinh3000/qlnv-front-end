import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SlGtriHangDtqgXcKhacComponent } from './sl-gtri-hang-dtqg-xc-khac.component';

describe('SlGtriHangDtqgXcKhacComponent', () => {
  let component: SlGtriHangDtqgXcKhacComponent;
  let fixture: ComponentFixture<SlGtriHangDtqgXcKhacComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SlGtriHangDtqgXcKhacComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SlGtriHangDtqgXcKhacComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
