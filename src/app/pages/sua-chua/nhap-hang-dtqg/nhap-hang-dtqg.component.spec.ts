import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NhapHangDtqgComponent } from './nhap-hang-dtqg.component';

describe('NhapHangDtqgComponent', () => {
  let component: NhapHangDtqgComponent;
  let fixture: ComponentFixture<NhapHangDtqgComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NhapHangDtqgComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NhapHangDtqgComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
