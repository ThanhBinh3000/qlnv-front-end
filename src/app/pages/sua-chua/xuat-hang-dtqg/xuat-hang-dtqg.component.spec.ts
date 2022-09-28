import { ComponentFixture, TestBed } from '@angular/core/testing';

import { XuatHangDtqgComponent } from './xuat-hang-dtqg.component';

describe('XuatHangDtqgComponent', () => {
  let component: XuatHangDtqgComponent;
  let fixture: ComponentFixture<XuatHangDtqgComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ XuatHangDtqgComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(XuatHangDtqgComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
