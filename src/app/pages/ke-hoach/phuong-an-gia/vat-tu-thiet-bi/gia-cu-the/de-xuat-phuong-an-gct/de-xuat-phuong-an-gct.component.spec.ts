import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeXuatPhuongAnGctComponent } from './de-xuat-phuong-an-gct.component';

describe('DeXuatPhuongAnGctComponent', () => {
  let component: DeXuatPhuongAnGctComponent;
  let fixture: ComponentFixture<DeXuatPhuongAnGctComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DeXuatPhuongAnGctComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DeXuatPhuongAnGctComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
