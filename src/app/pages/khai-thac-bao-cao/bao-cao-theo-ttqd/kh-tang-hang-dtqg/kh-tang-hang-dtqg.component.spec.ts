import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KhTangHangDtqgComponent } from './kh-tang-hang-dtqg.component';

describe('KhTangHangDtqgComponent', () => {
  let component: KhTangHangDtqgComponent;
  let fixture: ComponentFixture<KhTangHangDtqgComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ KhTangHangDtqgComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(KhTangHangDtqgComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
