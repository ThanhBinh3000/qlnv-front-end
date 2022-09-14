import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeXuatKeHoachComponent } from './de-xuat-ke-hoach.component';

describe('DeXuatKeHoachComponent', () => {
  let component: DeXuatKeHoachComponent;
  let fixture: ComponentFixture<DeXuatKeHoachComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DeXuatKeHoachComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DeXuatKeHoachComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
