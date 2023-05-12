import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SlGtriHangDtqgComponent } from './sl-gtri-hang-dtqg.component';

describe('SlGtriHangDtqgComponent', () => {
  let component: SlGtriHangDtqgComponent;
  let fixture: ComponentFixture<SlGtriHangDtqgComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SlGtriHangDtqgComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SlGtriHangDtqgComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
