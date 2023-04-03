import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ThBcSoLuongClCcdcComponent } from './th-bc-so-luong-cl-ccdc.component';

describe('KhTangHangDtqgComponent', () => {
  let component: ThBcSoLuongClCcdcComponent;
  let fixture: ComponentFixture<ThBcSoLuongClCcdcComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ThBcSoLuongClCcdcComponent]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ThBcSoLuongClCcdcComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
